package dataaccess

import (
	"database/sql"
	"errors"
	"modgo/internal/database"
	"modgo/internal/models"
	"time"
)

// ListCommentsByPostID retrieves comments for a specific post (non-deleted)
func ListCommentsByPostID(db *database.Database, postID int) ([]models.Comment, error) {
	rows, err := db.Query(`
		SELECT comment_id, post_id, user_id, body, created_at, updated_at, deleted_at, like_count
		FROM comments
		WHERE post_id = $1 AND deleted_at IS NULL
		ORDER BY created_at`, postID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var comments []models.Comment
	for rows.Next() {
		var c models.Comment
		var deletedAt sql.NullTime
		if err := rows.Scan(
			&c.CommentID, &c.PostID, &c.UserID, &c.Body,
			&c.CreatedAt, &c.UpdatedAt, &deletedAt, &c.LikeCount,
		); err != nil {
			return nil, err
		}
		if deletedAt.Valid {
			c.DeletedAt = &deletedAt.Time
		}
		comments = append(comments, c)
	}
	return comments, rows.Err()
}

// CreateComment adds a new comment to a post and increments comment_count
func CreateComment(db *database.Database, comment models.Comment) (models.Comment, error) {
	var deletedAt sql.NullTime
	err := db.QueryRow(`
		INSERT INTO comments (post_id, user_id, body)
		VALUES ($1, $2, $3)
		RETURNING comment_id, post_id, user_id, body, created_at, updated_at, deleted_at, like_count`,
		comment.PostID, comment.UserID, comment.Body,
	).Scan(
		&comment.CommentID, &comment.PostID, &comment.UserID, &comment.Body,
		&comment.CreatedAt, &comment.UpdatedAt, &deletedAt, &comment.LikeCount,
	)
	if err != nil {
		return models.Comment{}, err
	}
	if deletedAt.Valid {
		comment.DeletedAt = &deletedAt.Time
	}

	// increment post comment_count
	_, _ = db.Exec(`UPDATE posts SET comment_count = comment_count + 1 WHERE post_id = $1`, comment.PostID)

	return comment, nil
}

// UpdateComment updates an existing comment (ignores soft-deleted)
func UpdateComment(db *database.Database, commentID int, updated models.Comment) (models.Comment, error) {
	var deletedAt sql.NullTime
	err := db.QueryRow(`
		UPDATE comments
		SET body = $1, updated_at = $2
		WHERE comment_id = $3 AND deleted_at IS NULL
		RETURNING comment_id, post_id, user_id, body, created_at, updated_at, deleted_at, like_count`,
		updated.Body, time.Now(), commentID,
	).Scan(
		&updated.CommentID, &updated.PostID, &updated.UserID, &updated.Body,
		&updated.CreatedAt, &updated.UpdatedAt, &deletedAt, &updated.LikeCount,
	)
	if err != nil {
		return models.Comment{}, err
	}
	if deletedAt.Valid {
		updated.DeletedAt = &deletedAt.Time
	}
	return updated, nil
}

// DeleteComment soft-deletes a comment by replacing its content
func DeleteComment(db *database.Database, commentID int) error {
	res, err := db.Exec(`
		UPDATE comments
		SET deleted_at = NOW(), body = 'User has deleted this comment'
		WHERE comment_id = $1 AND deleted_at IS NULL`, commentID)
	if err != nil {
		return err
	}
	n, _ := res.RowsAffected()
	if n == 0 {
		return errors.New("comment not found")
	}
	return nil
}

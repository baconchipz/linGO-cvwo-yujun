package dataaccess

import (
	"database/sql"
	"errors"
	"modgo/internal/database"
	"modgo/internal/models"
	"time"
)

// List all non-deleted posts
func ListPosts(db *database.Database) ([]models.Post, error) {
	rows, err := db.Query(`
        SELECT post_id, user_id, title, body, module_id,
               created_at, updated_at, deleted_at, like_count, comment_count
        FROM posts
        WHERE deleted_at IS NULL
        ORDER BY created_at DESC`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var posts []models.Post
	for rows.Next() {
		var p models.Post
		var deletedAt sql.NullTime
		var moduleID int64
		if err := rows.Scan(
			&p.PostID, &p.UserID, &p.Title, &p.Body, &moduleID,
			&p.CreatedAt, &p.UpdatedAt, &deletedAt, &p.LikeCount, &p.CommentCount,
		); err != nil {
			return nil, err
		}
		p.ModuleID = int(moduleID)
		if deletedAt.Valid {
			p.DeletedAt = &deletedAt.Time
		}
		posts = append(posts, p)
	}
	return posts, rows.Err()
}

// Create a post
func CreatePost(db *database.Database, post models.Post) (models.Post, error) {
	var deletedAt sql.NullTime
	var moduleID int64
	err := db.QueryRow(`
		INSERT INTO posts (user_id, title, body, module_id)
		VALUES ($1, $2, $3, $4)
		RETURNING post_id, user_id, title, body, module_id, created_at, updated_at, deleted_at, like_count, comment_count`,
		post.UserID, post.Title, post.Body, post.ModuleID,
	).Scan(&post.PostID, &post.UserID, &post.Title, &post.Body, &moduleID, &post.CreatedAt, &post.UpdatedAt, &deletedAt, &post.LikeCount, &post.CommentCount)
	if err != nil {
		return models.Post{}, err
	}
	post.ModuleID = int(moduleID)
	if deletedAt.Valid {
		post.DeletedAt = &deletedAt.Time
	}
	return post, nil
}

// Update a post (soft-deleted posts are ignored)
func UpdatePost(db *database.Database, postID int, updated models.Post) (models.Post, error) {
	var deletedAt sql.NullTime
	var moduleID int64
	err := db.QueryRow(`
		UPDATE posts
		SET title = $1, body = $2, module_id = $3, updated_at = $4
		WHERE post_id = $5 AND deleted_at IS NULL
		RETURNING post_id, user_id, title, body, module_id,
				  created_at, updated_at, deleted_at, like_count, comment_count`,
		updated.Title, updated.Body, updated.ModuleID, time.Now(), postID,
	).Scan(
		&updated.PostID, &updated.UserID, &updated.Title, &updated.Body, &moduleID,
		&updated.CreatedAt, &updated.UpdatedAt, &deletedAt, &updated.LikeCount, &updated.CommentCount,
	)
	if err != nil {
		return models.Post{}, err
	}
	updated.ModuleID = int(moduleID)
	if deletedAt.Valid {
		updated.DeletedAt = &deletedAt.Time
	}
	return updated, nil
}

// Soft delete a post
func DeletePost(db *database.Database, postID int) error {
	res, err := db.Exec(`
        UPDATE posts
        SET deleted_at = NOW(), title = '[Deleted]', body = 'User has deleted this post'
        WHERE post_id = $1 AND deleted_at IS NULL`, postID)
	if err != nil {
		return err
	}
	n, _ := res.RowsAffected()
	if n == 0 {
		return errors.New("post not found")
	}
	return nil
}

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
        SELECT p.post_id, p.user_id, p.title, p.body, p.module_id,
               m.module_code,
               p.created_at, p.updated_at, p.deleted_at, p.like_count, p.comment_count
        FROM posts p
        LEFT JOIN modules m ON p.module_id = m.module_id
        WHERE p.deleted_at IS NULL
        ORDER BY p.created_at DESC`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var posts []models.Post
	for rows.Next() {
		var p models.Post
		var deletedAt sql.NullTime
		if err := rows.Scan(
			&p.PostID, &p.UserID, &p.Title, &p.Body, &p.ModuleID,
			&p.ModuleCode,
			&p.CreatedAt, &p.UpdatedAt, &deletedAt, &p.LikeCount, &p.CommentCount,
		); err != nil {
			return nil, err
		}
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
	err := db.QueryRow(`
		INSERT INTO posts (user_id, title, body, module_id)
		VALUES ($1, $2, $3, $4)
		RETURNING post_id, user_id, title, body, module_id, created_at, updated_at, deleted_at, like_count, comment_count`,
		post.UserID, post.Title, post.Body, post.ModuleID,
	).Scan(&post.PostID, &post.UserID, &post.Title, &post.Body, &post.ModuleID, &post.CreatedAt, &post.UpdatedAt, &deletedAt, &post.LikeCount, &post.CommentCount)
	if err != nil {
		return models.Post{}, err
	}
	if deletedAt.Valid {
		post.DeletedAt = &deletedAt.Time
	}
	return post, nil
}

// Update a post (soft-deleted posts are ignored)
func UpdatePost(db *database.Database, postID int, updated models.Post) (models.Post, error) {
	var deletedAt sql.NullTime
	err := db.QueryRow(`
		UPDATE posts
		SET title = $1, body = $2, module_id = $3, updated_at = $4
		WHERE post_id = $5 AND deleted_at IS NULL
		RETURNING post_id, user_id, title, body, module_id,
				  created_at, updated_at, deleted_at, like_count, comment_count`,
		updated.Title, updated.Body, updated.ModuleID, time.Now(), postID,
	).Scan(
		&updated.PostID, &updated.UserID, &updated.Title, &updated.Body, &updated.ModuleID,
		&updated.CreatedAt, &updated.UpdatedAt, &deletedAt, &updated.LikeCount, &updated.CommentCount,
	)
	if err != nil {
		return models.Post{}, err
	}
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

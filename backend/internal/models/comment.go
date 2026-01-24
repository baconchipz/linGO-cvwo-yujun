package models

import "time"

type Comment struct {
	CommentID int        `json:"comment_id"`
	PostID    int        `json:"post_id"`
	UserID    int        `json:"user_id"`
	Body      string     `json:"body"`
	CreatedAt time.Time  `json:"created_at"`
	UpdatedAt time.Time  `json:"updated_at"`
	DeletedAt *time.Time `json:"deleted_at,omitempty"`
	LikeCount int        `json:"like_count"`
}

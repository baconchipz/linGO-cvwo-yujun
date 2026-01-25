package models

import "time"

type Comment struct {
	CommentID int        `json:"comment_id"`
	PostID    int        `json:"post_id"`
	UserID    int        `json:"user_id"`
	Username  string     `json:"username,omitempty"`
	Body      string     `json:"body"`
	CreatedAt time.Time  `json:"created_at"`
	UpdatedAt time.Time  `json:"updated_at"`
	DeletedAt *time.Time `json:"deleted_at,omitempty"`
	LikeCount int        `json:"like_count"`
}

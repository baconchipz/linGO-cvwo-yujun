package models

import "time"

type Post struct {
	PostID       int        `json:"post_id"`
	UserID       int        `json:"user_id"`
	Title        string     `json:"title"`
	Body         string     `json:"body"`
	ModuleID     int        `json:"module_id"`
	CreatedAt    time.Time  `json:"created_at"`
	UpdatedAt    time.Time  `json:"updated_at"`
	DeletedAt    *time.Time `json:"deleted_at,omitempty"`
	LikeCount    int        `json:"like_count"`
	CommentCount int        `json:"comment_count"`
}

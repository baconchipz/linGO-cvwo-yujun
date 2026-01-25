package models

import (
	"time"

	"github.com/google/uuid"
)

type Post struct {
	PostID       int        `json:"post_id"`
	UserID       int        `json:"user_id"`
	Username     string     `json:"username,omitempty"`
	Title        string     `json:"title"`
	Body         string     `json:"body"`
	ModuleID     uuid.UUID  `json:"module_id"`
	ModuleCode   string     `json:"module_code,omitempty"`
	CreatedAt    time.Time  `json:"created_at"`
	UpdatedAt    time.Time  `json:"updated_at"`
	DeletedAt    *time.Time `json:"deleted_at,omitempty"`
	LikeCount    int        `json:"like_count"`
	CommentCount int        `json:"comment_count"`
}

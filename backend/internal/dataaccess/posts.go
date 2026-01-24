package dataaccess

import (
	"modgo/internal/database"
	"modgo/internal/models"
	"time"
)

var mockPosts = []models.Post{
	{
		PostID:       1,
		UserID:       1,
		Title:        "Welcome to CS2030!",
		Body:         "Anyone else excited for this module?",
		ModuleID:     "CS2030",
		CreatedAt:    time.Now().Add(-2 * time.Hour),
		UpdatedAt:    time.Now().Add(-2 * time.Hour),
		LikeCount:    5,
		CommentCount: 2,
	},
	{
		PostID:       2,
		UserID:       1,
		Title:        "Need help with vim",
		Body:         "Can someone explain why i cannot run?",
		ModuleID:     "CS2030",
		CreatedAt:    time.Now().Add(-1 * time.Hour),
		UpdatedAt:    time.Now().Add(-1 * time.Hour),
		LikeCount:    3,
		CommentCount: 0,
	},
}

func ListPosts(db *database.Database) ([]models.Post, error) {
	return mockPosts, nil
}

func CreatePost(db *database.Database, post models.Post) (models.Post, error) {
	// Generate new ID
	post.PostID = len(mockPosts) + 1
	post.CreatedAt = time.Now()
	post.UpdatedAt = time.Now()
	post.LikeCount = 0

	// Add to mock data
	mockPosts = append(mockPosts, post)

	return post, nil
}

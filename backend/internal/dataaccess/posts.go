package dataaccess

import (
	"errors"
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
        post.CommentCount = 0

	// Add to mock data
	mockPosts = append(mockPosts, post)

	return post, nil
}

// UpdatePost updates an existing post
func UpdatePost(db *database.Database, postID int, updatedPost models.Post) (models.Post, error) {
    for i := range mockPosts {
        if mockPosts[i].PostID == postID {
            // Keep original values that shouldn't change
            updatedPost.PostID = mockPosts[i].PostID
            updatedPost.UserID = mockPosts[i].UserID
            updatedPost.CreatedAt = mockPosts[i].CreatedAt
            updatedPost.LikeCount = mockPosts[i].LikeCount
            updatedPost.CommentCount = mockPosts[i].CommentCount
            updatedPost.UpdatedAt = time.Now()
            
            mockPosts[i] = updatedPost
            return mockPosts[i], nil
        }
    }
    return models.Post{}, errors.New("post not found")
}
// DeletePost soft-deletes a post by replacing its content
func DeletePost(db *database.Database, postID int) error {
    for i := range mockPosts {
        if mockPosts[i].PostID == postID {
            mockPosts[i].Title = "[Deleted]"
            mockPosts[i].Body = "User has deleted this post"
            mockPosts[i].UpdatedAt = time.Now()
            return nil
        }
    }
    return errors.New("post not found")
}
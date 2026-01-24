package dataaccess

import (
	"errors"
	"modgo/internal/database"
	"modgo/internal/models"
	"time"
)

// Mock comments data
var mockComments = []models.Comment{
	{
		CommentID: 1,
		PostID:    1,
		UserID:    1,
		Body:      "Great post! I'm also taking this module.",
		CreatedAt: time.Now().Add(-30 * time.Minute),
		UpdatedAt: time.Now().Add(-30 * time.Minute),
		LikeCount: 2,
	},
	{
		CommentID: 2,
		PostID:    1,
		UserID:    1,
		Body:      "Looking forward to the first lecture!",
		CreatedAt: time.Now().Add(-15 * time.Minute),
		UpdatedAt: time.Now().Add(-15 * time.Minute),
		LikeCount: 1,
	},
}

// ListCommentsByPostID retrieves comments for a specific post
func ListCommentsByPostID(db *database.Database, postID int) ([]models.Comment, error) {
	// Filter comments by PostID
	var postComments []models.Comment
	// underscore is index of every element that we discarding
	for _, comment := range mockComments {
		if comment.PostID == postID {
			postComments = append(postComments, comment)
		}
	}
	return postComments, nil
}

// CreateComment adds a new comment to a post
func CreateComment(db *database.Database, comment models.Comment) (models.Comment, error) {
	// Generate new ID
	comment.CommentID = len(mockComments) + 1
	comment.CreatedAt = time.Now()
	comment.UpdatedAt = time.Now()
	comment.LikeCount = 0

	// Add to mock data
	mockComments = append(mockComments, comment)

	// Update the post's comment count
	for i := range mockPosts {
		if mockPosts[i].PostID == comment.PostID {
			mockPosts[i].CommentCount++
			break
		}
	}

	return comment, nil
}

// UpdateComment updates an existing comment
func UpdateComment(db *database.Database, commentID int, updatedComment models.Comment) (models.Comment, error) {
    for i := range mockComments {
        if mockComments[i].CommentID == commentID {
            // Keep original values that shouldn't change
            updatedComment.CommentID = mockComments[i].CommentID
            updatedComment.PostID = mockComments[i].PostID
            updatedComment.UserID = mockComments[i].UserID
            updatedComment.CreatedAt = mockComments[i].CreatedAt
            updatedComment.LikeCount = mockComments[i].LikeCount
            updatedComment.UpdatedAt = time.Now()
            
            mockComments[i] = updatedComment
            return mockComments[i], nil
        }
    }
    return models.Comment{}, errors.New("comment not found")
}

// DeleteComment soft-deletes a comment by replacing its content
func DeleteComment(db *database.Database, commentID int) error {
    for i := range mockComments {
        if mockComments[i].CommentID == commentID {
            // Soft delete - replace body
            mockComments[i].Body = "User has deleted this comment"
            mockComments[i].UpdatedAt = time.Now()
            return nil
        }
    }
    return errors.New("comment not found")
}
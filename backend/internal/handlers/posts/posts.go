package posts

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"

	"modgo/internal/api"
	"modgo/internal/dataaccess"
	"modgo/internal/database"
	"modgo/internal/models"

	"github.com/go-chi/chi/v5"
	"github.com/pkg/errors"
)

// log identifiers
const (
	ListPosts  = "posts.HandleList"
	CreatePost = "posts.HandleCreate"
	UpdatePost = "posts.HandleUpdate"
	DeletePost = "posts.HandleDelete"
	LikePost   = "posts.HandleLike"

	SuccessfulListPostsMessage  = "Successfully listed posts"
	SuccessfulCreatePostMessage = "Successfully created post"
	SuccessfulUpdatePostMessage = "Successfully updated post"
	SuccessfulDeletePostMessage = "Successfully deleted post"
	SuccessfulLikePostMessage   = "Successfully liked post"
	ErrRetrievePosts            = "Failed to retrieve posts in %s"
	ErrCreatePost               = "Failed to create post in %s"
	ErrUpdatePost               = "Failed to update post in %s"
	ErrDeletePost               = "Failed to delete post in %s"
	ErrLikePost                 = "Failed to like post in %s"
	ErrDecodeRequest            = "Failed to decode request in %s"
	ErrEncodeView               = "Failed to encode posts in %s"
	ErrInvalidPostID            = "Invalid post ID in %s"
)

func HandleList(w http.ResponseWriter, r *http.Request) (*api.Response, error) {
	db := database.GetDB()

	posts, err := dataaccess.ListPosts(db)
	if err != nil {
		return nil, errors.Wrap(err, fmt.Sprintf(ErrRetrievePosts, ListPosts))
	}

	data, err := json.Marshal(posts)
	if err != nil {
		return nil, errors.Wrap(err, fmt.Sprintf(ErrEncodeView, ListPosts))
	}

	return &api.Response{
		Payload: api.Payload{
			Data: data,
		},
		Messages: []string{SuccessfulListPostsMessage},
	}, nil
}

func HandleCreate(w http.ResponseWriter, r *http.Request) (*api.Response, error) {
	db := database.GetDB()

	var post models.Post
	if err := json.NewDecoder(r.Body).Decode(&post); err != nil {
		return nil, errors.Wrap(err, fmt.Sprintf(ErrDecodeRequest, CreatePost))
	}

	createdPost, err := dataaccess.CreatePost(db, post)
	if err != nil {
		return nil, errors.Wrap(err, fmt.Sprintf(ErrCreatePost, CreatePost))
	}

	data, err := json.Marshal(createdPost)
	if err != nil {
		return nil, errors.Wrap(err, fmt.Sprintf(ErrEncodeView, CreatePost))
	}

	return &api.Response{
		Payload: api.Payload{
			Data: data,
		},
		Messages: []string{SuccessfulCreatePostMessage},
	}, nil
}

func HandleUpdate(w http.ResponseWriter, r *http.Request) (*api.Response, error) {
	db := database.GetDB()

	// Get post ID from URL parameter
	postIDStr := chi.URLParam(r, "postId")
	postID, err := strconv.Atoi(postIDStr)
	if err != nil {
		return nil, errors.Wrap(err, fmt.Sprintf(ErrInvalidPostID, UpdatePost))
	}

	var post models.Post
	if err := json.NewDecoder(r.Body).Decode(&post); err != nil {
		return nil, errors.Wrap(err, fmt.Sprintf(ErrDecodeRequest, UpdatePost))
	}

	updatedPost, err := dataaccess.UpdatePost(db, postID, post)
	if err != nil {
		return nil, errors.Wrap(err, fmt.Sprintf(ErrUpdatePost, UpdatePost))
	}

	data, err := json.Marshal(updatedPost)
	if err != nil {
		return nil, errors.Wrap(err, fmt.Sprintf(ErrEncodeView, UpdatePost))
	}

	return &api.Response{
		Payload: api.Payload{
			Data: data,
		},
		Messages: []string{SuccessfulUpdatePostMessage},
	}, nil
}

func HandleDelete(w http.ResponseWriter, r *http.Request) (*api.Response, error) {
	db := database.GetDB()

	// Get post ID from URL parameter
	postIDStr := chi.URLParam(r, "postId")
	postID, err := strconv.Atoi(postIDStr)
	if err != nil {
		return nil, errors.Wrap(err, fmt.Sprintf(ErrInvalidPostID, DeletePost))
	}

	err = dataaccess.DeletePost(db, postID)
	if err != nil {
		return nil, errors.Wrap(err, fmt.Sprintf(ErrDeletePost, DeletePost))
	}

	return &api.Response{
		Payload: api.Payload{
			Data: json.RawMessage(`{}`),
		},
		Messages: []string{SuccessfulDeletePostMessage},
	}, nil
}

func HandleLike(w http.ResponseWriter, r *http.Request) (*api.Response, error) {
	db := database.GetDB()

	// get post id from URL parameter
	postIDStr := chi.URLParam(r, "postId")
	postID, err := strconv.Atoi(postIDStr)
	if err != nil {
		return nil, errors.Wrap(err, fmt.Sprintf(ErrInvalidPostID, LikePost))
	}

	likedPost, err := dataaccess.LikePost(db, postID)
	if err != nil {
		return nil, errors.Wrap(err, fmt.Sprintf(ErrLikePost, LikePost))
	}

	data, err := json.Marshal(likedPost)
	if err != nil {
		return nil, errors.Wrap(err, fmt.Sprintf(ErrEncodeView, LikePost))
	}

	return &api.Response{
		Payload: api.Payload{
			Data: data,
		},
		Messages: []string{SuccessfulLikePostMessage},
	}, nil
}

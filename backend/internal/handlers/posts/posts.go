package posts

import (
    "encoding/json"
    "fmt"
    "net/http"

    "modgo/internal/api"
    "modgo/internal/dataaccess"
    "modgo/internal/database"
    "modgo/internal/models"

    "github.com/pkg/errors"
)

const (
    ListPosts   = "posts.HandleList"
    CreatePost  = "posts.HandleCreate"
    
    SuccessfulListPostsMessage   = "Successfully listed posts"
    SuccessfulCreatePostMessage  = "Successfully created post"
    ErrRetrievePosts             = "Failed to retrieve posts in %s"
    ErrCreatePost                = "Failed to create post in %s"
    ErrDecodeRequest             = "Failed to decode request in %s"
    ErrEncodeView                = "Failed to encode posts in %s"
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
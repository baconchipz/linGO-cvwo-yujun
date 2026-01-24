package comments

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

const (
    ListComments   = "comments.HandleList"
    CreateComment  = "comments.HandleCreate"

    SuccessfulListCommentsMessage   = "Successfully listed comments"
    SuccessfulCreateCommentMessage  = "Successfully created comment"
    ErrRetrieveComments             = "Failed to retrieve comments in %s"
    ErrCreateComment                = "Failed to create comment in %s"
    ErrDecodeRequest                = "Failed to decode request in %s"
    ErrEncodeView                   = "Failed to encode comments in %s"
    ErrInvalidPostID                = "Invalid post ID in %s"
)

func HandleList(w http.ResponseWriter, r *http.Request) (*api.Response, error) {
    db := database.GetDB()

    // Get post ID from URL parameter
    postIDStr := chi.URLParam(r, "postId")
    postID, err := strconv.Atoi(postIDStr)
    if err != nil {
        return nil, errors.Wrap(err, fmt.Sprintf(ErrInvalidPostID, ListComments))
    }

    comments, err := dataaccess.ListCommentsByPostID(db, postID)
    if err != nil {
        return nil, errors.Wrap(err, fmt.Sprintf(ErrRetrieveComments, ListComments))
    }

    data, err := json.Marshal(comments)
    if err != nil {
        return nil, errors.Wrap(err, fmt.Sprintf(ErrEncodeView, ListComments))
    }

    return &api.Response{
        Payload: api.Payload{
            Data: data,
        },
        Messages: []string{SuccessfulListCommentsMessage},
    }, nil
}

func HandleCreate(w http.ResponseWriter, r *http.Request) (*api.Response, error) {
    db := database.GetDB()

    var comment models.Comment
    if err := json.NewDecoder(r.Body).Decode(&comment); err != nil {
        return nil, errors.Wrap(err, fmt.Sprintf(ErrDecodeRequest, CreateComment))
    }

    createdComment, err := dataaccess.CreateComment(db, comment)
    if err != nil {
        return nil, errors.Wrap(err, fmt.Sprintf(ErrCreateComment, CreateComment))
    }

    data, err := json.Marshal(createdComment)
    if err != nil {
        return nil, errors.Wrap(err, fmt.Sprintf(ErrEncodeView, CreateComment))
    }

    return &api.Response{
        Payload: api.Payload{
            Data: data,
        },
        Messages: []string{SuccessfulCreateCommentMessage},
    }, nil
}
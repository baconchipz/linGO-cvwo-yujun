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
    UpdateComment  = "comments.HandleUpdate"
    DeleteComment  = "comments.HandleDelete"

    SuccessfulListCommentsMessage   = "Successfully listed comments"
    SuccessfulCreateCommentMessage  = "Successfully created comment"
    SuccessfulUpdateCommentMessage  = "Successfully updated comment"
    SuccessfulDeleteCommentMessage  = "Successfully deleted comment"
    ErrRetrieveComments             = "Failed to retrieve comments in %s"
    ErrCreateComment                = "Failed to create comment in %s"
    ErrUpdateComment                = "Failed to update comment in %s"
    ErrDeleteComment                = "Failed to delete comment in %s"
    ErrDecodeRequest                = "Failed to decode request in %s"
    ErrEncodeView                   = "Failed to encode comments in %s"
    ErrInvalidPostID                = "Invalid post ID in %s"
    ErrInvalidCommentID             = "Invalid comment ID in %s"
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

    // Get post ID from URL parameter
    postIDStr := chi.URLParam(r, "postId")
    postID, err := strconv.Atoi(postIDStr)
    if err != nil {
        return nil, errors.Wrap(err, fmt.Sprintf(ErrInvalidPostID, CreateComment))
    }

    var comment models.Comment
    if err := json.NewDecoder(r.Body).Decode(&comment); err != nil {
        return nil, errors.Wrap(err, fmt.Sprintf(ErrDecodeRequest, CreateComment))
    }

    // Set the post ID from URL
    comment.PostID = postID

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

func HandleUpdate(w http.ResponseWriter, r *http.Request) (*api.Response, error) {
    db := database.GetDB()

    // Get comment ID from URL parameter
    commentIDStr := chi.URLParam(r, "commentId")
    commentID, err := strconv.Atoi(commentIDStr)
    if err != nil {
        return nil, errors.Wrap(err, fmt.Sprintf(ErrInvalidCommentID, UpdateComment))
    }

    var comment models.Comment
    if err := json.NewDecoder(r.Body).Decode(&comment); err != nil {
        return nil, errors.Wrap(err, fmt.Sprintf(ErrDecodeRequest, UpdateComment))
    }

    updatedComment, err := dataaccess.UpdateComment(db, commentID, comment)
    if err != nil {
        return nil, errors.Wrap(err, fmt.Sprintf(ErrUpdateComment, UpdateComment))
    }

    data, err := json.Marshal(updatedComment)
    if err != nil {
        return nil, errors.Wrap(err, fmt.Sprintf(ErrEncodeView, UpdateComment))
    }

    return &api.Response{
        Payload: api.Payload{
            Data: data,
        },
        Messages: []string{SuccessfulUpdateCommentMessage},
    }, nil
}

func HandleDelete(w http.ResponseWriter, r *http.Request) (*api.Response, error) {
    db := database.GetDB()

    // Get comment ID from URL parameter
    commentIDStr := chi.URLParam(r, "commentId")
    commentID, err := strconv.Atoi(commentIDStr)
    if err != nil {
        return nil, errors.Wrap(err, fmt.Sprintf(ErrInvalidCommentID, DeleteComment))
    }

    err = dataaccess.DeleteComment(db, commentID)
    if err != nil {
        return nil, errors.Wrap(err, fmt.Sprintf(ErrDeleteComment, DeleteComment))
    }

    return &api.Response{
        Payload: api.Payload{
            Data: json.RawMessage(`{}`),
        },
        Messages: []string{SuccessfulDeleteCommentMessage},
    }, nil
}
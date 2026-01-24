package users

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
	ListUsers  = "users.HandleList"
	CreateUser = "users.HandleCreate"
	UpdateUser = "users.HandleUpdate"
	DeleteUser = "users.HandleDelete"

	SuccessfulListUsersMessage  = "Successfully listed users"
	SuccessfulCreateUserMessage = "Successfully created user"
	SuccessfulUpdateUserMessage = "Successfully updated user"
	SuccessfulDeleteUserMessage = "Successfully deleted user"
	ErrRetrieveUsers            = "Failed to retrieve users in %s"
	ErrCreateUser               = "Failed to create user in %s"
	ErrUpdateUser               = "Failed to update user in %s"
	ErrDeleteUser               = "Failed to delete user in %s"
	ErrDecodeRequest            = "Failed to decode request in %s"
	ErrEncodeView               = "Failed to encode users in %s"
	ErrInvalidUserID            = "Invalid user ID in %s"
)

func HandleList(w http.ResponseWriter, r *http.Request) (*api.Response, error) {
	db := database.GetDB()

	users, err := dataaccess.ListUsers(db)
	if err != nil {
		return nil, errors.Wrap(err, fmt.Sprintf(ErrRetrieveUsers, ListUsers))
	}

	data, err := json.Marshal(users)
	if err != nil {
		return nil, errors.Wrap(err, fmt.Sprintf(ErrEncodeView, ListUsers))
	}

	return &api.Response{
		Payload: api.Payload{
			Data: data,
		},
		Messages: []string{SuccessfulListUsersMessage},
	}, nil
}

func HandleCreate(w http.ResponseWriter, r *http.Request) (*api.Response, error) {
	db := database.GetDB()

	var user models.User
	if err := json.NewDecoder(r.Body).Decode(&user); err != nil {
		return nil, errors.Wrap(err, fmt.Sprintf(ErrDecodeRequest, CreateUser))
	}

	createdUser, err := dataaccess.CreateUser(db, user)
	if err != nil {
		return nil, errors.Wrap(err, fmt.Sprintf(ErrCreateUser, CreateUser))
	}

	data, err := json.Marshal(createdUser)
	if err != nil {
		return nil, errors.Wrap(err, fmt.Sprintf(ErrEncodeView, CreateUser))
	}

	return &api.Response{
		Payload: api.Payload{
			Data: data,
		},
		Messages: []string{SuccessfulCreateUserMessage},
	}, nil
}

func HandleUpdate(w http.ResponseWriter, r *http.Request) (*api.Response, error) {
	db := database.GetDB()

	userIDStr := chi.URLParam(r, "userId")
	userID, err := strconv.Atoi(userIDStr)
	if err != nil {
		return nil, errors.Wrap(err, fmt.Sprintf(ErrInvalidUserID, UpdateUser))
	}

	var user models.User
	if err := json.NewDecoder(r.Body).Decode(&user); err != nil {
		return nil, errors.Wrap(err, fmt.Sprintf(ErrDecodeRequest, UpdateUser))
	}

	updatedUser, err := dataaccess.UpdateUser(db, userID, user)
	if err != nil {
		return nil, errors.Wrap(err, fmt.Sprintf(ErrUpdateUser, UpdateUser))
	}

	data, err := json.Marshal(updatedUser)
	if err != nil {
		return nil, errors.Wrap(err, fmt.Sprintf(ErrEncodeView, UpdateUser))
	}

	return &api.Response{
		Payload: api.Payload{
			Data: data,
		},
		Messages: []string{SuccessfulUpdateUserMessage},
	}, nil
}

func HandleDelete(w http.ResponseWriter, r *http.Request) (*api.Response, error) {
	db := database.GetDB()

	userIDStr := chi.URLParam(r, "userId")
	userID, err := strconv.Atoi(userIDStr)
	if err != nil {
		return nil, errors.Wrap(err, fmt.Sprintf(ErrInvalidUserID, DeleteUser))
	}

	err = dataaccess.DeleteUser(db, userID)
	if err != nil {
		return nil, errors.Wrap(err, fmt.Sprintf(ErrDeleteUser, DeleteUser))
	}

	return &api.Response{
		Payload: api.Payload{
			Data: json.RawMessage(`{}`),
		},
		Messages: []string{SuccessfulDeleteUserMessage},
	}, nil
}

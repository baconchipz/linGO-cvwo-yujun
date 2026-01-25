package modules

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"

	"modgo/internal/api"
	"modgo/internal/dataaccess"
	"modgo/internal/database"

	"github.com/go-chi/chi/v5"
	"github.com/google/uuid"
	"github.com/pkg/errors"
)

const (
	ListModules       = "modules.HandleList"
	GetModule         = "modules.HandleGet"
	GetUserModules    = "modules.HandleUserModules"
	SubscribeModule   = "modules.HandleSubscribe"
	UnsubscribeModule = "modules.HandleUnsubscribe"

	SuccessfulListModulesMessage    = "Successfully listed modules"
	SuccessfulGetModuleMessage      = "Successfully retrieved module"
	SuccessfulGetUserModulesMessage = "Successfully retrieved user modules"
	SuccessfulSubscribeMessage      = "Successfully subscribed to module"
	SuccessfulUnsubscribeMessage    = "Successfully unsubscribed from module"
	ErrRetrieveModules              = "Failed to retrieve modules in %s"
	ErrRetrieveModule               = "Failed to retrieve module in %s"
	ErrSubscribe                    = "Failed to subscribe to module in %s"
	ErrUnsubscribe                  = "Failed to unsubscribe from module in %s"
	ErrEncodeView                   = "Failed to encode response in %s"
	ErrInvalidModuleID              = "Invalid module ID in %s"
	ErrInvalidUserID                = "Invalid user ID in %s"
)

func HandleList(w http.ResponseWriter, r *http.Request) (*api.Response, error) {
	// get database connection
	db := database.GetDB()

	// get all modules
	modules, err := dataaccess.ListModules(db)
	if err != nil {
		return nil, errors.Wrap(err, fmt.Sprintf(ErrRetrieveModules, ListModules))
	}

	// convert to json
	data, err := json.Marshal(modules)
	if err != nil {
		return nil, errors.Wrap(err, fmt.Sprintf(ErrEncodeView, ListModules))
	}

	return &api.Response{
		Payload: api.Payload{
			Data: data,
		},
		Messages: []string{SuccessfulListModulesMessage},
	}, nil
}

func HandleGet(w http.ResponseWriter, r *http.Request) (*api.Response, error) {
	db := database.GetDB()

	moduleIDStr := chi.URLParam(r, "moduleId")
	moduleID, err := uuid.Parse(moduleIDStr)
	if err != nil {
		return nil, errors.Wrap(err, fmt.Sprintf(ErrInvalidModuleID, GetModule))
	}

	module, err := dataaccess.GetModuleByID(db, moduleID)
	if err != nil {
		return nil, errors.Wrap(err, fmt.Sprintf(ErrRetrieveModule, GetModule))
	}

	data, err := json.Marshal(module)
	if err != nil {
		return nil, errors.Wrap(err, fmt.Sprintf(ErrEncodeView, GetModule))
	}

	return &api.Response{
		Payload: api.Payload{
			Data: data,
		},
		Messages: []string{SuccessfulGetModuleMessage},
	}, nil
}

func HandleGetByCode(w http.ResponseWriter, r *http.Request) (*api.Response, error) {
	db := database.GetDB()

	moduleCode := chi.URLParam(r, "moduleCode")

	module, err := dataaccess.GetModuleByCode(db, moduleCode)
	if err != nil {
		return nil, errors.Wrap(err, fmt.Sprintf(ErrRetrieveModule, GetModule))
	}

	data, err := json.Marshal(module)
	if err != nil {
		return nil, errors.Wrap(err, "Failed to encode response")
	}

	return &api.Response{
		Payload: api.Payload{
			Data: data,
		},
		Messages: []string{"Successfully retrieved module"},
	}, nil
}

func HandleUserModules(w http.ResponseWriter, r *http.Request) (*api.Response, error) {
	db := database.GetDB()

	userIDStr := chi.URLParam(r, "userId")
	userID, err := strconv.Atoi(userIDStr)
	if err != nil {
		return nil, errors.Wrap(err, fmt.Sprintf(ErrInvalidUserID, GetUserModules))
	}

	modules, err := dataaccess.GetUserModules(db, userID)
	if err != nil {
		return nil, errors.Wrap(err, fmt.Sprintf(ErrRetrieveModules, GetUserModules))
	}

	data, err := json.Marshal(modules)
	if err != nil {
		return nil, errors.Wrap(err, fmt.Sprintf(ErrEncodeView, GetUserModules))
	}

	return &api.Response{
		Payload: api.Payload{
			Data: data,
		},
		Messages: []string{SuccessfulGetUserModulesMessage},
	}, nil
}

func HandleSubscribe(w http.ResponseWriter, r *http.Request) (*api.Response, error) {
	db := database.GetDB()

	userIDStr := chi.URLParam(r, "userId")
	userID, err := strconv.Atoi(userIDStr)
	if err != nil {
		return nil, errors.Wrap(err, fmt.Sprintf(ErrInvalidUserID, SubscribeModule))
	}

	moduleIDStr := chi.URLParam(r, "moduleId")
	moduleID, err := uuid.Parse(moduleIDStr)
	if err != nil {
		return nil, errors.Wrap(err, fmt.Sprintf(ErrInvalidModuleID, SubscribeModule))
	}

	err = dataaccess.SubscribeUserToModule(db, userID, moduleID)
	if err != nil {
		return nil, errors.Wrap(err, fmt.Sprintf(ErrSubscribe, SubscribeModule))
	}

	return &api.Response{
		Payload: api.Payload{
			Data: json.RawMessage(`{}`),
		},
		Messages: []string{SuccessfulSubscribeMessage},
	}, nil
}

func HandleUnsubscribe(w http.ResponseWriter, r *http.Request) (*api.Response, error) {
	db := database.GetDB()

	userIDStr := chi.URLParam(r, "userId")
	userID, err := strconv.Atoi(userIDStr)
	if err != nil {
		return nil, errors.Wrap(err, fmt.Sprintf(ErrInvalidUserID, UnsubscribeModule))
	}

	moduleIDStr := chi.URLParam(r, "moduleId")
	moduleID, err := uuid.Parse(moduleIDStr)
	if err != nil {
		return nil, errors.Wrap(err, fmt.Sprintf(ErrInvalidModuleID, UnsubscribeModule))
	}

	err = dataaccess.UnsubscribeUserFromModule(db, userID, moduleID)
	if err != nil {
		return nil, errors.Wrap(err, fmt.Sprintf(ErrUnsubscribe, UnsubscribeModule))
	}

	return &api.Response{
		Payload: api.Payload{
			Data: json.RawMessage(`{}`),
		},
		Messages: []string{SuccessfulUnsubscribeMessage},
	}, nil
}

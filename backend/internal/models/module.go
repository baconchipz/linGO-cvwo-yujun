package models

import "github.com/google/uuid"

type Module struct {
	ModuleID    uuid.UUID `json:"module_id"`
	ModuleCode  string    `json:"module_code"`
	ModuleTitle string    `json:"module_title"`
	Description string    `json:"description"`
	CreatedAt   string    `json:"created_at,omitempty"`
}

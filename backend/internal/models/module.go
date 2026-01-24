package models

type Module struct {
	ModuleID    int    `json:"module_id"`
	ModuleTitle string `json:"module_title"`
	Description string `json:"description"`
}

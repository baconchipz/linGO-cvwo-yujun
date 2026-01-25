package dataaccess

import (
	"database/sql"
	"modgo/internal/database"
	"modgo/internal/models"

	"github.com/google/uuid"
)

func ListModules(db *database.Database) ([]models.Module, error) {
	rows, err := db.Query("SELECT module_id, module_code, module_title, description FROM modules ORDER BY module_code")
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var modules []models.Module
	for rows.Next() {
		var m models.Module
		if err := rows.Scan(&m.ModuleID, &m.ModuleCode, &m.ModuleTitle, &m.Description); err != nil {
			return nil, err
		}
		modules = append(modules, m)
	}
	return modules, rows.Err()
}

func GetModuleByID(db *database.Database, moduleID uuid.UUID) (models.Module, error) {
	var m models.Module
	err := db.QueryRow("SELECT module_id, module_code, module_title, description FROM modules WHERE module_id = $1", moduleID).Scan(&m.ModuleID, &m.ModuleCode, &m.ModuleTitle, &m.Description)
	if err == sql.ErrNoRows {
		return models.Module{}, err
	}
	return m, err
}

func GetModuleByCode(db *database.Database, moduleCode string) (models.Module, error) {
	var m models.Module
	err := db.QueryRow("SELECT module_id, module_code, module_title, description FROM modules WHERE UPPER(module_code) = UPPER($1)", moduleCode).Scan(&m.ModuleID, &m.ModuleCode, &m.ModuleTitle, &m.Description)
	if err == sql.ErrNoRows {
		return models.Module{}, err
	}
	return m, err
}

func GetUserModules(db *database.Database, userID int) ([]models.Module, error) {
	rows, err := db.Query("SELECT m.module_id, m.module_code, m.module_title, m.description FROM modules m INNER JOIN user_modules um ON m.module_id = um.module_id WHERE um.user_id = $1 ORDER BY m.module_code", userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var modules []models.Module
	for rows.Next() {
		var m models.Module
		if err := rows.Scan(&m.ModuleID, &m.ModuleCode, &m.ModuleTitle, &m.Description); err != nil {
			return nil, err
		}
		modules = append(modules, m)
	}
	return modules, rows.Err()
}

func SubscribeUserToModule(db *database.Database, userID int, moduleID uuid.UUID) error {
	_, err := db.Exec("INSERT INTO user_modules (user_id, module_id) VALUES ($1, $2) ON CONFLICT (user_id, module_id) DO NOTHING", userID, moduleID)
	return err
}

func UnsubscribeUserFromModule(db *database.Database, userID int, moduleID uuid.UUID) error {
	_, err := db.Exec("DELETE FROM user_modules WHERE user_id = $1 AND module_id = $2", userID, moduleID)
	return err
}

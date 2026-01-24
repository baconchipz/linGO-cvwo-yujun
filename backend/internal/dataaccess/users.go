package dataaccess

import (
	"modgo/internal/database"
	"modgo/internal/models"
)

func ListUsers(db *database.Database) ([]models.User, error) {
	// TODO: Replace with actual database query
	users := []models.User{
		{
			UserID: 1,
			Name:   "CVWO Student",
			Email:  "student@nus.edu.sg",
			Major:  "Computer Science",
			Year:   3,
		},
	}
	return users, nil
}

package dataaccess

import (
	"database/sql"
	"errors"
	"modgo/internal/database"
	"modgo/internal/models"
)

// ListUsers retrieves all non-deleted users
func ListUsers(db *database.Database) ([]models.User, error) {
	rows, err := db.Query(`
		SELECT user_id, username, password, created_at, deleted_at
		FROM users
		WHERE deleted_at IS NULL
		ORDER BY created_at DESC`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var users []models.User
	for rows.Next() {
		var u models.User
		var deletedAt sql.NullTime
		if err := rows.Scan(&u.UserID, &u.Username, &u.Password, &u.CreatedAt, &deletedAt); err != nil {
			return nil, err
		}
		if deletedAt.Valid {
			u.DeletedAt = &deletedAt.Time
		}
		users = append(users, u)
	}
	return users, rows.Err()
}

// GetUserByID retrieves a specific user by ID
func GetUserByID(db *database.Database, userID int) (models.User, error) {
	var u models.User
	var deletedAt sql.NullTime
	err := db.QueryRow(`
		SELECT user_id, username, password, created_at, deleted_at
		FROM users
		WHERE user_id = $1 AND deleted_at IS NULL`, userID).Scan(
		&u.UserID, &u.Username, &u.Password, &u.CreatedAt, &deletedAt)
	if err != nil {
		return models.User{}, err
	}
	if deletedAt.Valid {
		u.DeletedAt = &deletedAt.Time
	}
	return u, nil
}

// GetUserByUsername retrieves a user by username (for login)
func GetUserByUsername(db *database.Database, username string) (models.User, error) {
	var u models.User
	var deletedAt sql.NullTime
	err := db.QueryRow(`
		SELECT user_id, username, password, created_at, deleted_at
		FROM users
		WHERE username = $1 AND deleted_at IS NULL`, username).Scan(
		&u.UserID, &u.Username, &u.Password, &u.CreatedAt, &deletedAt)
	if err != nil {
		return models.User{}, err
	}
	if deletedAt.Valid {
		u.DeletedAt = &deletedAt.Time
	}
	return u, nil
}

// CreateUser creates a new user
func CreateUser(db *database.Database, user models.User) (models.User, error) {
	var deletedAt sql.NullTime
	err := db.QueryRow(`
		INSERT INTO users (username, password)
		VALUES ($1, $2)
		RETURNING user_id, username, password, created_at, deleted_at`,
		user.Username, user.Password).Scan(
		&user.UserID, &user.Username, &user.Password, &user.CreatedAt, &deletedAt)
	if err != nil {
		return models.User{}, err
	}
	if deletedAt.Valid {
		user.DeletedAt = &deletedAt.Time
	}
	return user, nil
}

// UpdateUser updates user information
func UpdateUser(db *database.Database, userID int, updated models.User) (models.User, error) {
	var deletedAt sql.NullTime
	err := db.QueryRow(`
		UPDATE users
		SET username = $1, password = $2
		WHERE user_id = $3 AND deleted_at IS NULL
		RETURNING user_id, username, password, created_at, deleted_at`,
		updated.Username, updated.Password, userID).Scan(
		&updated.UserID, &updated.Username, &updated.Password, &updated.CreatedAt, &deletedAt)
	if err != nil {
		return models.User{}, err
	}
	if deletedAt.Valid {
		updated.DeletedAt = &deletedAt.Time
	}
	return updated, nil
}

// DeleteUser soft-deletes a user
func DeleteUser(db *database.Database, userID int) error {
	res, err := db.Exec(`
		UPDATE users
		SET deleted_at = NOW()
		WHERE user_id = $1 AND deleted_at IS NULL`, userID)
	if err != nil {
		return err
	}
	n, _ := res.RowsAffected()
	if n == 0 {
		return errors.New("user not found")
	}
	return nil
}

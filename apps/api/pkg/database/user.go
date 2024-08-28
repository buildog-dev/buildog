package database

import (
	"api/pkg/models"
	"database/sql"
	"fmt"
)

func CreateUser(userId string, email string, firstName string, lastName string) error {

	// Add the user to the database
	db := GetDB()
	query := ` INSERT INTO users (id, first_name, last_name, email) VALUES ($1, $2, $3, $4)`
	row := db.QueryRow(query, userId, firstName, lastName, email)

	// Check for errors
	var name string
	err := row.Scan(&name)
	if err != sql.ErrNoRows && err != nil {
		return fmt.Errorf("failed to add user to database: %s", err)
	}

	return nil
}

func GetUser(userId string) (models.User, error) {
	db := GetDB()
	query := `SELECT id, first_name, last_name, email FROM users WHERE id = $1`
	row := db.QueryRow(query, userId)

	var user models.User
	err := row.Scan(&user.UserId, &user.FirstName, &user.LastName, &user.Email)
	if err == sql.ErrNoRows {
		return models.User{}, fmt.Errorf("user not found")
	}
	if err != nil {
		return models.User{}, fmt.Errorf("failed to get user from database: %s", err)
	}

	return user, nil
}

func CreateTenantUser(user models.User, tenantId int64) error {
	db := GetDB()
	query := `INSERT INTO tenantUsers (user_id, tenant_id, role) VALUES ($1, $2, $3)`
	_, err := db.Exec(query, user.UserId, tenantId, "admin")
	if err != nil {
		return fmt.Errorf("failed to create tenant user: %s", err)
	}

	return nil
}

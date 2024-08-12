package database

import (
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

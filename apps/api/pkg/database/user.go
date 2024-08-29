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

func CreateTenantUser(user models.User, tenantId int64, role string) error {
	db := GetDB()
	query := `INSERT INTO tenantUsers (user_id, tenant_id, role) VALUES ($1, $2, $3)`
	_, err := db.Exec(query, user.UserId, tenantId, role)
	if err != nil {
		fmt.Println(err)
		return fmt.Errorf("failed to create tenant user: %s", err)
	}

	return nil
}

func GetTenantUser(tenantId string) (models.TenantUser, error) {
	db := GetDB()
	query := `SELECT user_id, tenant_id, role FROM tenantUsers WHERE user_id = $1`
	row := db.QueryRow(query, tenantId)

	var tenantUser models.TenantUser
	err := row.Scan(&tenantUser.UserId, &tenantUser.TenantId, &tenantUser.Role)
	if err == sql.ErrNoRows {
		return models.TenantUser{}, fmt.Errorf("tenant user not found")
	}
	if err != nil {
		return models.TenantUser{}, fmt.Errorf("failed to get tenant user from database: %s", err)
	}

	return tenantUser, nil
}

func DeleteTenantUser(user models.User, tenantId int64) error {
	db := GetDB()
	query := `DELETE FROM tenantUsers WHERE user_id = $1 AND tenant_id = $2`
	_, err := db.Exec(query, user.UserId, tenantId)
	if err != nil {
		return fmt.Errorf("failed to delete tenant user: %s", err)
	}

	return nil
}

func UpdateTenantUserId(tenantId int64, prevUserId string, nextUserId string) error {
	db := GetDB()
	query := `UPDATE tenantUsers SET  user_id = $1 WHERE user_id = $2 AND tenant_id = $3`
	_, err := db.Exec(query, nextUserId, prevUserId, tenantId)
	if err != nil {
		return fmt.Errorf("failed to update tenant user: %s", err)
	}

	return nil
}

func UpdateTenantUserRole(tenantId int64, userId string, role string) error {
	db := GetDB()
	query := `UPDATE tenantUsers SET  role = $1 WHERE user_id = $2 AND tenant_id = $3`
	_, err := db.Exec(query, role, userId, tenantId)
	if err != nil {
		return fmt.Errorf("failed to update tenant user: %s", err)
	}

	return nil
}

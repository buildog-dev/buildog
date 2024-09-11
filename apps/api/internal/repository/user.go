package repository

import (
	"api/internal/models"
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
		return fmt.Errorf("failed to create tenant user: %s", err)
	}

	return nil
}

func GetTenantUser(tenantId int64, userId string) (models.GetTenantUserFormat, error) {
	db := GetDB()
	query := `SELECT u.id, u.first_name, u.last_name, u.email, tu.role, t.name  FROM tenantUsers tu INNER JOIN users u ON tu.user_id = u.id INNER JOIN tenants t ON tu.tenant_id = t.id WHERE tu.tenant_id = $1 AND tu.user_id = $2;`
	row := db.QueryRow(query, tenantId, userId)

	var tenantUser models.GetTenantUserFormat
	err := row.Scan(&tenantUser.UserId, &tenantUser.FirstName, &tenantUser.LastName, &tenantUser.Email, &tenantUser.Role, &tenantUser.OrganizationName)
	if err == sql.ErrNoRows {
		return models.GetTenantUserFormat{}, fmt.Errorf("tenant user not found")
	}
	if err != nil {
		return models.GetTenantUserFormat{}, fmt.Errorf("failed to get tenant user from database: %s", err)
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

func UpdateTenantUser(tenantId int64, userId string, role string) error {
	db := GetDB()
	query := `UPDATE tenantUsers SET  role = $1, updated_at = CURRENT_TIMESTAMP WHERE user_id = $2 AND tenant_id = $3`
	_, err := db.Exec(query, role, userId, tenantId)
	if err != nil {
		return fmt.Errorf("failed to update tenant user: %s", err)
	}

	return nil
}

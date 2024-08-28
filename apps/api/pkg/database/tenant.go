package database

import (
	"api/pkg/models"
	"database/sql"
	"fmt"
	"time"
)

func CreateTenant(db *sql.DB, tenant *models.Tenant) (int64, error) {
	query := `
		INSERT INTO tenants (name, created_at, updated_at)
		VALUES ($1, $2, $3)
		RETURNING id
	`
	now := time.Now()

	var tenantID int64
	err := db.QueryRow(query, tenant.Name, now, now).Scan(&tenantID)
	if err != nil {
		fmt.Println(err)
		return 0, err
	}

	return tenantID, nil
}

func GetTenantById(db *sql.DB, id string) (*models.Tenant, error) {
	query := "SELECT id, name, created_at FROM tenants WHERE id = $1"
	row := db.QueryRow(query, id)

	var tenant models.Tenant
	err := row.Scan(&tenant.ID, &tenant.Name, &tenant.CreatedAt)

	if err != nil {
		return nil, err
	}
	return &tenant, nil
}

func UpdateTenantName(db *sql.DB, id string, newName string) error {
	query := "UPDATE tenants SET name = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2"
	_, err := db.Exec(query, newName, id)
	return err
}

func DeleteTenant(db *sql.DB, id int64) error {
	query := "DELETE FROM tenants WHERE id = $1"
	_, err := db.Exec(query, id)
	return err
}

package database

import (
	"api/pkg/models"
	"time"
)

func CreateTenant(tenant *models.Tenant) (int64, error) {
	db := GetDB()
	query := `
		INSERT INTO tenants (name, created_at, updated_at)
		VALUES ($1, $2, $3)
		RETURNING id
	`
	now := time.Now()

	var tenantID int64
	err := db.QueryRow(query, tenant.Name, now, now).Scan(&tenantID)
	if err != nil {
		return 0, err
	}

	return tenantID, nil
}

func GetTenantById(id int64) (*models.Tenant, error) {
	db := GetDB()
	query := "SELECT id, name, created_at FROM tenants WHERE id = $1"
	row := db.QueryRow(query, id)

	var tenant models.Tenant
	err := row.Scan(&tenant.ID, &tenant.Name, &tenant.CreatedAt)

	if err != nil {
		return nil, err
	}
	return &tenant, nil
}

func UpdateTenant(id int64, newName string) error {
	db := GetDB()
	query := "UPDATE tenants SET name = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2"
	_, err := db.Exec(query, newName, id)
	return err
}

func DeleteTenant(id int64) error {
	db := GetDB()
	query := "DELETE FROM tenants WHERE id = $1"
	_, err := db.Exec(query, id)
	return err
}

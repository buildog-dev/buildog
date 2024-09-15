package repository

import (
	"api/internal/models"
	"api/pkg/database"
	"time"
)

type TenantRepository struct {
	db *database.DB
}

func NewTenantRepository(db *database.DB) *TenantRepository {
	return &TenantRepository{db: db}
}

func (r *TenantRepository) CreateTenant(tenant *models.Tenant) (int64, error) {
	query := `
		INSERT INTO tenants (name, created_at, updated_at)
		VALUES ($1, $2, $3)
		RETURNING id
	`
	now := time.Now()

	var tenantID int64
	err := r.db.QueryRow(query, tenant.Name, now, now).Scan(&tenantID)
	if err != nil {
		return 0, err
	}

	return tenantID, nil
}

func (r *TenantRepository) GetTenantById(id int64) (*models.Tenant, error) {
	query := "SELECT id, name, created_at FROM tenants WHERE id = $1"
	row := r.db.QueryRow(query, id)

	var tenant models.Tenant
	err := row.Scan(&tenant.ID, &tenant.Name, &tenant.CreatedAt)

	if err != nil {
		return nil, err
	}
	return &tenant, nil
}

func (r *TenantRepository) UpdateTenant(id int64, newName string) error {
	query := "UPDATE tenants SET name = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2"
	_, err := r.db.Exec(query, newName, id)
	return err
}

func (r *TenantRepository) DeleteTenant(id int64) error {
	query := "DELETE FROM tenants WHERE id = $1"
	_, err := r.db.Exec(query, id)
	return err
}

package repository

import (
	"api/internal/models"
	"api/pkg/database"
	"fmt"
	"time"
)

type TenantRepository struct {
	db *database.DB
}

func NewTenantRepository(db *database.DB) *TenantRepository {
	return &TenantRepository{db: db}
}

func (r *TenantRepository) GetAllTenants(userID string) error {
	query := `
		SELECT * FROM TENANTS;
	`
	val, err := r.db.Exec(query, userID)
	fmt.Print(val)
	return err
}

type OrganizationCreated struct {
	organization_id   int
	organization_name string
	created_by        string
}

func (r *TenantRepository) CreateTenant(tenant *models.Organization) (OrganizationCreated, error) {
	query := `
		INSERT INTO organizations (organization_name, created_by, created_at, updated_at)
		VALUES ($1, $2, $3, $4)
		RETURNING id, organization_id, organization_name, created_at
	`
	now := time.Now()

	var createdOrganization OrganizationCreated
	err := r.db.QueryRow(
		query,
		tenant.OrganizationName,
		tenant.CreatedBy,
		now,
		now,
	).Scan(&createdOrganization)

	if err != nil {
		return createdOrganization, err
	}

	return createdOrganization, nil
}

// func (r *TenantRepository) GetTenantById(id int64) (*models.Tenant, error) {
// 	query := "SELECT id, name, created_at FROM tenants WHERE id = $1"
// 	row := r.db.QueryRow(query, id)

// 	var tenant models.Tenant
// 	err := row.Scan(&tenant.ID, &tenant.Name, &tenant.CreatedAt)

// 	if err != nil {
// 		return nil, err
// 	}
// 	return &tenant, nil
// }

// func (r *TenantRepository) UpdateTenant(id int64, newName string) error {
// 	query := "UPDATE tenants SET name = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2"
// 	_, err := r.db.Exec(query, newName, id)
// 	return err
// }

// func (r *TenantRepository) DeleteTenant(id int64) error {
// 	query := "DELETE FROM tenants WHERE id = $1"
// 	_, err := r.db.Exec(query, id)
// 	return err
// }

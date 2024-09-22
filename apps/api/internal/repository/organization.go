package repository

import (
	"api/internal/models"
	"api/pkg/database"
	"time"
)

type OrganizationRepository struct {
	db *database.DB
}

func NewOrganizationRepository(db *database.DB) *OrganizationRepository {
	return &OrganizationRepository{db: db}
}

type OrganizationJ struct {
	OrganizationId          string
	OrganizationName        string
	OrganizationDescription string
}

func (r *OrganizationRepository) GetAllOrganizations(userID string) ([]OrganizationJ, error) {
	query := `
	SELECT
		o.organization_id,
		o.organization_name,
		o.organization_description
	FROM 
		organizations o 
	JOIN organization_users ou 
	ON o.organization_id=ou.organization_id 
	WHERE ou.user_id=$1;
	`
	rows, err := r.db.Query(query, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var organizations []OrganizationJ
	for rows.Next() {
		var org OrganizationJ
		if err := rows.Scan(&org.OrganizationId, &org.OrganizationName, &org.OrganizationDescription); err != nil {
			return nil, err
		}
		organizations = append(organizations, org)
	}

	// Check for any error encountered during iteration
	if err = rows.Err(); err != nil {
		return nil, err
	}

	return organizations, nil
}

type OrganizationCreated struct {
	Organization_id          string
	organization_name        string
	organization_description string
	created_by               string
}

func (r *OrganizationRepository) CreateOrganization(organization *models.Organization) (OrganizationCreated, error) {
	query := `
		INSERT INTO organizations (organization_name, organization_description, created_by, created_at, updated_at)
		VALUES ($1, $2, $3, $4, $5)
		RETURNING organization_id, organization_description, organization_name, created_by
	`
	now := time.Now()

	var createdOrganization OrganizationCreated
	err := r.db.QueryRow(
		query,
		organization.OrganizationName,
		organization.OrganizationDescription,
		organization.CreatedBy,
		now,
		now,
	).Scan(
		&createdOrganization.Organization_id,
		&createdOrganization.organization_name,
		&createdOrganization.organization_description,
		&createdOrganization.created_by,
	)

	if err != nil {
		return createdOrganization, err
	}

	return createdOrganization, nil
}

// func (r *OrganizationRepository) GetTenantById(id int64) (*models.Tenant, error) {
// 	query := "SELECT id, name, created_at FROM tenants WHERE id = $1"
// 	row := r.db.QueryRow(query, id)

// 	var tenant models.Tenant
// 	err := row.Scan(&tenant.ID, &tenant.Name, &tenant.CreatedAt)

// 	if err != nil {
// 		return nil, err
// 	}
// 	return &tenant, nil
// }

// func (r *OrganizationRepository) UpdateTenant(id int64, newName string) error {
// 	query := "UPDATE tenants SET name = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2"
// 	_, err := r.db.Exec(query, newName, id)
// 	return err
// }

// func (r *OrganizationRepository) DeleteTenant(id int64) error {
// 	query := "DELETE FROM tenants WHERE id = $1"
// 	_, err := r.db.Exec(query, id)
// 	return err
// }

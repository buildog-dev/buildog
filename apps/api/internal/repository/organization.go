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

func (r *OrganizationRepository) GetAllOrganizations(userID string) ([]models.OrganizationInfo, error) {
	query := `
	SELECT
		o.id,
		o.name,
		o.description
	FROM 
		organizations o 
	JOIN organization_users ou 
	ON o.id=ou.organization_id 
	WHERE ou.user_id=$1;
	`
	rows, err := r.db.Query(query, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var organizations []models.OrganizationInfo
	for rows.Next() {
		var org models.OrganizationInfo
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

func (r *OrganizationRepository) CreateOrganization(organization *models.Organization) (models.OrganizationCreated, error) {
	query := `
		INSERT INTO organizations (name, description, created_by, created_at, updated_at)
		VALUES ($1, $2, $3, $4, $5)
		RETURNING id, description, name, created_by
	`
	now := time.Now()

	var createdOrganization models.OrganizationCreated
	err := r.db.QueryRow(
		query,
		organization.Name,
		organization.Description,
		organization.CreatedBy,
		now,
		now,
	).Scan(
		&createdOrganization.Id,
		&createdOrganization.Name,
		&createdOrganization.Description,
		&createdOrganization.CreatedBy,
	)

	if err != nil {
		return createdOrganization, err
	}

	return createdOrganization, nil
}

func (r *OrganizationRepository) GetOrganization(organization_id string, user_id string) (models.OrganizationResponse, error) {
	// query := `
	// 	SELECT
	// 		id, name, description, created_by
	// 	FROM
	// 		organizations
	// 	WHERE
	// 		id=$1;
	// `
	query := `
		SELECT
			o.id,
			o.name,
			o.description,
			o.created_by
		FROM 
			organizations o 
		LEFT JOIN 
			organization_users ou 
		ON 
			o.id = ou.organization_id AND ou.user_id = $2
		WHERE 
			o.id = $1 AND (ou.user_id IS NOT NULL OR o.created_by = $2);
	`
	var getOrganization models.OrganizationResponse
	err := r.db.QueryRow(
		query,
		organization_id,
		user_id,
	).Scan(
		&getOrganization.Id,
		&getOrganization.Name,
		&getOrganization.Description,
		&getOrganization.CreatedBy,
	)

	if err != nil {
		return getOrganization, err
	}

	return getOrganization, nil
}

package repository

import (
	"api/internal/models"
	"api/pkg/database"
	"time"
)

type OrganizationUserRepository struct {
	db *database.DB
}

func NewOrganizationUserRepository(db *database.DB) *OrganizationUserRepository {
	return &OrganizationUserRepository{db: db}
}

func (r *OrganizationRepository) CreateOrganizationUser(user *models.OrganizationUserCreated) (models.OrganizationUserCreated, error) {
	query := `
		INSERT INTO organization_users (organization_id, user_id, role, created_at, updated_at)
		VALUES ($1, $2, $3, $4, $5)
		RETURNING organization_id, user_id, role
	`
	now := time.Now()

	var createdOrganizationUser models.OrganizationUserCreated
	err := r.db.QueryRow(
		query,
		user.OrganizationId,
		user.UserId,
		user.Role,
		now,
		now,
	).Scan(
		&createdOrganizationUser.OrganizationId,
		&createdOrganizationUser.UserId,
		&createdOrganizationUser.Role,
	)

	if err != nil {
		return createdOrganizationUser, err
	}

	return createdOrganizationUser, nil
}

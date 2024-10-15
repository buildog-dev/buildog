package repository

import (
	"api/internal/models"
	"api/pkg/database"
	"database/sql"
	"time"
)

type OrganizationUserRepository struct {
	db *database.DB
}

func NewOrganizationUserRepository(db *database.DB) *OrganizationUserRepository {
	return &OrganizationUserRepository{db: db}
}

func (r *OrganizationUserRepository) CreateOrganizationUser(user *models.OrganizationUserCreated) (models.OrganizationUserCreated, error) {
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

func (r *OrganizationUserRepository) GetOrganizationUser(user_id, organization_id string) (string, error) {
	query := `
		SELECT role FROM organization_users where organization_id = $1 and user_id = $2
	`

	var role string
	err := r.db.QueryRow(query, organization_id, user_id).Scan(&role)

	if err != nil {
		return role, err
	}

	return role, nil
}

func (r *OrganizationUserRepository) UpdateOrganizationUserRole(organizationID, userID, newRole string) error {
	// First, check if the user is related to the organization
	checkQuery := `
		SELECT 1 FROM organization_users
		WHERE organization_id = $1 AND user_id = $2
	`
	var exists bool
	err := r.db.QueryRow(checkQuery, organizationID, userID).Scan(&exists)
	if err != nil {
		if err == sql.ErrNoRows {
			return ErrOrganizationUserNotFound{OrganizationID: organizationID, UserID: userID}
		}
		return err
	}

	// If the user is related, proceed with the update
	updateQuery := `
		UPDATE organization_users
		SET role = $1, updated_at = $2
		WHERE organization_id = $3 AND user_id = $4
	`
	now := time.Now()

	result, err := r.db.Exec(updateQuery, newRole, now, organizationID, userID)
	if err != nil {
		return err
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return err
	}

	if rowsAffected == 0 {
		return ErrOrganizationUserNotFound{OrganizationID: organizationID, UserID: userID}
	}

	return nil
}


func (e ErrOrganizationUserNotFound) Error() string {
	return "no organization user found with organization_id " + e.OrganizationID + " and user_id " + e.UserID
}
// Add this custom error type at the end of the file
type ErrOrganizationUserNotFound struct {
	OrganizationID string
	UserID         string
}


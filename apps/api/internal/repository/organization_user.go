package repository

import (
	"api/internal/models"
	"api/pkg/database"
	"database/sql"
	"fmt"
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

func (r *OrganizationUserRepository) GetOrganizationUserRole(organization_id string, user_id string) (string, error) {
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
	// Check if the user is related to the organization
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

// DeleteOrganizationUser removes a user from an organization if they exist
func (r *OrganizationUserRepository) DeleteOrganizationUser(organizationID, userID string) error {
	deleteQuery := `
		DELETE FROM organization_users
		WHERE organization_id = $1 AND user_id = $2
	`

	result, err := r.db.Exec(deleteQuery, organizationID, userID)
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

// GetOrganizationUserInfo retrieves detailed information about a user in an organization
func (r *OrganizationUserRepository) GetOrganizationUserInfo(userID string, organizationID string) (*models.OrganizationUserInfo, error) {
	query := `
		SELECT ou.organization_id, ou.user_id, ou.role, ou.created_at, ou.updated_at,
			   u.first_name, u.last_name, u.email
		FROM organization_users ou
		LEFT JOIN users u ON ou.user_id = u.id
		WHERE ou.user_id = $1 AND ou.organization_id = $2
	`

	var userInfo models.OrganizationUserInfo
	err := r.db.QueryRow(query, userID, organizationID).Scan(
		&userInfo.UserID,
		&userInfo.OrganizationID,
		&userInfo.Role,
		&userInfo.CreatedAt,
		&userInfo.UpdatedAt,
		&userInfo.FirstName,
		&userInfo.LastName,
		&userInfo.Email,
	)
	if err == sql.ErrNoRows {
		return nil, ErrOrganizationUserNotFound{UserID: userID}
	}

	if err != nil {
		return nil, err
	}

	return &userInfo, nil
}

// ListOrganizationUsers retrieves detailed information about all users in an organization
func (r *OrganizationUserRepository) ListOrganizationUsers(organizationID string) ([]*models.OrganizationUserInfo, error) {
	query := `
		SELECT ou.organization_id, ou.user_id, ou.role, ou.created_at, ou.updated_at,
			   u.first_name, u.last_name, u.email
		FROM organization_users ou
		LEFT JOIN users u ON ou.user_id = u.id
		WHERE ou.organization_id = $1
	`

	rows, err := r.db.Query(query, organizationID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var users []*models.OrganizationUserInfo

	for rows.Next() {
		var userInfo models.OrganizationUserInfo
		err := rows.Scan(
			&userInfo.OrganizationID,
			&userInfo.UserID,
			&userInfo.Role,
			&userInfo.CreatedAt,
			&userInfo.UpdatedAt,
			&userInfo.FirstName,
			&userInfo.LastName,
			&userInfo.Email,
		)
		if err != nil {
			return nil, err
		}
		users = append(users, &userInfo)
	}

	if err = rows.Err(); err != nil {
		return nil, err
	}
	if len(users) == 0 {
		return nil, fmt.Errorf("no users found for organization ID %s", organizationID)
	}

	return users, nil
}

func (r *OrganizationUserRepository) IsUserInOrganization(organizationID, userID string) (bool, error) {
	query := `
		SELECT EXISTS (
			SELECT 1 
			FROM organization_users 
			WHERE organization_id = $1 AND user_id = $2
		)
	`
	var exists bool
	err := r.db.QueryRow(query, organizationID, userID).Scan(&exists)
	if err != nil {
		return false, err
	}
	return exists, nil
}

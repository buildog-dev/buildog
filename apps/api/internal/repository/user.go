package repository

import (
	"api/internal/models"
	"api/pkg/database"
	"database/sql"
	"fmt"
)

type UserRepository struct {
	db *database.DB
}

func NewUserRepository(db *database.DB) *UserRepository {
	return &UserRepository{db: db}
}

func (r *UserRepository) CreateUser(user *models.User) (sql.Result, error) {
	query := `INSERT INTO users (id, first_name, last_name, email, created_at, updated_at) 
              VALUES ($1, $2, $3, $4, $5, $6)`

	result, err := r.db.Exec(query, user.Id, user.FirstName, user.LastName, user.Email, user.CreatedAt, user.UpdatedAt)
	if err != nil {
		return nil, fmt.Errorf("failed to add user to database: %w", err)
	}
	return result, nil
}

func (r *UserRepository) GetUserWithEmail(email string) (models.User, error) {
	query := `SELECT id, first_name, last_name, email FROM users WHERE email=$1`
	row := r.db.QueryRow(query, email)

	var user models.User
	err := row.Scan(&user.Id, &user.FirstName, &user.LastName, &user.Email)
	if err == sql.ErrNoRows {
		return models.User{}, fmt.Errorf("user not found")
	}
	if err != nil {
		return models.User{}, fmt.Errorf("failed to get user from database: %s", err)
	}

	return user, nil
}
func (r *UserRepository) GetUserWithID(uid string) (models.GetUserPayload, error) {
	query := `SELECT first_name, last_name, email FROM users WHERE id=$1`
	row := r.db.QueryRow(query, uid)

	var user models.GetUserPayload
	err := row.Scan(&user.FirstName, &user.LastName, &user.Email)
	if err == sql.ErrNoRows {
		return models.GetUserPayload{}, fmt.Errorf("user not found")
	}
	if err != nil {
		return models.GetUserPayload{}, fmt.Errorf("failed to get user from database: %s", err)
	}

	return user, nil
}

// func (r *UserRepository) CreateTenantUser(user models.User, tenantId int64, role string) error {
// 	query := `INSERT INTO tenantUsers (user_id, tenant_id, role) VALUES ($1, $2, $3)`
// 	_, err := r.db.Exec(query, user.UserId, tenantId, role)
// 	if err != nil {
// 		return fmt.Errorf("failed to create tenant user: %s", err)
// 	}
// 	return nil
// }

// func (r *UserRepository) GetTenantUser(tenantId int64, userId string) (models.GetTenantUserFormat, error) {
// 	query := `SELECT u.id, u.first_name, u.last_name, u.email, tu.role, t.name
//               FROM tenantUsers tu
//               INNER JOIN users u ON tu.user_id = u.id
//               INNER JOIN tenants t ON tu.tenant_id = t.id
//               WHERE tu.tenant_id = $1 AND tu.user_id = $2`
// 	row := r.db.QueryRow(query, tenantId, userId)

// 	var tenantUser models.GetTenantUserFormat
// 	err := row.Scan(&tenantUser.UserId, &tenantUser.FirstName, &tenantUser.LastName, &tenantUser.Email, &tenantUser.Role, &tenantUser.OrganizationName)
// 	if err == sql.ErrNoRows {
// 		return models.GetTenantUserFormat{}, fmt.Errorf("tenant user not found")
// 	}
// 	if err != nil {
// 		return models.GetTenantUserFormat{}, fmt.Errorf("failed to get tenant user from database: %s", err)
// 	}

// 	return tenantUser, nil
// }

// func (r *UserRepository) DeleteTenantUser(user models.User, tenantId int64) error {
// 	query := `DELETE FROM tenantUsers WHERE user_id = $1 AND tenant_id = $2`
// 	_, err := r.db.Exec(query, user.UserId, tenantId)
// 	if err != nil {
// 		return fmt.Errorf("failed to delete tenant user: %s", err)
// 	}
// 	return nil
// }

// func (r *UserRepository) UpdateTenantUser(tenantId int64, userId string, role string) error {
// 	query := `UPDATE tenantUsers SET role = $1, updated_at = CURRENT_TIMESTAMP WHERE user_id = $2 AND tenant_id = $3`
// 	_, err := r.db.Exec(query, role, userId, tenantId)
// 	if err != nil {
// 		return fmt.Errorf("failed to update tenant user: %s", err)
// 	}
// 	return nil
// }

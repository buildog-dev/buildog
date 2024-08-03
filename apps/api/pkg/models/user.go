package models

import "time"

// User represents a user in the system
type User struct {
	ID           int64     `json:"id"`
	TenantID     int64     `json:"tenant_id"`
	Username     string    `json:"username"`
	Email        string    `json:"email"`
	PasswordHash string    `json:"password_hash"`
	CreatedAt    time.Time `json:"created_at"`
	UpdatedAt    time.Time `json:"updated_at"`
}

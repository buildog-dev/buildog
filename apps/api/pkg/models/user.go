package models

import "time"

type User struct {
	UserId       int64     `json:"user_id"`
	FirstName    string    `json:"first_name"`
	LastName     string    `json:"last_name"`
	Email        string    `json:"email"`
	PasswordHash string    `json:"password_hash"`
	CreatedAt    time.Time `json:"created_at"`
	UpdatedAt    time.Time `json:"updated_at"`
}

type TenantUser struct {
	TenantId  int64     `json:"tenant_id"`
	UserId    string    `json:"user_id"`
	Role      string    `json:"role"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

type TenantUserActionRequest struct {
	TenantID          int64  `json:"tenant_id"`
	RequestedByUserId string `json:"requested_by_id"`
	TargetUserID      string `json:"target_user_id"`
	Role              string `json:"role"`
}

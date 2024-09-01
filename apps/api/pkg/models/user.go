package models

import "time"

type User struct {
	UserId    string    `json:"user_id"`
	FirstName string    `json:"first_name"`
	LastName  string    `json:"last_name"`
	Email     string    `json:"email"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

type TenantUser struct {
	TenantId  int64     `json:"tenant_id"`
	UserId    string    `json:"user_id"`
	Role      string    `json:"role"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

type TenantUserDeleteAndAdd struct {
	TenantID     int64  `json:"tenant_id"`
	TargetUserID string `json:"target_user_id"`
	Role         string `json:"role"`
}

type TenantUserUpdate struct {
	TenantID      int64  `json:"tenant_id"`
	TargetUserID  string `json:"target_user_id"`
	ChangedUserID string `json:"changed_user_id"`
	ChangedRole   string `json:"changed_role"`
}
type GetTenantUserFormat struct {
	UserId           string
	FirstName        string
	LastName         string
	Email            string
	Role             string
	OrganizationName string
}

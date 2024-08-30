package models

import "time"

// Tenant represents a tenant in the system
type Tenant struct {
	ID        int64     `json:"id"`
	Name      string    `json:"name"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

type CreateTenant struct {
	OrganizationName string `json:"organization_name"`
	CreatorId        string `json:"creator_id"`
}

type UpdateTenant struct {
	TenantId          int64  `json:"tenant_id"`
	TenantName        string `json:"tenant_name"`
	RequestedByUserId string `json:"requested_by_id"`
}

type DeleteTenant struct {
	TenantID          int64  `json:"tenant_id"`
	RequestedByUserId string `json:"requested_by_id"`
	TargetUserID      string `json:"target_user_id"`
}

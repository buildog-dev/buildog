package models

import "time"

type Organization struct {
	OrganizationName        string    `json:"organization_name"`
	OrganizationDescription string    `json:"organization_description"`
	CreatedBy               string    `json:"created_by"`
	CreatedAt               time.Time `json:"created_at"`
	UpdatedAt               time.Time `json:"updated_at"`
}

type OrganizationBody struct {
	OrganizationName        string `json:"organization_name"`
	OrganizationDescription string `json:"organization_description"`
}

type UpdateTenant struct {
	TenantId   int64  `json:"tenant_id"`
	TenantName string `json:"tenant_name"`
}

type DeleteTenant struct {
	TenantID     int64  `json:"tenant_id"`
	TargetUserID string `json:"target_user_id"`
}

package models

type CreateOrganizationRequest struct {
	OrganizationName string `json:"organization_name"`
	UserId           string `json:"user_id"`
}

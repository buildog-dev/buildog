package models

type CreateOrganizationRequest struct {
	OrganizationName string `json:"organization_name"`
	CreatorId        string `json:"creator_id"`
}

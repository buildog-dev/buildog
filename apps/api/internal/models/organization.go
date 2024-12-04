package models

import "time"

type Organization struct {
	Name        string    `json:"organization_name"`
	Description string    `json:"organization_description"`
	CreatedBy   string    `json:"created_by"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

type OrganizationResponse struct {
	Id          string `json:"id"`
	Name        string `json:"name"`
	Description string `json:"description"`
	CreatedBy   string `json:"created_by"`
}

type OrganizationBody struct {
	OrganizationName        string `json:"organization_name"`
	OrganizationDescription string `json:"organization_description"`
}

type OrganizationInfo struct {
	OrganizationId          string
	OrganizationName        string
	OrganizationDescription string
}

type OrganizationCreated struct {
	Id          string
	Name        string
	Description string
	CreatedBy   string
}

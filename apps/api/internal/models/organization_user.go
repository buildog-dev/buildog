package models

type OrganizationUserCreated struct {
	OrganizationId string
	UserId         string
	Role           string
}

type AddUserOrganizationPayload struct {
	Email string `json:"email"`
	Role  string `json:"role"`
}

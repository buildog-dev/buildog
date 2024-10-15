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

type UpdateUserRolePayload struct {
	UserID string `json:"user_id"`
	Role   string `json:"role"`
}

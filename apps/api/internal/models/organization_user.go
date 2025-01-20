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
type DeleteOrganizationUserPayload struct {
	UserID string `json:"user_id"`
}

type OrganizationUserInfo struct {
	FirstName      string `json:"first_name"`
	LastName       string `json:"last_name"`
	Email          string `json:"email"`
	OrganizationID string `json:"organization_id"`
	UserID         string `json:"user_id"`
	Role           string `json:"role"`
	CreatedAt      string `json:"created_at"`
	UpdatedAt      string `json:"updated_at"`
}

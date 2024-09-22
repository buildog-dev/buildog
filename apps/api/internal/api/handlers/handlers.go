package handlers

import (
	"api/internal/repository"
)

type Handlers struct {
	OrganizationsRepo     *repository.OrganizationRepository
	OrganizationUsersRepo *repository.OrganizationUserRepository
	UserRepo              *repository.UserRepository
}

func NewHandlers(
	OrganizationRepo *repository.OrganizationRepository,
	OrganizationUserRepo *repository.OrganizationUserRepository,
	userRepo *repository.UserRepository,
) *Handlers {
	return &Handlers{
		OrganizationsRepo:     OrganizationRepo,
		OrganizationUsersRepo: OrganizationUserRepo,
		UserRepo:              userRepo,
	}
}

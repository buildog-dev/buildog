package handlers

import (
	"api/internal/repository"
)

type Handlers struct {
	TenantRepo *repository.TenantRepository
	UserRepo   *repository.UserRepository
}

func NewHandlers(tenantRepo *repository.TenantRepository, userRepo *repository.UserRepository) *Handlers {
	return &Handlers{
		TenantRepo: tenantRepo,
		UserRepo:   userRepo,
	}
}

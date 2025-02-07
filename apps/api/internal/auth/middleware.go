package auth

import (
	"api/internal/models"
	"api/pkg/utils"
	"context"
	"net/http"
)

type AuthorizationService interface {
	GetUserRole(organizationID, userID string) (models.Role, error)
	HasPermission(role models.Role, permission Permission) bool
}

type OrganizationUsersRepository interface {
	GetOrganizationUserRole(organizationID, userID string) (models.Role, error)
}

type AuthService struct {
	organizationUsersRepo OrganizationUsersRepository
}

func NewAuthService(repo OrganizationUsersRepository) AuthorizationService {
	return &AuthService{
		organizationUsersRepo: repo,
	}
}

func (s *AuthService) GetUserRole(organizationID, userID string) (models.Role, error) {
	return s.organizationUsersRepo.GetOrganizationUserRole(organizationID, userID)
}

func (s *AuthService) HasPermission(role models.Role, permission Permission) bool {
	permissions, exists := RolePermissions[role]
	if !exists {
		return false
	}

	for _, p := range permissions {
		if p == permission {
			return true
		}
	}
	return false
}

// RequirePermission creates a middleware that checks if the user has the required permission
func RequirePermission(authService AuthorizationService, requiredPermission Permission) func(http.HandlerFunc) http.HandlerFunc {
	return func(next http.HandlerFunc) http.HandlerFunc {
		return func(w http.ResponseWriter, r *http.Request) {
			claims, ok := utils.GetTokenClaims(r)
			if !ok {
				utils.JSONError(w, http.StatusUnauthorized, "Token claims missing")
				return
			}

			userID, ok := utils.GetUserIDFromClaims(claims)
			if !ok {
				utils.JSONError(w, http.StatusBadRequest, "Invalid user ID")
				return
			}

			organizationID := r.Header.Get("organization_id")
			if organizationID == "" {
				utils.JSONError(w, http.StatusBadRequest, "Organization ID is required")
				return
			}

			role, err := authService.GetUserRole(organizationID, userID)
			if err != nil {
				utils.JSONError(w, http.StatusInternalServerError, "Error checking user role")
				return
			}

			if !authService.HasPermission(models.Role(role), requiredPermission) {
				utils.JSONError(w, http.StatusForbidden, "Permission denied")
				return
			}

			// Add role to context for potential use in handlers
			ctx := r.Context()
			ctx = context.WithValue(ctx, "userRole", role)
			ctx = context.WithValue(ctx, "organizationID", organizationID)
			ctx = context.WithValue(ctx, "userID", userID)
			next.ServeHTTP(w, r.WithContext(ctx))
		}
	}
}

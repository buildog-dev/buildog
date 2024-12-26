package api

import (
	"api/internal/auth"
	"net/http"

	"github.com/gorilla/mux"
)

func (a *api) registerOrganizationUserRoutes(router *mux.Router) {
	authService := auth.NewAuthService(a.organizationUsersRepo)

	router.HandleFunc("/organization-user",
		auth.RequirePermission(authService, auth.PermissionReadUser)(a.listOrganizationUsers),
	).Methods(http.MethodGet, http.MethodOptions)

	router.HandleFunc("/organization-user",
		auth.RequirePermission(authService, auth.PermissionCreateUser)(a.addUserToOrganization),
	).Methods(http.MethodPost, http.MethodOptions)

	router.HandleFunc("/organization-user",
		auth.RequirePermission(authService, auth.PermissionUpdateUser)(a.updateUserRoleInOrganization),
	).Methods(http.MethodPut, http.MethodOptions)

	router.HandleFunc("/organization-user",
		auth.RequirePermission(authService, auth.PermissionDeleteUser)(a.deleteUserFromOrganization),
	).Methods(http.MethodDelete, http.MethodOptions)

	router.HandleFunc("/organization-user/{user_id}",
		auth.RequirePermission(authService, auth.PermissionReadUser)(a.getOrganizationUserInfo),
	).Methods(http.MethodGet, http.MethodOptions)
}

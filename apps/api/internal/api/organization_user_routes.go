package api

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/gorilla/mux"
)

func (a *api) registerOrganizationUserRoutes(router *mux.Router) {
	router.HandleFunc("/organization-user", a.listOrganizationUsers).Methods(http.MethodGet, http.MethodOptions)
	router.HandleFunc("/organization-user", a.checkAdminOrOwner(a.addUserToOrganization)).Methods(http.MethodPost, http.MethodOptions)
	router.HandleFunc("/organization-user", a.checkAdminOrOwner(a.updateUserRoleInOrganization)).Methods(http.MethodPut, http.MethodOptions)
	router.HandleFunc("/organization-user", a.checkAdminOrOwner(a.deleteUserFromOrganization)).Methods(http.MethodDelete, http.MethodOptions)
	router.HandleFunc("/organization-user/{user_id}", a.getOrganizationUserInfo).Methods(http.MethodGet, http.MethodOptions)
}

func (a *api) checkAdminOrOwner(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// Extract user ID and organization ID from the request
		// This is a placeholder and should be replaced with actual extraction logic
		var requestBody struct {
			UserID string `json:"user_id"`
		}
		if err := json.NewDecoder(r.Body).Decode(&requestBody); err != nil {
			http.Error(w, "Invalid request body", http.StatusBadRequest)
			return
		}
		userID := requestBody.UserID
		fmt.Println("userID", userID)
		organizationID := r.Header.Get("organization_id")
		fmt.Println("organizationID", organizationID)

		// Get the user's role for the organization
		role, err := a.organizationUsersRepo.GetOrganizationUserRole(organizationID, userID)
		if err != nil {
			fmt.Println("Error checking user role", err)
			fmt.Println(role)
			http.Error(w, "Error checking user role", http.StatusInternalServerError)
			return
		}

		if role == "admin" || role == "owner" {
			next.ServeHTTP(w, r)
		} else {
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
		}
	}
}
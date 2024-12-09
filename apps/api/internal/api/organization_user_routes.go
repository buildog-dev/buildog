package api

import (
	"api/pkg/utils"
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

func (a *api) checkRole(next http.HandlerFunc, roleType string) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var userID string
		var organizationID string

		if roleType == "adminOrOwner" {
			// Extract user ID from the request body for admin or owner check
			var requestBody struct {
				UserID string `json:"user_id"`
			}
			if err := json.NewDecoder(r.Body).Decode(&requestBody); err != nil {
				http.Error(w, "Invalid request body", http.StatusBadRequest)
				return
			}
			userID = requestBody.UserID
			organizationID = r.Header.Get("organization_id")
		} else if roleType == "participant" {
			// Extract user ID from token claims for participant check
			claims, ok := utils.GetTokenClaims(r)
			if !ok {
				utils.JSONError(w, http.StatusUnauthorized, "Token claims missing")
				return
			}

			userID, ok = utils.GetUserIDFromClaims(claims)
			if !ok {
				utils.JSONError(w, http.StatusBadRequest, "Invalid user ID")
				return
			}
			organizationID = r.Header.Get("organization_id")
		} else {
			http.Error(w, "Invalid role type", http.StatusBadRequest)
			return
		}

		// Get the user's role for the organization
		role, err := a.organizationUsersRepo.GetOrganizationUserRole(organizationID, userID)
		if err != nil {
			fmt.Println("Error checking user role", err)
			http.Error(w, "Error checking user role", http.StatusInternalServerError)
			return
		}

		// Check roles based on the role type
		if (roleType == "adminOrOwner" && (role == "admin" || role == "owner")) ||
			(roleType == "participant" && (role == "admin" || role == "owner" || role == "writer")) {
			next.ServeHTTP(w, r)
		} else {
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
		}
	}
}

func (a *api) checkAdminOrOwner(next http.HandlerFunc) http.HandlerFunc {
	return a.checkRole(next, "adminOrOwner")
}

func (a *api) checkParticipant(next http.HandlerFunc) http.HandlerFunc {
	return a.checkRole(next, "participant")
}
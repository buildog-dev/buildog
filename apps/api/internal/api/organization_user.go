package api

import (
	"api/internal/models"
	"api/internal/repository"
	"api/pkg/utils"
	"encoding/json"
	"fmt"
	"log"
	"net/http"

	// "os/user"
	"strings"
)

func (a *api) addUserToOrganization(w http.ResponseWriter, r *http.Request) {
	var payload models.AddUserOrganizationPayload
	if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}
	organizationID := r.Header.Get("organization_id")

	user, err := a.userRepo.GetUserWithEmail(payload.Email)
	if err != nil {
		log.Printf("Error creating user: %v", err)
		utils.JSONError(w, http.StatusInternalServerError, "No permission")
		return
	}

	organization_user := &models.OrganizationUserCreated{
		OrganizationId: organizationID,
		UserId:         user.Id,
		Role:           payload.Role,
	}

	create_organization_user, err := a.organizationUsersRepo.CreateOrganizationUser(organization_user)
	if err != nil {
		log.Printf("Error creating user: %v", err)
		utils.JSONError(w, http.StatusInternalServerError, "Failed to create organization user")
		return
	}

	utils.JSONResponse(w, http.StatusCreated, create_organization_user)
}

// UPDATE ENDPOINT WITH EXTRA ROLE CHECKING

// func (a *api) updateUserRoleInOrganization(w http.ResponseWriter, r *http.Request) {
// 	var payload models.UpdateUserRolePayload
// 	err := json.NewDecoder(r.Body).Decode(&payload)
// 	if err != nil {
// 		utils.JSONError(w, http.StatusBadRequest, "Invalid request payload")
// 		return
// 	}

// 	claims, ok := utils.GetTokenClaims(r)
// 	if !ok {
// 		utils.JSONError(w, http.StatusUnauthorized, "Token claims missing")
// 		return
// 	}

// 	currentUserID, ok := utils.GetUserIDFromClaims(claims)
// 	if !ok {
// 		utils.JSONError(w, http.StatusBadRequest, "Invalid user ID")
// 		return
// 	}

// 	organizationID := r.Header.Get("organization_id")
// 	currentUserRole, err := a.organizationUsersRepo.GetOrganizationUserRole(currentUserID, organizationID)
// 	if err != nil {
// 		log.Printf("Error getting user role: %v", err)
// 		utils.JSONError(w, http.StatusInternalServerError, "Unauthorized")
// 		return
// 	}

// 	if currentUserRole != "admin" && currentUserRole != "owner" {
// 		utils.JSONError(w, http.StatusForbidden, "Insufficient permissions to update user role")
// 		return
// 	}

// 	err = a.organizationUsersRepo.UpdateOrganizationUserRole(organizationID, payload.UserID, payload.Role)
// 	if err != nil {
// 		if _, ok := err.(repository.ErrOrganizationUserNotFound); ok {
// 			utils.JSONError(w, http.StatusNotFound, "User not found in the organization")
// 		} else {
// 			log.Printf("Error updating user role: %v", err)
// 			utils.JSONError(w, http.StatusInternalServerError, "Failed to update user role")
// 		}
// 		return
// 	}

// 	utils.JSONResponse(w, http.StatusOK, map[string]string{"message": "User role updated successfully"})
// }

// UPDATE ENDPOINT WITHOUT EXTRA ROLE CHECKING

func (a *api) updateUserRoleInOrganization(w http.ResponseWriter, r *http.Request) {
	var payload models.UpdateUserRolePayload
	err := json.NewDecoder(r.Body).Decode(&payload)
	if err != nil {
		utils.JSONError(w, http.StatusBadRequest, "Invalid request payload")
		return
	}

	organizationID := r.Header.Get("organization_id")

	// Update the user's role in the organization directly
	fmt.Println("updating user role without explicit role checking: ", payload.UserID, organizationID, payload.Role)
	err = a.organizationUsersRepo.UpdateOrganizationUserRole(organizationID, payload.UserID, payload.Role)
	if err != nil {
		if _, ok := err.(repository.ErrOrganizationUserNotFound); ok {
			utils.JSONError(w, http.StatusNotFound, "User not found in the organization")
		} else {
			log.Printf("Error updating user role: %v", err)
			utils.JSONError(w, http.StatusInternalServerError, "Failed to update user role")
		}
		return
	}

	utils.JSONResponse(w, http.StatusOK, map[string]string{"message": "User role updated successfully"})
}

// DELETE ENDPOINT WITH ROLE CHECKING - ROLE CHECKING CURRENTLY HAS POSSIBLE ERRORS

// func (a *api) deleteUserFromOrganization(w http.ResponseWriter, r *http.Request) {
// 	var payload models.DeleteOrganizationUserPayload
// 	err := json.NewDecoder(r.Body).Decode(&payload)
// 	if err != nil {
// 		utils.JSONError(w, http.StatusBadRequest, "Invalid request payload")
// 		return
// 	}

// 	claims, ok := utils.GetTokenClaims(r)
// 	if !ok {
// 		utils.JSONError(w, http.StatusUnauthorized, "Token claims missing")
// 		return
// 	}

// 	currentUserID, ok := utils.GetUserIDFromClaims(claims)
// 	if !ok {
// 		utils.JSONError(w, http.StatusBadRequest, "Invalid user ID")
// 		return
// 	}

// 	organizationID := r.Header.Get("organization_id")
// 	currentUserRole, err := a.organizationUsersRepo.GetOrganizationUserRole(currentUserID, organizationID)
// 	if err != nil {
// 		log.Printf("Error getting user role: %v", err)
// 		utils.JSONError(w, http.StatusInternalServerError, "Unauthorized")
// 		return
// 	}

// 	if currentUserRole != "admin" && currentUserRole != "owner" {
// 		utils.JSONError(w, http.StatusForbidden, "Insufficient permissions to delete user from organization")
// 		return
// 	}

// 	err = a.organizationUsersRepo.DeleteOrganizationUser(organizationID, payload.UserID)
// 	if err != nil {
// 		if _, ok := err.(repository.ErrOrganizationUserNotFound); ok {
// 			utils.JSONError(w, http.StatusNotFound, "User not found in the organization")
// 		} else {
// 			log.Printf("Error deleting user from organization: %v", err)
// 			utils.JSONError(w, http.StatusInternalServerError, "Failed to delete user from organization")
// 		}
// 		return
// 	}

// 	utils.JSONResponse(w, http.StatusOK, map[string]string{"message": "User deleted from organization successfully"})
// }

// DELETE ENDPOINT WITHOUT ROLE CHECKING

func (a *api) deleteUserFromOrganization(w http.ResponseWriter, r *http.Request) {
	var payload models.DeleteOrganizationUserPayload
	err := json.NewDecoder(r.Body).Decode(&payload)
	if err != nil {
		utils.JSONError(w, http.StatusBadRequest, "Invalid request payload")
		return
	}

	organizationID := r.Header.Get("organization_id")

	// Delete the user from organization directly
	fmt.Println("deleting user without role checking: ", payload.UserID, organizationID)
	err = a.organizationUsersRepo.DeleteOrganizationUser(organizationID, payload.UserID)
	if err != nil {
		if _, ok := err.(repository.ErrOrganizationUserNotFound); ok {
			utils.JSONError(w, http.StatusNotFound, "User not found in the organization")
		} else {
			log.Printf("Error deleting user from organization: %v", err)
			utils.JSONError(w, http.StatusInternalServerError, "Failed to delete user from organization")
		}
		return
	}

	utils.JSONResponse(w, http.StatusOK, map[string]string{"message": "User deleted from organization successfully"})
}

func (a *api) getOrganizationUserInfo(w http.ResponseWriter, r *http.Request) {
	path := r.URL.Path
	parts := strings.Split(path, "/")
	userID := parts[len(parts)-1]

	if userID == "" {
		utils.JSONError(w, http.StatusBadRequest, "User ID is required")
		return
	}

	organizationID := r.Header.Get("organization_id")

	userInfo, err := a.organizationUsersRepo.GetOrganizationUserInfo(userID, organizationID)

	if err != nil {
		if _, ok := err.(repository.ErrOrganizationUserNotFound); ok {
			utils.JSONError(w, http.StatusNotFound, "User not found in the organization")
		} else {
			log.Printf("Error getting user information: %v", err)
			utils.JSONError(w, http.StatusInternalServerError, "Failed to get user information")
		}
		return
	}

	utils.JSONResponse(w, http.StatusOK, userInfo)
}

func (a *api) listOrganizationUsers(w http.ResponseWriter, r *http.Request) {
	organizationID := r.Header.Get("organization_id")
	if organizationID == "" {
		utils.JSONError(w, http.StatusBadRequest, "Organization ID is required")
		return
	}

	users, err := a.organizationUsersRepo.ListOrganizationUsers(organizationID)
	if err != nil {
		log.Printf("Error listing organization users: %v", err)
		utils.JSONError(w, http.StatusInternalServerError, "Failed to list organization users")
		return
	}

	if len(users) == 0 {
		utils.JSONResponse(w, http.StatusOK, []models.OrganizationUserInfo{})
		return
	}

	utils.JSONResponse(w, http.StatusOK, users)
}

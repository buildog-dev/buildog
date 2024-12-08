package api

import (
	"api/internal/models"
	"api/internal/repository"
	"api/pkg/utils"
	"encoding/json"
	"log"
	"net/http"
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
		log.Printf("Error fetching user by email: %v", err)
		utils.JSONError(w, http.StatusInternalServerError, "Failed to retrieve user")
		return
	}

	exists, err := a.organizationUsersRepo.IsUserInOrganization(organizationID, user.Id)
	if err != nil {
		log.Printf("Error checking if user is in organization: %v", err)
		utils.JSONError(w, http.StatusInternalServerError, "Failed to check organization membership")
		return
	}

	if exists {
		utils.JSONError(w, http.StatusConflict, "User is already a member of the organization")
		return
	}

	organizationUser := &models.OrganizationUserCreated{
		OrganizationId: organizationID,
		UserId:         user.Id,
		Role:           payload.Role,
	}

	createdOrganizationUser, err := a.organizationUsersRepo.CreateOrganizationUser(organizationUser)
	if err != nil {
		log.Printf("Error creating organization user: %v", err)
		utils.JSONError(w, http.StatusInternalServerError, "Failed to create organization user")
		return
	}

	response := map[string]interface{}{
		"user_id":    createdOrganizationUser.UserId,
		"email":      payload.Email,
		"role":       payload.Role,
		"first_name": user.FirstName,
		"last_name":  user.LastName,
	}

	utils.JSONResponse(w, http.StatusCreated, response)
}

func (a *api) updateUserRoleInOrganization(w http.ResponseWriter, r *http.Request) {
	var payload models.UpdateUserRolePayload
	err := json.NewDecoder(r.Body).Decode(&payload)
	if err != nil {
		utils.JSONError(w, http.StatusBadRequest, "Invalid request payload")
		return
	}

	claims, ok := utils.GetTokenClaims(r)
	if !ok {
		utils.JSONError(w, http.StatusUnauthorized, "Token claims missing")
		return
	}

	currentUserID, ok := utils.GetUserIDFromClaims(claims)
	if !ok {
		utils.JSONError(w, http.StatusBadRequest, "Invalid user ID in token")
		return
	}

	if currentUserID == payload.UserID {
		utils.JSONError(w, http.StatusForbidden, "You cannot change your own role")
		return
	}

	organizationID := r.Header.Get("organization_id")

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

func (a *api) deleteUserFromOrganization(w http.ResponseWriter, r *http.Request) {
	var payload models.DeleteOrganizationUserPayload
	err := json.NewDecoder(r.Body).Decode(&payload)
	if err != nil {
		utils.JSONError(w, http.StatusBadRequest, "Invalid request payload")
		return
	}

	claims, ok := utils.GetTokenClaims(r)
	if !ok {
		utils.JSONError(w, http.StatusUnauthorized, "Token claims missing")
		return
	}

	currentUserID, ok := utils.GetUserIDFromClaims(claims)
	if !ok {
		utils.JSONError(w, http.StatusBadRequest, "Invalid user ID in token")
		return
	}

	if currentUserID == payload.UserID {
		utils.JSONError(w, http.StatusForbidden, "You cannot delete yourself from the organization")
		return
	}

	organizationID := r.Header.Get("organization_id")

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

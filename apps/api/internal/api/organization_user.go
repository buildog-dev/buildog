package api

import (
	"api/internal/models"
	"api/internal/repository"
	"api/pkg/utils"
	"encoding/json"
	"log"
	"net/http"
)

func (a *api) addUserToOrganization(w http.ResponseWriter, r *http.Request) {
	var payload models.AddUserOrganizationPayload
	if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

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

	// check authorization for create user
	organizationID := r.Header.Get("organization_id")
	role, err := a.organizationUsersRepo.GetOrganizationUser(userID, organizationID)
	if err != nil {
		log.Printf("Error getting user: %v", err)
		utils.JSONError(w, http.StatusInternalServerError, "Unauthoruized")
		return
	}

	if role == "admin" || role == "owner" {
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
		return
	}

	utils.JSONError(w, http.StatusInternalServerError, "Failed to create organization user")
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
		utils.JSONError(w, http.StatusBadRequest, "Invalid user ID")
		return
	}

	organizationID := r.Header.Get("organization_id")
	currentUserRole, err := a.organizationUsersRepo.GetOrganizationUser(currentUserID, organizationID)
	if err != nil {
		log.Printf("Error getting user role: %v", err)
		utils.JSONError(w, http.StatusInternalServerError, "Unauthorized")
		return
	}

	if currentUserRole != "admin" && currentUserRole != "owner" {
		utils.JSONError(w, http.StatusForbidden, "Insufficient permissions to update user role")
		return
	}

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
		utils.JSONError(w, http.StatusBadRequest, "Invalid user ID")
		return
	}

	organizationID := r.Header.Get("organization_id")
	currentUserRole, err := a.organizationUsersRepo.GetOrganizationUser(currentUserID, organizationID)
	if err != nil {
		log.Printf("Error getting user role: %v", err)
		utils.JSONError(w, http.StatusInternalServerError, "Unauthorized")
		return
	}

	if currentUserRole != "admin" && currentUserRole != "owner" {
		utils.JSONError(w, http.StatusForbidden, "Insufficient permissions to delete user from organization")
		return
	}

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

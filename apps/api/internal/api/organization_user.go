package api

import (
	"api/internal/models"
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

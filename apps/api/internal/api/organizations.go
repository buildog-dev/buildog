package api

import (
	"api/internal/models"
	"api/pkg/utils"
	"encoding/json"
	"log"
	"net/http"
)

func (a *api) getOrganizationsHandler(w http.ResponseWriter, r *http.Request) {
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

	organizations, err := a.organizationsRepo.GetAllOrganizations(userID)

	if err != nil {
		log.Printf("Error creating user: %v", err)
		utils.JSONError(w, http.StatusInternalServerError, "Failed to create organization")
		return
	}

	utils.JSONResponse(w, http.StatusCreated, organizations)
}

func (a *api) createOrganizationHandler(w http.ResponseWriter, r *http.Request) {
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

	var payload models.OrganizationBody
	if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	org := models.Organization{
		Name:        payload.OrganizationName,
		Description: payload.OrganizationDescription,
		CreatedBy:   userID,
	}

	organization, err := a.organizationsRepo.CreateOrganization(&org)
	if err != nil {
		log.Printf("Error creating user: %v", err)
		utils.JSONError(w, http.StatusInternalServerError, "Failed to create organization")
		return
	}

	user := &models.OrganizationUserCreated{
		OrganizationId: organization.Id,
		UserId:         userID,
		Role:           "owner",
	}

	organizationUser, err := a.organizationUsersRepo.CreateOrganizationUser(user)
	if err != nil {
		log.Printf("Error creating user: %v", err)
		utils.JSONError(w, http.StatusInternalServerError, "Failed to create organization")
		return
	}

	utils.JSONResponse(w, http.StatusCreated, organizationUser)
}

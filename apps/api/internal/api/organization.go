package api

import (
	"api/pkg/utils"
	"log"
	"net/http"
)

func (a *api) getOrganizationHandler(w http.ResponseWriter, r *http.Request) {
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
	organization, err := a.organizationsRepo.GetOrganization(organizationID, userID)

	if err != nil {
		log.Printf("Error getting organization: %v", err)
		utils.JSONError(w, http.StatusInternalServerError, "Failed to get organization")
		return
	}

	utils.JSONResponse(w, http.StatusCreated, organization)
}

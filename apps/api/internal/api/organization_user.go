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
			UserId:         user.UserId,
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

// func (h *Handlers) removeUserFromTenant(w http.ResponseWriter, r *http.Request) {
// 	var payload models.TenantUserDeleteAndAdd

// 	if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
// 		http.Error(w, "Invalid request body", http.StatusBadRequest)
// 		return
// 	}

// 	// get user
// 	user, err := h.UserRepo.GetUser(payload.TargetUserID)
// 	if err != nil {
// 		http.Error(w, "Failed to get user", http.StatusInternalServerError)
// 		return
// 	}

// 	// remove user from tenant
// 	if err := h.UserRepo.DeleteTenantUser(user, payload.TenantID); err != nil {
// 		http.Error(w, "Failed to remove user from tenant", http.StatusInternalServerError)
// 		return
// 	}

// 	w.WriteHeader(http.StatusOK)
// }

// func (h *Handlers) updateTenantUserHandler(w http.ResponseWriter, r *http.Request) {
// 	var payload models.TenantUserUpdate

// 	if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
// 		http.Error(w, "Invalid request body", http.StatusBadRequest)
// 		return
// 	}

// 	if !helpers.IsRoleValid(payload.ChangedRole) && payload.ChangedRole != "" {
// 		http.Error(w, "Invalid role", http.StatusBadRequest)
// 		return
// 	}

// 	// get user
// 	user, err := h.UserRepo.GetTenantUser(payload.TenantID, payload.TargetUserID)
// 	if err != nil {
// 		http.Error(w, "Failed to get user", http.StatusInternalServerError)
// 		return
// 	}

// 	if err := h.UserRepo.UpdateTenantUser(payload.TenantID, user.UserId, payload.ChangedRole); err != nil {
// 		http.Error(w, "Failed to update tenant user", http.StatusInternalServerError)
// 		return
// 	}

// 	w.WriteHeader(http.StatusOK)

// }

// func (h *Handlers) getTenantUserHandler(w http.ResponseWriter, r *http.Request) {
// 	tenantId := r.URL.Query().Get("tenant_id")
// 	tenantIdInt, err := strconv.Atoi(tenantId)
// 	if err != nil {
// 		http.Error(w, "Invalid tenant ID", http.StatusBadRequest)
// 		return
// 	}
// 	targetUserId := r.URL.Query().Get("target_user_id")

// 	user, err := h.UserRepo.GetTenantUser(int64(tenantIdInt), targetUserId)
// 	if err != nil {
// 		http.Error(w, "Failed to get user", http.StatusInternalServerError)
// 		return
// 	}

// 	w.Header().Set("Content-Type", "application/json")

// 	response := map[string]interface{}{
// 		"first_name":        user.FirstName,
// 		"last_name":         user.LastName,
// 		"email":             user.Email,
// 		"organization_name": user.OrganizationName,
// 	}
// 	json.NewEncoder(w).Encode(response)

// 	w.WriteHeader(http.StatusOK)
// }

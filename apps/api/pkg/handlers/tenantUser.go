package handlers

import (
	"api/pkg/database"
	"api/pkg/helpers"
	"api/pkg/models"
	"encoding/json"
	"net/http"
)

func TenantUserHandler(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case http.MethodPost:
		addUserToTenant(w, r)
	case http.MethodDelete:
		removeUserFromTenant(w, r)
	case http.MethodPut:
		updateTenantUserHandler(w, r)
	default:
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
	}
}

func addUserToTenant(w http.ResponseWriter, r *http.Request) {

	var payload models.TenantUserDeleteAndAdd

	if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	if !helpers.IsRoleValid(payload.Role) {
		http.Error(w, "Invalid role", http.StatusBadRequest)
		return
	}

	// get user
	user, err := database.GetUser(payload.TargetUserID)
	if err != nil {
		http.Error(w, "Failed to get target user", http.StatusInternalServerError)
		return
	}

	// add user to tenant
	if err := database.CreateTenantUser(user, payload.TenantID, payload.Role); err != nil {
		http.Error(w, "Failed to add user to tenant", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
}

func removeUserFromTenant(w http.ResponseWriter, r *http.Request) {

	var payload models.TenantUserDeleteAndAdd

	if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	// get user
	user, err := database.GetUser(payload.TargetUserID)
	if err != nil {
		http.Error(w, "Failed to get user", http.StatusInternalServerError)
		return
	}

	// remove user from tenant
	if err := database.DeleteTenantUser(user, payload.TenantID); err != nil {
		http.Error(w, "Failed to remove user from tenant", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
}

func updateTenantUserHandler(w http.ResponseWriter, r *http.Request) {

	var payload models.TenantUserUpdate

	if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	if !helpers.IsRoleValid(payload.ChangedRole) && payload.ChangedRole != "" {
		http.Error(w, "Invalid role", http.StatusBadRequest)
		return
	}

	// get user
	user, err := database.GetTenantUser(payload.TenantID, payload.TargetUserID)
	if err != nil {
		http.Error(w, "Failed to get user", http.StatusInternalServerError)
		return
	}

	if err := database.UpdateTenantUserRole(payload.TenantID, user.UserId, payload.ChangedRole); err != nil {
		http.Error(w, "Failed to update tenant user", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)

}

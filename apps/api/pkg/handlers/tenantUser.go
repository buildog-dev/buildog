package handlers

import (
	"api/pkg/database"
	"api/pkg/helpers"
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
	type Payload struct {
		TenantID          int64  `json:"tenant_id"`
		RequestedByUserId string `json:"requested_by_id"`
		TargetUserID      string `json:"target_user_id"`
		Role              string `json:"role"`
	}

	var payload Payload

	if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	if !helpers.IsRoleValid(payload.Role) {
		http.Error(w, "Invalid role", http.StatusBadRequest)
		return
	}

	if payload.RequestedByUserId == payload.TargetUserID {
		http.Error(w, "Invalid request", http.StatusBadRequest)
		return
	}

	//get Requested By user
	requestedByUser, err := database.GetTenantUser(payload.RequestedByUserId)
	if err != nil {
		http.Error(w, "Failed to get user", http.StatusInternalServerError)
		return
	}

	// check if user is authorized to perform this action
	if requestedByUser.Role != "admin" || requestedByUser.TenantId != payload.TenantID {
		http.Error(w, "User is not authorized to perform this action", http.StatusUnauthorized)
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
	type Payload struct {
		TenantID          int64  `json:"tenant_id"`
		RequestedByUserId string `json:"requested_by_id"`
		TargetUserID      string `json:"target_user_id"`
		Role              string `json:"role"`
	}

	var payload Payload

	if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	if payload.RequestedByUserId == payload.TargetUserID {
		http.Error(w, "Invalid request", http.StatusBadRequest)
		return
	}

	//get Requested By user
	requestedByUser, err := database.GetTenantUser(payload.RequestedByUserId)
	if err != nil {
		http.Error(w, "Failed to get user", http.StatusInternalServerError)
		return
	}

	// check if role is valid
	if !helpers.IsRoleValid(requestedByUser.Role) {
		http.Error(w, "Invalid role", http.StatusBadRequest)
		return
	}

	// check if user is authorized to perform this action
	if requestedByUser.Role != "admin" || requestedByUser.TenantId != payload.TenantID {
		http.Error(w, "User is not authorized to perform this action", http.StatusUnauthorized)
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

	type Payload struct {
		TenantID          int64  `json:"tenant_id"`
		RequestedByUserId string `json:"requested_by_id"`
		TargetUserID      string `json:"target_user_id"`
		ChangedUserID     string `json:"changed_user_id"`
		ChangedRole       string `json:"changed_role"`
	}

	var payload Payload
	if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	if !helpers.IsRoleValid(payload.ChangedRole) && payload.ChangedRole != "" {
		http.Error(w, "Invalid role", http.StatusBadRequest)
		return
	}

	if payload.RequestedByUserId == payload.TargetUserID {
		http.Error(w, "Invalid request", http.StatusBadRequest)
		return
	}

	//get Requested By user
	requestedByUser, err := database.GetTenantUser(payload.RequestedByUserId)
	if err != nil {
		http.Error(w, "Failed to get user", http.StatusInternalServerError)
		return
	}

	if requestedByUser.Role != "admin" || requestedByUser.TenantId != payload.TenantID {
		http.Error(w, "User is not authorized to perform this action", http.StatusUnauthorized)
		return
	}

	// get user
	user, err := database.GetTenantUser(payload.TargetUserID)
	if err != nil {
		http.Error(w, "Failed to get user", http.StatusInternalServerError)
		return
	}

	// update tenant user id
	if payload.ChangedUserID != "" {
		if err := database.UpdateTenantUserId(payload.TenantID, user.UserId, payload.ChangedUserID); err != nil {
			http.Error(w, "Failed to update tenant user", http.StatusInternalServerError)
			return
		}

	}

	// update tenant user role
	if payload.ChangedRole != "" {
		if err := database.UpdateTenantUserRole(payload.TenantID, user.UserId, payload.ChangedRole); err != nil {
			http.Error(w, "Failed to update tenant user", http.StatusInternalServerError)
			return
		}
	}

	w.WriteHeader(http.StatusOK)

}

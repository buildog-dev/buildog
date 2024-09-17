package handlers

import (
	"api/internal/middleware"
	"api/internal/models"
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"
)

func (h *Handlers) TenantsHandler(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case http.MethodGet:
		h.getTenantsHandler(w, r)
	case http.MethodPost:
		h.createTenantHandler(w, r)
	default:
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
	}
}

// tenantHandler handles requests to /tenants/{tenantID}.
func (h *Handlers) TenantHandler(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case http.MethodGet:
		h.getTenantHandler(w, r)
	case http.MethodPut:
		h.updateTenantHandler(w, r)
	case http.MethodDelete:
		h.deleteTenantHandler(w, r)
	default:
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
	}
}

func (h *Handlers) getTenantsHandler(w http.ResponseWriter, r *http.Request) {
	claims, ok := r.Context().Value("tokenClaims").(map[string]any)
	if !ok {
		return
	}
	if claims == nil {
		return
	}

	userIDInterface := claims["user_id"]
	userID, ok := userIDInterface.(string)
	if !ok {
		http.Error(w, "Invalid user ID", http.StatusBadRequest)
		return
	}

	// get all tenants
	h.TenantRepo.GetAllTenants(userID)
	w.WriteHeader(http.StatusOK)
	w.Write([]byte("Tenants"))
}

func (h *Handlers) createTenantHandler(w http.ResponseWriter, r *http.Request) {
	var payload models.CreateTenant

	if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	tokenString := middleware.ExtractToken(r)

	payloadData, err := middleware.ExtractPayload(tokenString)
	if err != nil {
		http.Error(w, "Error extracting payload", http.StatusUnauthorized)
		return
	}

	userId := payloadData["user_id"].(string)

	//get user
	user, err := h.UserRepo.GetUser(userId)
	if err != nil {
		http.Error(w, "Failed to get user", http.StatusInternalServerError)
		return
	}

	tenant := models.Tenant{
		Name: payload.OrganizationName,
	}

	//create tenant
	tenantId, err := h.TenantRepo.CreateTenant(&tenant)
	if err != nil {
		http.Error(w, "Failed to create tenant", http.StatusInternalServerError)
		return
	}

	//create tenant user
	err = h.UserRepo.CreateTenantUser(user, tenantId, "admin")
	if err != nil {
		http.Error(w, "Failed to create tenant user", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	w.Write([]byte("Tenant created"))
}

func (h *Handlers) getTenantHandler(w http.ResponseWriter, r *http.Request) {
	tenantId := r.URL.Query().Get("tenant_id")
	tenantIdInt, err := strconv.Atoi(tenantId)
	if err != nil {
		http.Error(w, "Invalid tenant ID", http.StatusBadRequest)
		return
	}

	tenant, err := h.TenantRepo.GetTenantById(int64(tenantIdInt))

	if err != nil {
		http.Error(w, "Failed to get tenant", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	response := map[string]interface{}{
		"id":   tenant.ID,
		"name": tenant.Name,
	}
	json.NewEncoder(w).Encode(response)

	w.WriteHeader(http.StatusOK)
}

func (h *Handlers) updateTenantHandler(w http.ResponseWriter, r *http.Request) {

	var payload models.UpdateTenant

	if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
		http.Error(w, "Invalid request payload", http.StatusBadRequest)
		return
	}

	if err := h.TenantRepo.UpdateTenant(payload.TenantId, payload.TenantName); err != nil {
		http.Error(w, "Failed to get tenant", http.StatusInternalServerError)
		return
	}

	response := fmt.Sprintf("Tanant name updated: %s", payload.TenantName)
	w.WriteHeader(http.StatusOK)
	w.Write([]byte(response))
}

func (h *Handlers) deleteTenantHandler(w http.ResponseWriter, r *http.Request) {

	var payload models.DeleteTenant

	if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	if err := h.TenantRepo.DeleteTenant(payload.TenantID); err != nil {
		http.Error(w, "Failed to delete tenant", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	w.Write([]byte("Tenant deleted"))
}

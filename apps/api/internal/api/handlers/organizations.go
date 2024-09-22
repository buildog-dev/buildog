package handlers

import (
	"api/internal/models"
	"api/pkg/utils"
	"encoding/json"
	"log"
	"net/http"
)

func (h *Handlers) OrganizationsHandler(w http.ResponseWriter, r *http.Request) {
	log.Print('a')
	switch r.Method {
	case http.MethodGet:
		h.getOrganizationsHandler(w, r)
	case http.MethodPost:
		h.createOrganizationHandler(w, r)
	default:
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
	}
}

func (h *Handlers) getOrganizationsHandler(w http.ResponseWriter, r *http.Request) {
	log.Print('a')
	claims, ok := r.Context().Value("tokenClaims").(map[string]any)
	if !ok {
		return
	}

	userIDInterface := claims["user_id"]
	userID, ok := userIDInterface.(string)
	if !ok {
		http.Error(w, "Invalid user ID", http.StatusBadRequest)
		return
	}

	// get all tenants
	organizations, err := h.OrganizationsRepo.GetAllOrganizations(userID)

	if err != nil {
		log.Printf("Error creating user: %v", err)
		utils.JSONError(w, http.StatusInternalServerError, "Failed to create organization")
		return
	}

	log.Print(organizations)

	utils.JSONResponse(w, http.StatusCreated, organizations)
}

func (h *Handlers) createOrganizationHandler(w http.ResponseWriter, r *http.Request) {
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
		OrganizationName:        payload.OrganizationName,
		OrganizationDescription: payload.OrganizationDescription,
		CreatedBy:               userID,
	}

	organization, err := h.OrganizationsRepo.CreateOrganization(&org)
	if err != nil {
		log.Printf("Error creating user: %v", err)
		utils.JSONError(w, http.StatusInternalServerError, "Failed to create organization")
		return
	}

	user := &models.OrganizationUserCreated{
		OrganizationId: organization.Organization_id,
		UserId:         userID,
		Role:           "owner",
	}

	organizationUser, err := h.OrganizationsRepo.CreateOrganizationUser(user)
	if err != nil {
		log.Printf("Error creating user: %v", err)
		utils.JSONError(w, http.StatusInternalServerError, "Failed to create organization")
		return
	}

	log.Print(organizationUser)

	utils.JSONResponse(w, http.StatusCreated, organization)
}

// tenantHandler handles requests to /tenants/{tenantID}.
// func (h *Handlers) TenantHandler(w http.ResponseWriter, r *http.Request) {
// 	switch r.Method {
// 	case http.MethodPost:
// 		h.createTenantHandler(w, r)
// 	// case http.MethodGet:
// 	// 	h.getTenantHandler(w, r)
// 	// case http.MethodPut:
// 	// 	h.updateTenantHandler(w, r)
// 	// case http.MethodDelete:
// 	// 	h.deleteTenantHandler(w, r)
// 	default:
// 		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
// 	}
// }

// func (h *Handlers) getTenantHandler(w http.ResponseWriter, r *http.Request) {
// 	tenantId := r.URL.Query().Get("tenant_id")
// 	tenantIdInt, err := strconv.Atoi(tenantId)
// 	if err != nil {
// 		http.Error(w, "Invalid tenant ID", http.StatusBadRequest)
// 		return
// 	}

// 	tenant, err := h.OrganizationsRepo.GetTenantById(int64(tenantIdInt))

// 	if err != nil {
// 		http.Error(w, "Failed to get tenant", http.StatusInternalServerError)
// 		return
// 	}

// 	w.Header().Set("Content-Type", "application/json")
// 	response := map[string]interface{}{
// 		"id":   tenant.ID,
// 		"name": tenant.Name,
// 	}
// 	json.NewEncoder(w).Encode(response)

// 	w.WriteHeader(http.StatusOK)
// }

// func (h *Handlers) updateTenantHandler(w http.ResponseWriter, r *http.Request) {
// 	var payload models.UpdateTenant

// 	if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
// 		http.Error(w, "Invalid request payload", http.StatusBadRequest)
// 		return
// 	}

// 	if err := h.OrganizationsRepo.UpdateTenant(payload.TenantId, payload.TenantName); err != nil {
// 		http.Error(w, "Failed to get tenant", http.StatusInternalServerError)
// 		return
// 	}

// 	response := fmt.Sprintf("Tanant name updated: %s", payload.TenantName)
// 	w.WriteHeader(http.StatusOK)
// 	w.Write([]byte(response))
// }

// func (h *Handlers) deleteTenantHandler(w http.ResponseWriter, r *http.Request) {
// 	var payload models.DeleteTenant

// 	if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
// 		http.Error(w, "Invalid request body", http.StatusBadRequest)
// 		return
// 	}

// 	if err := h.OrganizationsRepo.DeleteTenant(payload.TenantID); err != nil {
// 		http.Error(w, "Failed to delete tenant", http.StatusInternalServerError)
// 		return
// 	}

// 	w.WriteHeader(http.StatusOK)
// 	w.Write([]byte("Tenant deleted"))
// }

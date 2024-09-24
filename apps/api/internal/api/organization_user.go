package api

// func (h *Handlers) OrganizationUserHandler(w http.ResponseWriter, r *http.Request) {
// 	switch r.Method {
// 	case http.MethodPost:
// 		h.addUserToOrganization(w, r)
// 	// case http.MethodDelete:
// 	// 	h.removeUserFromTenant(w, r)
// 	// case http.MethodPut:
// 	// 	h.updateTenantUserHandler(w, r)
// 	// case http.MethodGet:
// 	// 	h.getTenantUserHandler(w, r)
// 	default:
// 		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
// 	}
// }

// func (h *Handlers) addUserToOrganization(w http.ResponseWriter, r *http.Request) {
// 	var payload models.TenantUserDeleteAndAdd

// 	if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
// 		http.Error(w, "Invalid request body", http.StatusBadRequest)
// 		return
// 	}

// 	if !helpers.IsRoleValid(payload.Role) {
// 		http.Error(w, "Invalid role", http.StatusBadRequest)
// 		return
// 	}

// 	// get user
// 	user, err := h.UserRepo.GetUser(payload.TargetUserID)
// 	if err != nil {
// 		http.Error(w, "Failed to get target user", http.StatusInternalServerError)
// 		return
// 	}

// 	// add user to tenant
// 	if err := h.UserRepo.CreateTenantUser(user, payload.TenantID, payload.Role); err != nil {
// 		http.Error(w, "Failed to add user to tenant", http.StatusInternalServerError)
// 		return
// 	}

// 	w.WriteHeader(http.StatusOK)
// }

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

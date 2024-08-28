package handlers

import "net/http"

type reqFormat struct {
	OrganizationName string `json:"organization_name"`
	UserId           string `json:"user_id"`
}

func TenantUserHandler(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case http.MethodPost:
		// createTenantUserHandler(w, r)
	default:
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
	}
}

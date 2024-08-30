package middleware

import (
	"api/pkg/database"
	"encoding/json"
	"net/http"
)

// AuthMiddleware checks if the user is authorized to perform the action
func EnsureUserAuthorized(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		type Payload struct {
			TenantID          int64  `json:"tenant_id"`
			RequestedByUserId string `json:"requested_by_id"`
		}

		var payload Payload

		if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
			http.Error(w, "Invalid request body", http.StatusBadRequest)
			return
		}

		requestedByUser, err := database.GetTenantUser(payload.TenantID, payload.RequestedByUserId)
		if err != nil {
			http.Error(w, "Failed to get user", http.StatusInternalServerError)
			return
		}

		if requestedByUser.Role != "admin" {
			http.Error(w, "User is not authorized to perform this action", http.StatusUnauthorized)
			return
		}

		// Call the next handler if the user is authorized
		next.ServeHTTP(w, r)
	}
}

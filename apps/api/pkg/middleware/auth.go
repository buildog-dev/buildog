package middleware

import (
	"api/pkg/database"
	"bytes"
	"encoding/json"
	"io"
	"net/http"
)

// EnsureUserAuthorized checks if the user is authorized to perform the action
func EnsureUserAuthorized(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var payload struct {
			TenantID          int64  `json:"tenant_id"`
			RequestedByUserId string `json:"requested_by_id"`
		}

		// Read the body and create a buffer
		bodyBuffer := new(bytes.Buffer)
		tee := io.TeeReader(r.Body, bodyBuffer)

		if err := json.NewDecoder(tee).Decode(&payload); err != nil {
			http.Error(w, "Invalid request body", http.StatusBadRequest)
			return
		}

		// Reset the body to the original state
		r.Body = io.NopCloser(bodyBuffer)

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

package middleware

import (
	"api/pkg/database"
	"bytes"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"strconv"
	"strings"
)

// EnsureUserAuthorized checks if the user is authorized to perform the action
func EnsureUserAuthorized(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {

		var payload struct {
			TenantID int64 `json:"tenant_id"`
		}

		if r.Method == http.MethodGet {
			tenantId, err := strconv.Atoi(r.URL.Query().Get("tenant_id"))
			if err != nil {
				http.Error(w, "Invalid tenant ID", http.StatusBadRequest)
				return
			}
			payload.TenantID = int64(tenantId)

		} else {
			// Read the body and create a buffer
			bodyBuffer := new(bytes.Buffer)
			tee := io.TeeReader(r.Body, bodyBuffer)

			if err := json.NewDecoder(tee).Decode(&payload); err != nil {
				http.Error(w, "Invalid request body", http.StatusBadRequest)
				return
			}

			// Reset the body to the original state
			r.Body = io.NopCloser(bodyBuffer)

		}

		tokenString := ExtractToken(r)

		payloadData, err := ExtractPayload(tokenString)
		if err != nil {
			http.Error(w, "Error extracting payload", http.StatusUnauthorized)
			return
		}

		userId := payloadData["user_id"].(string)

		requestedByUser, err := database.GetTenantUser(payload.TenantID, userId)
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
	})
}

// ExtractPayload extracts the payload from a JWT token
func ExtractPayload(tokenString string) (map[string]interface{}, error) {
	parts := strings.Split(tokenString, ".")
	if len(parts) != 3 {
		return nil, fmt.Errorf("invalid token format")
	}

	payload, err := DecodeSegment(parts[1])
	if err != nil {
		return nil, fmt.Errorf("error decoding payload: %v", err)
	}

	var payloadData map[string]interface{}
	if err := json.Unmarshal(payload, &payloadData); err != nil {
		return nil, fmt.Errorf("error unmarshalling payload: %v", err)
	}

	return payloadData, nil
}

func DecodeSegment(seg string) ([]byte, error) {
	// Add padding to make the length a multiple of 4
	padding := len(seg) % 4
	if padding > 0 {
		seg += strings.Repeat("=", 4-padding)
	}

	return base64.URLEncoding.DecodeString(seg)
}

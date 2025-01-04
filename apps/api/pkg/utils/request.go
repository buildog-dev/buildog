package utils

import (
	"encoding/json"
	"net/http"
)

// DecodeJSONBody decodes a JSON request body into the provided interface.
// Returns true if successful, false if there was an error.
// In case of error, it will write an appropriate error response to the ResponseWriter.
func DecodeJSONBody(w http.ResponseWriter, r *http.Request, v interface{}) bool {
	if err := json.NewDecoder(r.Body).Decode(v); err != nil {
		JSONError(w, http.StatusBadRequest, "Invalid request payload")
		return false
	}
	return true
}

// Extracts token claims from the context
func GetTokenClaims(r *http.Request) (map[string]any, bool) {
	claims, ok := r.Context().Value("tokenClaims").(map[string]any)
	return claims, ok
}

// Extracts user ID from token claims
func GetUserIDFromClaims(claims map[string]any) (string, bool) {
	userIDInterface, ok := claims["user_id"]
	if !ok {
		return "", false
	}
	userID, ok := userIDInterface.(string)
	return userID, ok
}

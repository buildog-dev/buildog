package utils

import (
	"encoding/json"
	"net/http"
)

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

// Decodes the request body into the given payload
func DecodeRequestBody(r *http.Request, payload interface{}) error {
	return json.NewDecoder(r.Body).Decode(payload)
}

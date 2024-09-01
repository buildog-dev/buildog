package middleware

import (
	"api/pkg/firebase"
	"context"
	"net/http"
	"strings"
)

const (
	missingJWTErrorMessage       = "Requires authentication"
	invalidJWTErrorMessage       = "Bad credentials"
	permissionDeniedErrorMessage = "Permission denied"
)

// EnsureValidToken is a middleware that will check the validity of our JWT.
func EnsureValidToken(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		token := ExtractToken(r)
		if token == "" {
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}

		authClient, err := firebase.GetAuthClient()
		if err != nil {
			http.Error(w, "Firebase: "+err.Error(), http.StatusUnauthorized)
			return
		}

		_, err = authClient.VerifyIDToken(context.Background(), token)
		if err != nil {
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}

		// Token is valid, proceed with the request
		next.ServeHTTP(w, r)
	})
}

// extractToken extracts the token from the Authorization header
func ExtractToken(r *http.Request) string {
	authHeader := r.Header.Get("Authorization")
	if strings.HasPrefix(authHeader, "Bearer ") {
		return strings.TrimPrefix(authHeader, "Bearer ")
	}
	return ""
}

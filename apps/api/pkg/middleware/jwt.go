package middleware

import (
	"api/pkg/helpers"
	"context"
	"fmt"
	"log"
	"net/http"
	"net/url"
	"strings"
	"time"

	jwtmiddleware "github.com/auth0/go-jwt-middleware/v2"
	"github.com/auth0/go-jwt-middleware/v2/jwks"
	"github.com/auth0/go-jwt-middleware/v2/validator"
)

const (
	missingJWTErrorMessage       = "Requires authentication"
	invalidJWTErrorMessage       = "Bad credentials"
	permissionDeniedErrorMessage = "Permission denied"
)

// CustomClaims contains custom data we want from the token.
type CustomClaims struct {
	Scope string `json:"scope"`
}

type ErrorMessage struct {
	Message string `json:"message"`
}

// Validate does nothing for this example, but we need
// it to satisfy validator.CustomClaims interface.
func (c CustomClaims) Validate(ctx context.Context) error {
	return nil
}

// HasScope checks whether our claims have a specific scope.
func (c CustomClaims) HasScope(expectedScope string) bool {
	result := strings.Split(c.Scope, " ")
	fmt.Print(result)
	for i := range result {
		if result[i] == expectedScope {
			return true
		}
	}

	return false
}

// EnsureValidToken is a middleware that will check the validity of our JWT.
func EnsureValidToken(audience, domain string) func(next http.Handler) http.Handler {
	issuerURL, err := url.Parse("https://" + domain + "/")
	fmt.Print(issuerURL)
	if err != nil {
		log.Fatalf("Failed to parse the issuer url: %v", err)
	}

	provider := jwks.NewCachingProvider(issuerURL, 5*time.Minute)

	jwtValidator, err := validator.New(
		provider.KeyFunc,
		validator.RS256,
		issuerURL.String(),
		[]string{audience},
		validator.WithCustomClaims(
			func() validator.CustomClaims {
				return &CustomClaims{}
			},
		),
		validator.WithAllowedClockSkew(time.Minute),
	)
	if err != nil {
		log.Fatalf("Failed to set up the jwt validator")
	}

	errorHandler := func(w http.ResponseWriter, r *http.Request, err error) {
		log.Printf("Encountered error while validating JWT: %v", err)

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusUnauthorized)
		w.Write([]byte(`{"message":"Failed to validate JWT."}`))
	}

	middleware := jwtmiddleware.New(
		jwtValidator.ValidateToken,
		jwtmiddleware.WithErrorHandler(errorHandler),
	)

	return func(next http.Handler) http.Handler {
		return middleware.CheckJWT(next)
	}
}

func ValidatePermissions(expectedClaims string, next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		token := r.Context().Value(jwtmiddleware.ContextKey{}).(*validator.ValidatedClaims)
		claims := token.CustomClaims.(*CustomClaims)
		if !claims.HasScope(expectedClaims) {
			errorMessage := ErrorMessage{Message: permissionDeniedErrorMessage}
			helpers.WriteJSON(w, http.StatusForbidden, errorMessage)
			return
		}
		next.ServeHTTP(w, r)
	})
}

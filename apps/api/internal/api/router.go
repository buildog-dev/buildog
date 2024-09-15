package api

import (
	"net/http"

	"api/internal/api/handlers"
	"api/internal/middleware"
)

func Routes(h *handlers.Handlers) http.Handler {
	router := http.NewServeMux()

	// tenant routes
	router.Handle("/api/tenants", middleware.Chain(
		middleware.CorsMiddleware,
		middleware.EnsureValidToken,
	)(http.HandlerFunc(h.TenantsHandler)))

	router.Handle("/api/tenant", middleware.Chain(
		middleware.CorsMiddleware,
		middleware.EnsureValidToken,
		middleware.EnsureUserAuthorized,
	)(http.HandlerFunc(h.TenantHandler)))

	router.Handle("/api/tenant/user", middleware.Chain(
		middleware.CorsMiddleware,
		middleware.EnsureValidToken,
		middleware.EnsureUserAuthorized,
	)(http.HandlerFunc(h.TenantUserHandler)))

	return router
}

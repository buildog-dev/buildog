package api

import (
	"net/http"

	"api/internal/api/handlers"
	"api/internal/middleware"
)

func Routes() http.Handler {
	router := http.NewServeMux()

	// tenant routes
	router.Handle("/api/tenants", middleware.Chain(
		middleware.CorsMiddleware,
		middleware.EnsureValidToken,
	)(http.HandlerFunc(handlers.TenantsHandler)))

	router.Handle("/api/tenant", middleware.Chain(
		middleware.CorsMiddleware,
		middleware.EnsureValidToken,
		middleware.EnsureUserAuthorized,
	)(http.HandlerFunc(handlers.TenantHandler)))

	router.Handle("/api/tenant/user", middleware.Chain(
		middleware.CorsMiddleware,
		middleware.EnsureValidToken,
		middleware.EnsureUserAuthorized,
	)(http.HandlerFunc(handlers.TenantUserHandler)))

	// test routes
	router.HandleFunc("/test/api/public", handlers.PublicApiHandler)

	router.Handle("/test/api/private", middleware.Chain(
		middleware.CorsMiddleware,
		middleware.EnsureValidToken,
	)(http.HandlerFunc(handlers.AdminApiHandler)))

	router.Handle("/test/api/admin", middleware.Chain(
		middleware.EnsureValidToken,
	)(http.HandlerFunc(handlers.ProtectedApiHandler)))

	return router
}

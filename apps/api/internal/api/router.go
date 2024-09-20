package api

import (
	"net/http"

	"api/internal/api/handlers"
	"api/internal/middleware"
)

func Routes(h *handlers.Handlers) http.Handler {
	router := http.NewServeMux()

	// users
	router.Handle("/users", middleware.Chain(
		h.UsersHandler,
		middleware.CorsMiddleware,
		middleware.EnsureValidToken,
	))

	return router
}

// // tenant routes
// router.Handle("/tenants", middleware.Chain(
// 	middleware.CorsMiddleware,
// 	middleware.EnsureValidToken,
// )(http.HandlerFunc(h.TenantsHandler)))

// router.Handle("/tenant", middleware.Chain(
// 	middleware.CorsMiddleware,
// 	middleware.EnsureValidToken,
// 	middleware.EnsureUserAuthorized,
// )(http.HandlerFunc(h.TenantHandler)))

// router.Handle("/tenant/user", middleware.Chain(
// 	middleware.CorsMiddleware,
// 	middleware.EnsureValidToken,
// 	middleware.EnsureUserAuthorized,
// )(http.HandlerFunc(h.TenantUserHandler)))

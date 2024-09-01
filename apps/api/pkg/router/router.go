package router

import (
	"api/pkg/handlers"
	"api/pkg/middleware"
	"net/http"
)

func Router(audience, domain string) http.Handler {
	router := http.NewServeMux()

	// tenant
	router.Handle("/api/tenants",
		middleware.CorsMiddleware(
			middleware.EnsureValidToken(
				http.HandlerFunc(handlers.TenantsHandler),
			),
		),
	)
	router.Handle("/api/tenant",
		middleware.CorsMiddleware(
			middleware.EnsureValidToken(
				middleware.EnsureUserAuthorized(
					http.HandlerFunc(handlers.TenantHandler),
				),
			),
		),
	)

	router.Handle("/api/tenant/user",
		middleware.CorsMiddleware(
			middleware.EnsureValidToken(
				middleware.EnsureUserAuthorized(
					http.HandlerFunc(handlers.TenantUserHandler),
				),
			),
		),
	)

	// test
	router.HandleFunc("/test/api/public", handlers.PublicApiHandler)
	router.Handle("/test/api/private",
		middleware.CorsMiddleware(
			middleware.EnsureValidToken(
				http.HandlerFunc(handlers.AdminApiHandler),
			),
		),
	)
	router.Handle("/test/api/admin",
		middleware.EnsureValidToken(
			http.HandlerFunc(handlers.ProtectedApiHandler),
		),
	)

	return router
}

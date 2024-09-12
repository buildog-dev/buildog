package router

import (
	"api/pkg/handlers"
	"api/pkg/middleware"
	"net/http"
)

type CustomMux struct {
	*http.ServeMux
}

func (mux *CustomMux) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	_, pattern := mux.ServeMux.Handler(r)
	if pattern == "" {
		http.NotFound(w, r)
		return
	}
	mux.ServeMux.ServeHTTP(w, r)
}

func Router(audience, domain string) http.Handler {
	router := &CustomMux{http.NewServeMux()}

	// tenant
<<<<<<< HEAD

	router.HandleFunc("/api/tenants", handlers.TenantsHandler)
	router.HandleFunc("/api/tenant", handlers.TenantHandler)
=======
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
>>>>>>> 1f2865f985ded7663a8565aeabfdf45052183ca0

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

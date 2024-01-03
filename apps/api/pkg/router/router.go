package router

import (
	"api/pkg/handlers"
	"api/pkg/middleware"
	"net/http"
)

func corsMiddlewareFunc(h http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// Set CORS headers
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With")

		// Check if it's a preflight request
		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusOK)
			return
		}

		// Call the original handler
		h(w, r)
	}
}

// corsMiddleware sets the necessary headers for CORS compliance.
func corsMiddleware(handler http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Set CORS headers
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With")

		// Check if it's a preflight request
		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusOK)
			return
		}

		// Call the wrapped handler
		handler.ServeHTTP(w, r)
	})
}

func Router(audience, domain string) http.Handler {
	router := http.NewServeMux()

	router.HandleFunc("/auth/login", corsMiddlewareFunc(handlers.LoginHandler))
	router.HandleFunc("/auth/refresh", corsMiddlewareFunc(handlers.RefreshHandler))

	// test
	router.HandleFunc("/test/api/public", handlers.PublicApiHandler)
	router.Handle("/test/api/private",
		corsMiddleware(
			middleware.EnsureValidToken(audience, domain)(
				http.HandlerFunc(handlers.AdminApiHandler),
			),
		),
	)
	router.Handle("/test/api/admin",
		middleware.EnsureValidToken(audience, domain)(
			middleware.ValidatePermissions("read:admin-messages",
				http.HandlerFunc(handlers.ProtectedApiHandler)),
		),
	)

	return router
}

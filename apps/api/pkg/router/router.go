package router

import (
	"api/pkg/handlers"
	"api/pkg/middleware"
	"net/http"
)

func Router(audience, domain string) http.Handler {
	router := http.NewServeMux()

	router.HandleFunc("/auth/login", handlers.LoginHandler)

	// test
	router.HandleFunc("/test/api/public", handlers.PublicApiHandler)
	router.Handle("/test/api/private",
		middleware.EnsureValidToken(audience, domain)(
			http.HandlerFunc(handlers.AdminApiHandler),
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

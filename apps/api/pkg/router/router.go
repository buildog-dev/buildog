package router

import (
	"api/pkg/handlers"
	"api/pkg/middleware"
	"net/http"
)

func Router(audience, domain string) http.Handler {

	router := http.NewServeMux()

	router.HandleFunc("/api/public", handlers.PublicApiHandler)

	router.Handle("/api/private", middleware.EnsureValidToken(audience, domain)(
		http.HandlerFunc(handlers.AdminApiHandler),
	))
	
	router.Handle("/api/messages/admin", middleware.EnsureValidToken(audience, domain)(
		middleware.ValidatePermissions([]string{"read:admin-messages"},
			http.HandlerFunc(handlers.ProtectedApiHandler))))

	return router
}
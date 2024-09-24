package api

// func Routes(h *handlers.Handlers) http.Handler {
// 	router := http.NewServeMux()

// 	router.Handle("/users", middleware.Chain(
// 		middleware.CorsMiddleware,
// 		middleware.EnsureValidToken,
// 	)(http.HandlerFunc(h.UsersHandler)))

// 	router.Handle("/orgs", middleware.Chain(
// 		middleware.CorsMiddleware,
// 		middleware.EnsureValidToken,
// 	)(http.HandlerFunc(h.OrganizationsHandler)))

// 	// users
// 	// router.Handle("/users", middleware.Chain(
// 	// 	h.UsersHandler,
// 	// 	middleware.CorsMiddleware,
// 	// 	middleware.EnsureValidToken,
// 	// ))

// 	// tenant

// 	return router
// }

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

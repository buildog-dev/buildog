package api

import (
	"api/internal/auth"
	"api/internal/middleware"
	"api/internal/repository"
	"api/pkg/database"
	"fmt"
	"net/http"

	"github.com/gorilla/mux"
)

type api struct {
	db *database.DB

	organizationsRepo     *repository.OrganizationRepository
	organizationUsersRepo *repository.OrganizationUserRepository
	userRepo              *repository.UserRepository
	documentRepo          *repository.DocumentRepository
	authService           auth.AuthorizationService
}

func NewApi(db *database.DB) (*api, error) {
	organizationRepo := repository.NewOrganizationRepository(db)
	organizationUserRepo := repository.NewOrganizationUserRepository(db)
	userRepo := repository.NewUserRepository(db)
	authService := auth.NewAuthService(organizationUserRepo)
	documentRepo := repository.NewDocumentRepository(db)

	return &api{
		db: db,

		organizationsRepo:     organizationRepo,
		organizationUsersRepo: organizationUserRepo,
		userRepo:              userRepo,
		documentRepo:          documentRepo,
		authService:           authService,
	}, nil

}

func (a *api) Server(port int) *http.Server {
	return &http.Server{
		Addr:    fmt.Sprintf(":%d", port),
		Handler: a.Routes(),
	}
}

func (a *api) Routes() http.Handler {
	router := mux.NewRouter()

	healthRouter := router.PathPrefix("/health").Subrouter()
	healthRouter.HandleFunc("", a.healthCheckHandler).Methods(http.MethodGet, http.MethodOptions)

	router.Use(middleware.CorsMiddleware)

	protectedRouter := router.PathPrefix("").Subrouter()
	protectedRouter.Use(middleware.EnsureValidToken)

	a.healthRoutes(protectedRouter)
	a.userRoutes(protectedRouter)
	a.organizationRoutes(protectedRouter)
	a.organizationUserRoutes(protectedRouter)
	a.documentRoutes(protectedRouter)

	return router
}

func (a *api) organizationUserRoutes(protectedRouter *mux.Router) {
	protectedRouter.HandleFunc("/organization-user",
		auth.RequirePermission(a.authService, auth.PermissionReadUser)(a.listOrganizationUsers),
	).Methods(http.MethodGet, http.MethodOptions)

	protectedRouter.HandleFunc("/organization-user",
		auth.RequirePermission(a.authService, auth.PermissionCreateUser)(a.addUserToOrganization),
	).Methods(http.MethodPost, http.MethodOptions)

	protectedRouter.HandleFunc("/organization-user",
		auth.RequirePermission(a.authService, auth.PermissionUpdateUser)(a.updateUserRoleInOrganization),
	).Methods(http.MethodPut, http.MethodOptions)

	protectedRouter.HandleFunc("/organization-user",
		auth.RequirePermission(a.authService, auth.PermissionDeleteUser)(a.deleteUserFromOrganization),
	).Methods(http.MethodDelete, http.MethodOptions)

	protectedRouter.HandleFunc("/organization-user/{user_id}",
		auth.RequirePermission(a.authService, auth.PermissionReadUser)(a.getOrganizationUserInfo),
	).Methods(http.MethodGet, http.MethodOptions)
}

func (a *api) organizationRoutes(protectedRouter *mux.Router) {
	protectedRouter.HandleFunc("/organizations", a.getOrganizationsHandler).Methods(http.MethodGet, http.MethodOptions)
	protectedRouter.HandleFunc("/organizations", a.createOrganizationHandler).Methods(http.MethodPost, http.MethodOptions)

	protectedRouter.HandleFunc("/organizations",
		auth.RequirePermission(a.authService, auth.PermissionUpdateOrganization)(a.updateOrganizationHandler),
	).Methods(http.MethodPut, http.MethodOptions)

	protectedRouter.HandleFunc("/organizations",
		auth.RequirePermission(a.authService, auth.PermissionDeleteOrganization)(a.deleteOrganizationHandler),
	).Methods(http.MethodDelete, http.MethodOptions)

	protectedRouter.HandleFunc("/organization",
		auth.RequirePermission(a.authService, auth.PermissionReadOrganization)(a.getOrganizationHandler),
	).Methods(http.MethodGet, http.MethodOptions)
}

func (a *api) userRoutes(protectedRouter *mux.Router) {
	protectedRouter.HandleFunc("/user", a.createUserHandler).Methods(http.MethodPost, http.MethodOptions)
	protectedRouter.HandleFunc("/user", a.updateUserHandler).Methods(http.MethodPut, http.MethodOptions)
	protectedRouter.HandleFunc("/user", a.getUserHandler).Methods(http.MethodGet, http.MethodOptions)
}

func (a *api) documentRoutes(protectedRouter *mux.Router) {
	protectedRouter.HandleFunc("/documents",
		auth.RequirePermission(a.authService, auth.PermissionCreateDocument)(a.createDocumentHandler),
	).Methods(http.MethodPost, http.MethodOptions)

	protectedRouter.HandleFunc("/documents",
		auth.RequirePermission(a.authService, auth.PermissionReadDocument)(a.getDocumentsHandler),
	).Methods(http.MethodGet, http.MethodOptions)

	protectedRouter.HandleFunc("/documents",
		auth.RequirePermission(a.authService, auth.PermissionUpdateDocument)(a.updateDocumentHandler),
	).Methods(http.MethodPut, http.MethodOptions)

	protectedRouter.HandleFunc("/documents/{document_id}",
		auth.RequirePermission(a.authService, auth.PermissionDeleteDocument)(a.deleteDocumentHandler),
	).Methods(http.MethodDelete, http.MethodOptions)

	protectedRouter.HandleFunc("/documents/{document_id}",
		auth.RequirePermission(a.authService, auth.PermissionReadDocument)(a.getDocumentHandler),
	).Methods(http.MethodGet, http.MethodOptions)
}

func (a *api) healthRoutes(router *mux.Router) {
	healthRouter := router.PathPrefix("/health").Subrouter()
	healthRouter.HandleFunc("", a.healthCheckHandler).Methods(http.MethodGet, http.MethodOptions)
}

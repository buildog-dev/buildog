package api

import (
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
}

func NewApi(db *database.DB) (*api, error) {
	organizationRepo := repository.NewOrganizationRepository(db)
	organizationUserRepo := repository.NewOrganizationUserRepository(db)
	userRepo := repository.NewUserRepository(db)

	return &api{
		db: db,

		organizationsRepo:     organizationRepo,
		organizationUsersRepo: organizationUserRepo,
		userRepo:              userRepo,
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

	protectedRouter.HandleFunc("/user", a.createUserHandler).Methods(http.MethodPost, http.MethodOptions)
	protectedRouter.HandleFunc("/user", a.updateUserHandler).Methods(http.MethodPut, http.MethodOptions)

	protectedRouter.HandleFunc("/organizations", a.getOrganizationsHandler).Methods(http.MethodGet, http.MethodOptions)
	protectedRouter.HandleFunc("/organizations", a.createOrganizationHandler).Methods(http.MethodPost, http.MethodOptions)

	protectedRouter.HandleFunc("/organization", a.getOrganizationHandler).Methods(http.MethodGet, http.MethodOptions)
	protectedRouter.HandleFunc("/user", a.getUserHandler).Methods(http.MethodGet, http.MethodOptions)

	protectedRouter.HandleFunc("/organization-user", a.addUserToOrganization).Methods(http.MethodPost, http.MethodOptions)

	a.registerOrganizationUserRoutes(protectedRouter)

	return router
}

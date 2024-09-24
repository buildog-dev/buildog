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

	// Apply middlewares
	router.Use(middleware.CorsMiddleware)
	router.Use(middleware.EnsureValidToken)

	router.HandleFunc("/health", a.healthCheckHandler).Methods(http.MethodGet, http.MethodOptions)

	router.HandleFunc("/users/create", a.createUserHandler).Methods(http.MethodGet, http.MethodOptions)

	router.HandleFunc("/orgs", a.getOrganizationsHandler).Methods(http.MethodGet, http.MethodOptions)
	router.HandleFunc("/orgs", a.createOrganizationHandler).Methods(http.MethodPost, http.MethodOptions)

	return router
}

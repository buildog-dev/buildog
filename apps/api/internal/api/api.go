package api

import (
	"api/internal/auth"
	"api/internal/middleware"
	"api/internal/repository"
	"api/pkg/database"
	"api/pkg/utils"
	"context"
	"fmt"
	"io"
	"net/http"

	"cloud.google.com/go/storage"
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

	// protectedRouter.HandleFunc("/documents",
	// 	auth.RequirePermission(a.authService, auth.PermissionDeleteDocument)(a.deleteDocumentHandler),
	// ).Methods(http.MethodDelete, http.MethodOptions)

	protectedRouter.HandleFunc("/documents/{document_id}",
		auth.RequirePermission(a.authService, auth.PermissionReadDocument)(a.getDocumentHandler),
	).Methods(http.MethodGet, http.MethodOptions)

	protectedRouter.HandleFunc("/upload-md", uploadMarkdownHandler).Methods(http.MethodPost, http.MethodOptions)
}

func (a *api) healthRoutes(router *mux.Router) {
	healthRouter := router.PathPrefix("/health").Subrouter()
	healthRouter.HandleFunc("", a.healthCheckHandler).Methods(http.MethodGet, http.MethodOptions)
}

const bucketName = "buildog"

func uploadMarkdownHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// Parse the multipart form
	if err := r.ParseMultipartForm(10 << 20); err != nil { // Limit upload size to 10MB
		http.Error(w, "Error parsing form data", http.StatusBadRequest)
		return
	}

	// Retrieve the uploaded file
	file, header, err := r.FormFile("file")
	if err != nil {
		http.Error(w, "Error retrieving file", http.StatusBadRequest)
		return
	}
	defer file.Close()

	// Check file type
	if header.Header.Get("Content-Type") != "text/markdown" && header.Filename[len(header.Filename)-3:] != ".md" {
		http.Error(w, "Only .md files are allowed", http.StatusBadRequest)
		return
	}

	organizationID := r.Header.Get("organization_id")
	if organizationID == "" {
		utils.JSONError(w, http.StatusBadRequest, "Organization ID is required")
		return
	}

	// Upload file to Google Cloud Storage
	ctx := context.Background()
	if err := uploadFileToBucket(ctx, file, header.Filename, organizationID); err != nil {
		http.Error(w, fmt.Sprintf("Error uploading file: %v", err), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	w.Write([]byte("File uploaded successfully"))
}

// func uploadFileToBucket(ctx context.Context, file io.Reader, filename string) error {
// 	// Create a storage client
// 	client, err := storage.NewClient(ctx)
// 	if err != nil {
// 		return fmt.Errorf("failed to create storage client: %v", err)
// 	}
// 	defer client.Close()

// 	// Create a bucket handle
// 	bucket := client.Bucket(bucketName)

// 	// Create a writer for the object
// 	object := bucket.Object(filename)
// 	writer := object.NewWriter(ctx)
// 	defer writer.Close()

// 	// Copy the file contents to the bucket
// 	if _, err := io.Copy(writer, file); err != nil {
// 		return fmt.Errorf("failed to upload file to bucket: %v", err)
// 	}

// 	fmt.Printf("File %s uploaded to bucket %s\n", filename, bucketName)
// 	return nil
// }

func uploadFileToBucket(ctx context.Context, file io.Reader, filename string, folderName string) error {
	// Create a storage client
	client, err := storage.NewClient(ctx)
	if err != nil {
		return fmt.Errorf("failed to create storage client: %v", err)
	}
	defer client.Close()

	// Create a bucket handle
	bucket := client.Bucket(bucketName)

	// Generate the object path (include folder structure if provided)
	objectPath := filename
	if folderName != "" {
		objectPath = fmt.Sprintf("%s/%s", folderName, filename)
	}

	// Create a writer for the object
	object := bucket.Object(objectPath)
	writer := object.NewWriter(ctx)
	defer func() {
		if closeErr := writer.Close(); closeErr != nil {
			fmt.Printf("Warning: failed to close writer: %v\n", closeErr)
		}
	}()

	// Copy the file contents to the bucket
	if _, err := io.Copy(writer, file); err != nil {
		return fmt.Errorf("failed to upload file to bucket: %v", err)
	}

	fmt.Printf("File %s uploaded to bucket %s in folder %s\n", filename, bucketName, folderName)
	return nil
}

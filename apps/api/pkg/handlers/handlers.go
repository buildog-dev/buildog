package handlers

import (
	"api/pkg/helpers"
	"api/pkg/messages"
	"api/pkg/models"
	"database/sql"
	"encoding/json"

	//"encoding/json"
	"log"
	"net/http"
	"time"
)

const (
	notFoundErrorMessage       = "Not Found"
	internalServerErrorMessage = "Internal Server Error"
)

type ErrorMessage struct {
	Message string `json:"message"`
}

func sendMessage(rw http.ResponseWriter, r *http.Request, data models.ApiResponse) {
	if r.Method == http.MethodGet {
		err := helpers.WriteJSON(rw, http.StatusOK, data)
		if err != nil {
			ServerError(rw, err)
		}
	} else {
		NotFoundHandler(rw, r)
	}
}

func PublicApiHandler(rw http.ResponseWriter, r *http.Request) {
	sendMessage(rw, r, messages.PublicMessage())
}

func ProtectedApiHandler(rw http.ResponseWriter, r *http.Request) {
	sendMessage(rw, r, messages.ProtectedMessage())
}

func AdminApiHandler(rw http.ResponseWriter, r *http.Request) {
	sendMessage(rw, r, messages.AdminMessage())
}

func NotFoundHandler(rw http.ResponseWriter, req *http.Request) {
	errorMessage := ErrorMessage{Message: notFoundErrorMessage}
	err := helpers.WriteJSON(rw, http.StatusNotFound, errorMessage)
	if err != nil {
		ServerError(rw, err)
	}
}

func ServerError(rw http.ResponseWriter, err error) {
	errorMessage := ErrorMessage{Message: internalServerErrorMessage}
	helpers.WriteJSON(rw, http.StatusInternalServerError, errorMessage)
	log.Print("Internal error server: ", err.Error())
}

func createTenant(db *sql.DB, tenant *models.Tenant) (int64, error) {
	// SQL query to insert a new tenant
	query := `
		INSERT INTO tenants (name, created_at, updated_at)
		VALUES ($1, $2, $3)
		RETURNING id
	`

	// Get current time
	now := time.Now()

	// Execute the query and get the ID of the new tenant
	var tenantID int64
	err := db.QueryRow(query, tenant.Name, now, now).Scan(&tenantID)
	if err != nil {
		return 0, err
	}

	return tenantID, nil
}

func CreateTenantHandler(w http.ResponseWriter, r *http.Request) {
	log.Println("Received request for:", r.URL.Path)

	if r.Method != http.MethodPost {
		http.Error(w, "Invalid request method", http.StatusMethodNotAllowed)
		return
	}

	var tenant models.Tenant
	if err := json.NewDecoder(r.Body).Decode(&tenant); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	connStr := "user=buildog dbname=buildog sslmode=disable password=9$£s10ME&s2w"
	db, err := sql.Open("postgres", connStr)
	if err != nil {
		http.Error(w, "Database connection error", http.StatusInternalServerError)
		return
	}

	tenantID, err := createTenant(db, &tenant)
	if err != nil {
		http.Error(w, "Failed to create tenant", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	response := map[string]interface{}{
		"id": tenantID,
	}
	json.NewEncoder(w).Encode(response)

	w.WriteHeader(http.StatusOK)
	w.Write([]byte("Tenant created"))
}

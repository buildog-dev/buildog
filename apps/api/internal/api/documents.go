package api

import (
	"api/internal/models"
	"api/pkg/utils"
	"encoding/json"
	"log"
	"net/http"
	"time"
)

func (a *api) createDocumentHandler(w http.ResponseWriter, r *http.Request) {
	organizationId := r.Header.Get("organization_id")
	claims, ok := utils.GetTokenClaims(r)
	if !ok {
		utils.JSONError(w, http.StatusUnauthorized, "Token claims missing")
		return
	}

	userID, ok := utils.GetUserIDFromClaims(claims)
	if !ok {
		utils.JSONError(w, http.StatusBadRequest, "Invalid user ID")
		return
	}

	var payload models.DocumentCreateRequest
	if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	document := &models.Document{
		OrganizationId: organizationId,
		Title:          payload.Title,
		Preview:        payload.Preview,
		Status:         payload.Status,
		Tags:           payload.Tags,
		CreatedBy:      userID,
		UpdatedBy:      userID,
		CreatedAt:      time.Now(),
		UpdatedAt:      time.Now(),
	}

	createdDocument, err := a.documentRepo.CreateDocument(document)
	if err != nil {
		log.Println("Failed to create document", err)
		utils.JSONError(w, http.StatusInternalServerError, "Failed to create document")
		return
	}

	utils.JSONResponse(w, http.StatusCreated, createdDocument)
}

func (a *api) getDocumentsHandler(w http.ResponseWriter, r *http.Request) {
	organizationId := r.Header.Get("organization_id")
	documents, err := a.documentRepo.GetDocuments(organizationId)
	if err != nil {
		log.Println("Failed to get documents", err)
		utils.JSONError(w, http.StatusInternalServerError, "Failed to get documents")
		return
	}

	utils.JSONResponse(w, http.StatusOK, documents)
}

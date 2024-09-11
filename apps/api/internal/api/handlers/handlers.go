package handlers

import (
	"api/internal/messages"
	"api/internal/models"
	"api/pkg/helpers"
	"log"
	"net/http"
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

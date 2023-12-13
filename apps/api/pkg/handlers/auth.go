package handlers

import (
	"bytes"
	"encoding/json"
	"io"
	"net/http"
	"os"
)

func LoginHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")

	// Read the request body
	body, err := io.ReadAll(r.Body)
	if err != nil {
		http.Error(w, "Error reading request body", http.StatusInternalServerError)
		return
	}
	defer r.Body.Close()

	// Parse the request body as JSON
	var requestData map[string]interface{}
	if err := json.Unmarshal(body, &requestData); err != nil {
		http.Error(w, "Error parsing request data", http.StatusBadRequest)
		return
	}

	// Extract email and password from the request data
	email, emailExists := requestData["email"].(string)
	password, passwordExists := requestData["password"].(string)

	// Check if the required fields (email and password) exist in the request
	if !emailExists || !passwordExists {
		http.Error(w, "Invalid request format", http.StatusBadRequest)
		return
	}

	// Construct the authentication request to an external service (Auth0)
	url := "https://" + os.Getenv("AUTH0_DOMAIN") + "/oauth/token"
	data := map[string]string{
		"grant_type":    "password",
		"username":      email,
		"password":      password,
		"audience":      "https://buildog-api.com",
		"client_id":     os.Getenv("AUTH0_CLIENT_ID"),
		"client_secret": os.Getenv("AUTH0_CLIENT_SECRET"),
	}

	// Prepare form data for the POST request
	formData := new(bytes.Buffer)
	for key, value := range data {
		formData.WriteString(key)
		formData.WriteString("=")
		formData.WriteString(value)
		formData.WriteString("&")
	}
	formDataBytes := formData.Bytes()

	// Create a POST request to the authentication service
	req, err := http.NewRequest("POST", url, bytes.NewBuffer(formDataBytes))
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	req.Header.Add("Content-Type", "application/x-www-form-urlencoded")

	// Send the request using an HTTP client
	client := &http.Client{}
	resp, err := client.Do(req)
	if resp.StatusCode != http.StatusOK {
		w.WriteHeader(http.StatusBadRequest)
	}

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer resp.Body.Close()

	// Read the authentication service's response body
	bodyBytes, err := io.ReadAll(resp.Body)
	if err != nil {
		http.Error(w, err.Error(), http.StatusUnauthorized)
	}

	// Write the authentication service's response to the client
	_, err = w.Write(bodyBytes)
	if err != nil {
		ServerError(w, err)
	}
}

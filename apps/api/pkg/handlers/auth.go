package handlers

import (
	"bytes"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"
	"os"
	"strings"
)

func LoginHandler(w http.ResponseWriter, r *http.Request) {
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
		"audience":      os.Getenv("AUTH0_AUDIENCE"),
		"client_id":     os.Getenv("AUTH0_CLIENT_ID"),
		"client_secret": os.Getenv("AUTH0_CLIENT_SECRET"),
		"scope":         "offline_access",
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

	err = CheckEMailVerification(w, r, email)

	if err != nil {
		http.Error(w, err.Error(), http.StatusUnauthorized)
		return
	}

	// Write the authentication service's response to the client
	_, err = w.Write(bodyBytes)
	if err != nil {
		ServerError(w, err)
	}

}

func RefreshHandler(w http.ResponseWriter, r *http.Request) {
	reqToken := r.Header.Get("Authorization")
	splitToken := strings.Split(reqToken, "Bearer ")
	// reqToken = splitToken[1]

	fmt.Println(splitToken, reqToken)

	// Handle preflight request for CORS
	if r.Method == "OPTIONS" {
		w.WriteHeader(http.StatusOK)
		return
	}

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
	refreshToken, refreshTokenExists := requestData["refresh_token"].(string)

	// Check if the required fields (email and password) exist in the request
	if !refreshTokenExists {
		http.Error(w, "Invalid request format", http.StatusBadRequest)
		return
	}

	// Construct the authentication request to an external service (Auth0)
	url := "https://" + os.Getenv("AUTH0_DOMAIN") + "/oauth/token"
	data := map[string]string{
		"grant_type":    "refresh_token",
		"refresh_token": refreshToken,
		"client_id":     os.Getenv("AUTH0_CLIENT_ID"),
		"client_secret": os.Getenv("AUTH0_CLIENT_SECRET"),
		"audience":      os.Getenv("AUTH0_AUDIENCE"),
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
	req.Header.Add("authorization", "Basic "+reqToken)

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

func CheckEMailVerification(w http.ResponseWriter, r *http.Request, email string) error {
	//get access token
	accessToken, err := getAuthToken()

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return errors.New("error getting access token")
	}

	url := "https://dev-be20pqtlw43vme5i.us.auth0.com/api/v2/users-by-email?email=" + email

	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return errors.New("error creating request")
	}

	req.Header.Add("authorization", "Bearer "+accessToken)

	// Send the request using an HTTP client
	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return errors.New("error sending request")
	}

	if resp.StatusCode != http.StatusOK {
		w.WriteHeader(http.StatusBadRequest)
	}

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		http.Error(w, err.Error(), http.StatusUnauthorized)
	}
	bodyString := string(body)
	bodyString = bodyString[1 : len(bodyString)-1]

	var user map[string]interface{}
	json.Unmarshal([]byte(bodyString), &user)
	isVerified := user["email_verified"].(bool)

	if !isVerified {
		http.Error(w, "Email not verified", http.StatusUnauthorized)
		return errors.New("email not verified")
	}
	return nil
}

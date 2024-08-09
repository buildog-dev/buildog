package handlers

import (
	"api/pkg/database"
	"bytes"
	"database/sql"
	"encoding/json"
	"fmt"
	"io"
	"io/ioutil"
	"net/http"
	"os"
)

func SignUpHandler(w http.ResponseWriter, r *http.Request) {
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

	// Extract email, password, firstName, and lastName from the request data
	email, emailExists := requestData["email"].(string)
	password, passwordExists := requestData["password"].(string)
	firstName, firstNameExists := requestData["firstName"].(string)
	lastName, lastNameExists := requestData["lastName"].(string)

	// Check if the required fields exist
	if !emailExists || !passwordExists || !firstNameExists || !lastNameExists {
		http.Error(w, "Invalid request format", http.StatusBadRequest)
		return
	}

	// Construct the JSON payload for Auth0 API
	// usermetadata and appmetadata {} şeklinde olmalı requestte
	data := map[string]interface{}{
		"email":          email,
		"user_metadata":  map[string]interface{}{},
		"blocked":        false,
		"email_verified": false,
		"app_metadata":   map[string]interface{}{},
		"given_name":     firstName,
		"family_name":    lastName,
		"name":           firstName + " " + lastName,
		"connection":     "Username-Password-Authentication",
		"password":       password,
		"verify_email":   false,
	}

	formDataBytes, err := json.Marshal(data)
	if err != nil {
		http.Error(w, "Error marshalling JSON", http.StatusInternalServerError)
		return
	}

	// Get AUTH0 Token

	token, err := GenerateAuth0Token()

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		http.Error(w, "Error getting token", http.StatusInternalServerError)
		return
	}

	// Create a POST request to the authentication service
	req, err := http.NewRequest("POST", "https://"+os.Getenv("AUTH0_DOMAIN")+"/api/v2/users", bytes.NewBuffer(formDataBytes))
	if err != nil {
		http.Error(w, "Error creating request", http.StatusInternalServerError)
		return
	}

	req.Header.Add("Content-Type", "application/json")
	req.Header.Add("Accept", "application/json")
	req.Header.Add("authorization", "Bearer "+token)

	// Send the request using an HTTP client
	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		http.Error(w, "Error sending request", http.StatusInternalServerError)
		return
	}
	defer resp.Body.Close()

	// Check the response status code
	if resp.StatusCode != http.StatusCreated {
		bodyBytes, _ := io.ReadAll(resp.Body)
		http.Error(w, string(bodyBytes), resp.StatusCode)
		return
	}

	// Write the successful response to the client
	bodyBytes, err := io.ReadAll(resp.Body)
	if err != nil {
		http.Error(w, "Error reading response", http.StatusInternalServerError)
		return
	}

	// Parse the response body
	var result map[string]interface{}
	if err := json.Unmarshal(bodyBytes, &result); err != nil {
		http.Error(w, "Error parsing response data", http.StatusInternalServerError)
		return
	}
	userId, ok := result["user_id"].(string)
	if !ok {
		http.Error(w, "Error retrieving user_id", http.StatusInternalServerError)
		return
	}
	// Send verification email
	if err := SendVerificationEmail(userId, token); err != nil {
		http.Error(w, "Error sending verification email", http.StatusInternalServerError)
		return
	}

	// Add the user to the database
	if err := AddUserToDatabase(userId, email, firstName, lastName); err != nil {
		http.Error(w, "Error adding user to database", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
	w.Write(bodyBytes)
}

func GenerateAuth0Token() (string, error) {
	url := "https://" + os.Getenv("AUTH0_DOMAIN") + "/oauth/token"

	// Construct the JSON payload for Auth0 API
	data := map[string]string{
		"client_id":     os.Getenv("AUTH0_CLIENT_ID"),
		"client_secret": os.Getenv("AUTH0_CLIENT_SECRET"),
		"audience":      "https://" + os.Getenv("AUTH0_DOMAIN") + "/api/v2/",
		"grant_type":    "client_credentials",
	}

	// Prepare form data for the POST request
	formDataBytes, err := json.Marshal(data)
	if err != nil {
		return "", fmt.Errorf("failed to marshal JSON: %s", err)
	}

	// Create a POST request to the authentication service
	req, _ := http.NewRequest("POST", url, bytes.NewBuffer(formDataBytes))

	req.Header.Add("content-type", "application/json")

	res, _ := http.DefaultClient.Do(req)

	defer res.Body.Close()
	body, _ := ioutil.ReadAll(res.Body)

	// Check the response status code
	if res.StatusCode != http.StatusOK {
		return "", fmt.Errorf("failed to get token: %s", body)
	}

	// Parse the response body
	var result map[string]interface{}
	if err := json.Unmarshal([]byte(body), &result); err != nil {

		return "", fmt.Errorf("failed to unmarshal JSON: %s", err)
	}
	return result["access_token"].(string), nil

}

func AddUserToDatabase(userId string, email string, firstName string, lastName string) error {

	// Add the user to the database
	db := database.GetDB()
	query := ` INSERT INTO users (id, first_name, last_name, email) VALUES ($1, $2, $3, $4)`
	row := db.QueryRow(query, userId, firstName, lastName, email)

	// Check for errors
	var name string
	err := row.Scan(&name)
	if err != sql.ErrNoRows && err != nil {
		fmt.Println("Error adding user to database: ", err)
		return fmt.Errorf("failed to add user to database: %s", err)
	}

	return nil
}

func SendVerificationEmail(userId string, token string) error {
	url := "https://" + os.Getenv("AUTH0_DOMAIN") + "/api/v2/jobs/verification-email"

	// Construct the JSON payload for Auth0 API
	data := map[string]interface{}{
		"user_id":   userId,
		"client_id": os.Getenv("AUTH0_CLIENT_ID"),
		"identity":  map[string]interface{}{"user_id": userId[6:], "provider": "auth0"},
	}

	fmt.Println(data["identity"])

	// Prepare form data for the POST request
	formDataBytes, err := json.Marshal(data)
	if err != nil {
		return fmt.Errorf("failed to marshal JSON: %s", err)
	}

	// Create a POST request to the authentication service
	req, _ := http.NewRequest("POST", url, bytes.NewBuffer(formDataBytes))

	req.Header.Add("content-type", "application/json")
	req.Header.Add("authorization", "Bearer "+token)

	// Send the request using an HTTP client
	res, _ := http.DefaultClient.Do(req)

	defer res.Body.Close()
	body, _ := ioutil.ReadAll(res.Body)

	if res.StatusCode != http.StatusCreated {
		fmt.Println("Error sending verification email: ", string(body))
		return fmt.Errorf("failed to send verification email: %s", body)
	}
	return nil
}

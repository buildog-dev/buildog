package handlers

import (
	"api/pkg/database"
	"bytes"
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
	firstName, firstNameExists := requestData["first_name"].(string)
	lastName, lastNameExists := requestData["last_name"].(string)

	// Check if the required fields exist
	if !emailExists || !passwordExists || !firstNameExists || !lastNameExists {
		http.Error(w, "Invalid request format", http.StatusBadRequest)
		return
	}

	// Construct the JSON payload for Auth0 API
	data := map[string]string{
		"email":          email,
		"user_metadata":  "{}",
		"blocked":        "false",
		"email_verified": "false",
		"app_metadata":   "{}",
		"given_name":     firstName,
		"family_name":    lastName,
		"name":           firstName + " " + lastName,
		"connection":     "Username-Password-Authentication",
		"password":       password,
		"verify_email":   "false",
	}

	formData := new(bytes.Buffer)
	formData.WriteString("{")
	for key, value := range data {
		formData.WriteString("\"")
		formData.WriteString(key)
		if value == "false" || value == "true" || value == "{}" {
			formData.WriteString("\":")
			formData.WriteString(value)
			formData.WriteString(",")
			continue

		}
		formData.WriteString("\":\"")
		formData.WriteString(string(value))
		formData.WriteString("\",")
	}
	formData.Truncate(formData.Len() - 1)
	formData.WriteString("}")
	formDataBytes := formData.Bytes()

	// Get AUTH0 Token

	token, err := getAuthToken()

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
	json.Unmarshal([]byte(bodyBytes), &result)
	userId := result["user_id"].(string)

	// Send verification email
	SendVerificationEmail(userId, token)

	// Add the user to the database
	AddToDatabase(userId, email, firstName, lastName)

	w.WriteHeader(http.StatusCreated)
	w.Write(bodyBytes)
}

func getAuthToken() (string, error) {
	url := "https://" + os.Getenv("AUTH0_DOMAIN") + "/oauth/token"

	// Construct the JSON payload for Auth0 API
	data := map[string]string{
		"client_id":     os.Getenv("AUTH0_CLIENT_ID"),
		"client_secret": os.Getenv("AUTH0_CLIENT_SECRET"),
		"audience":      "https://" + os.Getenv("AUTH0_DOMAIN") + "/api/v2/",
		"grant_type":    "client_credentials",
	}

	// Prepare form data for the POST request
	formData := new(bytes.Buffer)
	formData.WriteString("{")
	for key, value := range data {
		formData.WriteString("\"")
		formData.WriteString(key)
		if value == "false" || value == "true" || value == "{}" {
			formData.WriteString("\":")
			formData.WriteString(value)
			formData.WriteString(",")
			continue
		}
		formData.WriteString("\":\"")
		formData.WriteString(string(value))
		formData.WriteString("\",")
	}
	formData.Truncate(formData.Len() - 1)
	formData.WriteString("}")
	formDataBytes := formData.Bytes()

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
	json.Unmarshal([]byte(body), &result)

	return result["access_token"].(string), nil

}

func AddToDatabase(userId string, email string, firstName string, lastName string) {

	// Add the user to the database
	db := database.GetDB()
	query := ` INSERT INTO users (id, first_name, last_name, email) VALUES ($1, $2, $3, $4)`
	row := db.QueryRow(query, userId, firstName, lastName, email)

	// Check for errors
	var name string
	err := row.Scan(&name)
	if err != nil {
		fmt.Println("Error inserting user into database: ", err)
	}

}

func SendVerificationEmail(userId string, token string) {
	url := "https://" + os.Getenv("AUTH0_DOMAIN") + "/api/v2/jobs/verification-email"

	// Construct the JSON payload for Auth0 API
	data := map[string]string{
		"user_id":   userId,
		"client_id": os.Getenv("AUTH0_CLIENT_ID"),
		"identity":  `{"user_id": "` + userId[6:] + `","provider": "auth0"}`,
	}

	fmt.Println(data["identity"])

	// Prepare form data for the POST request
	formData := new(bytes.Buffer)
	formData.WriteString("{")
	for key, value := range data {
		formData.WriteString("\"")
		formData.WriteString(key)
		if value == "false" || value == "true" || value[0] == '{' {
			formData.WriteString("\":")
			formData.WriteString(value)
			formData.WriteString(",")
			continue

		}
		formData.WriteString("\":\"")
		formData.WriteString(string(value))
		formData.WriteString("\",")
	}
	formData.Truncate(formData.Len() - 1)
	formData.WriteString("}")
	formDataBytes := formData.Bytes()

	// Create a POST request to the authentication service
	req, _ := http.NewRequest("POST", url, bytes.NewBuffer(formDataBytes))

	req.Header.Add("content-type", "application/json")
	req.Header.Add("authorization", "Bearer "+token)

	// Send the request using an HTTP client
	res, _ := http.DefaultClient.Do(req)

	defer res.Body.Close()
	body, _ := ioutil.ReadAll(res.Body)

	if res.StatusCode != http.StatusOK {
		fmt.Println("Error sending verification email: ", string(body))
	}
}

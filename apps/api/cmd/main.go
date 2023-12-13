package main

import (
	"api/pkg/router"
	"log"
	"net/http"
	"os"

	"github.com/joho/godotenv"
)

func main() {
	if err := godotenv.Load(); err != nil {
		log.Fatalf("Error loading the .env file: %v", err)
	}

	router := router.Router(os.Getenv("AUTH0_AUDIENCE"), os.Getenv("AUTH0_DOMAIN"))
	log.Print("Server listening on http://localhost:3010 :)")

	if err := http.ListenAndServe("0.0.0.0:3010", router); err != nil {
		log.Fatalf("There was an error with the http server: %v", err)
	}
}

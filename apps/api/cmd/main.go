package main

import (
	"api/pkg/router"
	"api/pkg/database"
	"log"
	"net/http"
	"os"

	_ "github.com/lib/pq"

	"github.com/joho/godotenv"
)

func main() {
	if err := godotenv.Load(); err != nil {
		log.Fatalf("Error loading the .env file: %v", err)
	}

    database.InitDB()
	defer database.GetDB().Close()

	router := router.Router(os.Getenv("AUTH0_AUDIENCE"), os.Getenv("AUTH0_DOMAIN"))
	log.Print("Server listening on http://localhost:3010 :)")

	if err := http.ListenAndServe("0.0.0.0:3010", router); err != nil {
		log.Fatalf("There was an error with the http server: %v", err)
	}
}

//func createTables(db *sql.DB) error {
	//tenantTable := `
	//CREATE TABLE IF NOT EXISTS tenants (
		//id SERIAL PRIMARY KEY,
		//name VARCHAR(255) UNIQUE NOT NULL,
		//created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
		//updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
	//);`

	//_, err := db.Exec(tenantTable)
	//if err != nil {
		//return err
	//}

	//userTable := `
	//CREATE TABLE IF NOT EXISTS users (
		//id SERIAL PRIMARY KEY,
		//tenant_id INT NOT NULL,
		//username VARCHAR(255) UNIQUE NOT NULL,
		//email VARCHAR(255) UNIQUE NOT NULL,
		//password_hash VARCHAR(255) NOT NULL,
		//created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
		//updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
		//FOREIGN KEY (tenant_id) REFERENCES tenants(id)
	//);`

	//_, err = db.Exec(userTable)
	//if err != nil {
		//return err
	//}

	//documentTable := `
	//CREATE TABLE IF NOT EXISTS documents (
		//id SERIAL PRIMARY KEY,
		//tenant_id INT NOT NULL,
		//user_id INT NOT NULL,
		//title VARCHAR(255) NOT NULL,
		//content TEXT NOT NULL,
		//status VARCHAR(10) NOT NULL,
		//publish_date TIMESTAMP NOT NULL,
		//created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
		//updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
		//FOREIGN KEY (tenant_id) REFERENCES tenants(id),
		//FOREIGN KEY (user_id) REFERENCES users(id)
	//);`

	//_, err = db.Exec(documentTable)
	//if err != nil {
		//return err
	//}

	//// Create other tables similarly...

	//return nil
//}


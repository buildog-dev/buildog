package cmd

import (
	"api/internal/api"
	"api/pkg/database"
	"context"
	"fmt"
	"log"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/joho/godotenv"
)

func Execute() error {
	_ = godotenv.Load()

	port := 3010

	db, err := database.New()
	if err != nil {
		return fmt.Errorf("initializing database: %w", err)
	}
	defer db.Close()

	api, _ := api.NewApi(db)
	srv := api.Server(port)

	serverErrors := make(chan error, 1)

	go func() {
		log.Printf("Server listening on http://localhost:%d", port)
		serverErrors <- srv.ListenAndServe()
	}()

	shutdown := make(chan os.Signal, 1)
	signal.Notify(shutdown, os.Interrupt, syscall.SIGTERM)

	select {
	case err := <-serverErrors:
		return fmt.Errorf("error starting server: %w", err)

	case <-shutdown:
		log.Println("Starting shutdown")

		ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
		defer cancel()

		err := srv.Shutdown(ctx)
		if err != nil {
			log.Printf("Error during shutdown: %v", err)
			err = srv.Close()
		}

		if err != nil {
			log.Printf("Error closing server: %v", err)
		}

		log.Println("Server stopped")
	}

	return nil
}

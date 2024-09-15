// File: cmd/server/main.go

package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"api/internal/api"
	"api/internal/api/handlers"
	"api/internal/config"
	"api/internal/repository"
	"api/pkg/database"
	"api/pkg/firebase"
)

type App struct {
	config   *config.Config
	db       *database.DB
	router   http.Handler
	server   *http.Server
	handlers *handlers.Handlers
}

func NewApp() (*App, error) {
	cfg, err := config.Load()
	if err != nil {
		return nil, fmt.Errorf("loading config: %w", err)
	}

	databaseConfig := database.Config{
		Host:     "localhost",
		Port:     5432,
		User:     "buildog",
		Password: cfg.DatabasePassword,
		DBName:   "buildog",
		SSLMode:  "disable",
	}

	db, err := database.New(&databaseConfig)
	if err != nil {
		return nil, fmt.Errorf("initializing database: %w", err)
	}

	if err := firebase.InitFirebase(); err != nil {
		return nil, fmt.Errorf("initializing Firebase: %w", err)
	}

	// Handlers
	tenantRepo := repository.NewTenantRepository(db)
	userRepo := repository.NewUserRepository(db)
	handlers := handlers.NewHandlers(tenantRepo, userRepo)

	router := api.Routes(handlers)
	server := &http.Server{
		Addr:    fmt.Sprintf(":%d", cfg.ServerPort),
		Handler: router,
	}

	return &App{
		config:   cfg,
		db:       db,
		router:   router,
		server:   server,
		handlers: handlers,
	}, nil
}

func (app *App) Run() error {
	// Start server
	go func() {
		log.Printf("Server listening on http://localhost:%d", app.config.ServerPort)
		if err := app.server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("Server error: %v", err)
		}
	}()

	// Wait for interrupt signal to gracefully shutdown the server
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit
	log.Println("Shutting down server...")

	// Graceful shutdown
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	if err := app.server.Shutdown(ctx); err != nil {
		return fmt.Errorf("server shutdown: %w", err)
	}

	if err := app.db.Close(); err != nil {
		return fmt.Errorf("database connection close: %w", err)
	}

	log.Println("Server gracefully stopped")
	return nil
}

func main() {
	app, err := NewApp()
	if err != nil {
		log.Fatalf("Failed to initialize application: %v", err)
	}

	if err := app.Run(); err != nil {
		log.Fatalf("Application error: %v", err)
	}
}

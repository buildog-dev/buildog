// File: /internal/config/config.go

package config

import (
	"fmt"
	"os"
	"strconv"

	"github.com/joho/godotenv"
)

type Config struct {
	ServerPort       int
	DatabasePort     int
	DatabaseURL      string
	DatabasePassword string
}

func Load() (*Config, error) {
	// Load .env file if it exists
	godotenv.Load()

	cfg := &Config{}

	serverPort, err := strconv.Atoi(getEnv("PORT", "3010"))
	if err != nil {
		return nil, fmt.Errorf("invalid PORT: %w", err)
	}
	cfg.ServerPort = serverPort

	// Database
	cfg.DatabasePassword = getEnv("DB_PASSWORD", "")
	if cfg.DatabasePassword == "" {
		return nil, fmt.Errorf("DB_PASSWORD is required")
	}

	return cfg, nil
}

func getEnv(key, fallback string) string {
	if value, exists := os.LookupEnv(key); exists {
		return value
	}
	return fallback
}

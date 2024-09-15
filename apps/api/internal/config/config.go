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
	DatabaseHost     string
	DatabaseUser     string
	DatabaseURL      string
	DatabaseName     string
	DatabasePassword string
	DatabaseSSLMode  string
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
	databasePassword := getEnv("DB_PASSWORD", "")
	if databasePassword == "" {
		return nil, fmt.Errorf("DB_PASSWORD is required")
	}

	databasePort, err := strconv.Atoi(getEnv("DB_PORT", "5432"))
	if err != nil {
		return nil, fmt.Errorf("invalid DB_PORT: %w", err)
	}

	cfg.DatabaseHost = getEnv("DB_HOST", "localhost")
	cfg.DatabasePort = databasePort
	cfg.DatabaseUser = getEnv("DB_USER", "buildog")
	cfg.DatabasePassword = databasePassword
	cfg.DatabaseName = getEnv("DB_NAME", "buildog")
	cfg.DatabaseSSLMode = getEnv("DB_SLL_MODE", "disable")

	return cfg, nil
}

func getEnv(key, fallback string) string {
	if value, exists := os.LookupEnv(key); exists {
		return value
	}
	return fallback
}

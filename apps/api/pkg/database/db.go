// File: pkg/database/database.go

package database

import (
	"database/sql"
	"fmt"
	"time"

	_ "github.com/lib/pq"
)

// DB wraps the sql.DB connection pool and provides additional functionality
type DB struct {
	*sql.DB
}

// Config holds the database configuration
type Config struct {
	Host     string
	Port     int
	User     string
	Password string
	DBName   string
	SSLMode  string
}

// New creates a new database connection
func New(cfg *Config) (*DB, error) {
	connStr := fmt.Sprintf("host=%s port=%d user=%s password=%s dbname=%s sslmode=%s",
		cfg.Host, cfg.Port, cfg.User, cfg.Password, cfg.DBName, cfg.SSLMode)

	sqlDB, err := sql.Open("postgres", connStr)
	if err != nil {
		return nil, fmt.Errorf("failed to open database connection: %w", err)
	}

	// Set connection pool parameters
	sqlDB.SetMaxOpenConns(25)
	sqlDB.SetMaxIdleConns(25)
	sqlDB.SetConnMaxLifetime(5 * time.Minute)

	// Verify the connection
	if err := sqlDB.Ping(); err != nil {
		sqlDB.Close()
		return nil, fmt.Errorf("failed to ping database: %w", err)
	}

	return &DB{sqlDB}, nil
}

// Close closes the database connection
func (db *DB) Close() error {
	return db.DB.Close()
}

// Example of a custom method that could be added to DB
func (db *DB) GetUserByID(id int) (string, error) {
	var name string
	err := db.QueryRow("SELECT name FROM users WHERE id = $1", id).Scan(&name)
	if err != nil {
		return "", fmt.Errorf("failed to get user: %w", err)
	}
	return name, nil
}

// Additional database methods can be added here...

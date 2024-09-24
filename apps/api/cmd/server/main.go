// File: cmd/server/main.go

package main

import (
	"log"

	"api/internal/cmd"
)

func main() {
	err := cmd.Execute()

	if err != nil {
		log.Fatalf("FAIL: %v", err)
	}
}

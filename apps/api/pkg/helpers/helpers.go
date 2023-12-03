package helpers

import (
	"encoding/json"
	"log"
	"net/http"
	"os"
)

func Contains(s []string, e string) bool {
	for _, a := range s {
		if a == e {
			return true
		}
	}
	return false
}

func SafeGetEnv(key string) string {
	if os.Getenv(key) == "" {
		log.Fatalf("The environment variable '%s' doesn't exist or is not set", key)
	}
	return os.Getenv(key)
}

func WriteJSON(rw http.ResponseWriter, status int, data interface{}) error {
	js, err := json.Marshal(data)
	if err != nil {
		return err
	}

	rw.Header().Set("Content-Type", "application/json")
	rw.WriteHeader(status)
	_, err = rw.Write(js)
	if err != nil {
		return err
	}
	return nil
}

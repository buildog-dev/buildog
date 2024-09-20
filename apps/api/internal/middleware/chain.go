package middleware

import "net/http"

func Chain(handler http.HandlerFunc, middlewares ...func(http.Handler) http.Handler) http.Handler {
	wrapped := http.Handler(handler)
	for _, middleware := range middlewares {
		wrapped = middleware(wrapped)
	}
	return wrapped
}

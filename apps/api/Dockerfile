# Build stage
FROM golang:1.21.1-alpine AS builder

# Install git and ca-certificates (needed for go mod download and HTTPS requests)
RUN apk add --no-cache git ca-certificates tzdata

# Create a non-root user for building
RUN adduser -D -g '' appuser

# Set working directory
WORKDIR /app

# Copy go mod files first for better layer caching
COPY go.mod go.sum ./

# Download dependencies
RUN go mod download

# Copy source code
COPY . .

# Build the application
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build \
    -ldflags='-w -s -extldflags "-static"' \
    -o server ./cmd/server/main.go

# Final stage
FROM scratch

# Copy ca-certificates and timezone data from builder
COPY --from=builder /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/
COPY --from=builder /usr/share/zoneinfo /usr/share/zoneinfo

# Copy the user from builder
COPY --from=builder /etc/passwd /etc/passwd

# Copy the binary
COPY --from=builder /app/server /server

# Use the non-root user
USER appuser

# Expose port 3010 (as defined in internal/cmd/root.go)
EXPOSE 3010

# Note: Health check endpoint available at /health
# Docker health checks are omitted since we're using scratch base image
# You can add external health checks via Docker Compose or orchestration tools

# Run the application
ENTRYPOINT ["/server"] 
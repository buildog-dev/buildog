package service

import (
	"context"
	"fmt"
	"io"
	"net/http"

	"cloud.google.com/go/storage"
)

const bucketName = "buildog"

func UploadMarkdownHandler(w http.ResponseWriter, r *http.Request, organization_id string, folderPath string) error {
	if err := r.ParseMultipartForm(10 << 20); err != nil { // Limit upload size to 10MB
		return fmt.Errorf("Error parsing form data")
	}

	file, header, err := r.FormFile("file")
	if err != nil {
		return fmt.Errorf("Error retrieving file")
	}
	defer file.Close()

	if header.Header.Get("Content-Type") != "text/markdown" && header.Filename[len(header.Filename)-3:] != ".md" {
		return fmt.Errorf("Only .md files are allowed")
	}

	path := organization_id + folderPath
	ctx := context.Background()
	if err := UploadFileToBucket(ctx, file, header.Filename, path); err != nil {
		return fmt.Errorf("Error uploading file: %v", err)

	}

	return nil
}

func UploadFileToBucket(ctx context.Context, file io.Reader, filename string, folderName string) error {
	// Create a storage client
	client, err := storage.NewClient(ctx)
	if err != nil {
		return fmt.Errorf("failed to create storage client: %v", err)
	}
	defer client.Close()

	// Create a bucket handle
	bucket := client.Bucket(bucketName)

	// Generate the object path (include folder structure if provided)
	objectPath := filename
	if folderName != "" {
		objectPath = fmt.Sprintf("%s/%s", folderName, filename)
	}

	// Create a writer for the object
	object := bucket.Object(objectPath)
	writer := object.NewWriter(ctx)
	defer func() {
		if closeErr := writer.Close(); closeErr != nil {
			fmt.Printf("Warning: failed to close writer: %v\n", closeErr)
		}
	}()

	// Copy the file contents to the bucket
	if _, err := io.Copy(writer, file); err != nil {
		return fmt.Errorf("failed to upload file to bucket: %v", err)
	}

	fmt.Printf("File %s uploaded to bucket %s in folder %s\n", filename, bucketName, folderName)
	return nil
}

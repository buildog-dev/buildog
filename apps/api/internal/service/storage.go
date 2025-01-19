package service

import (
	"bytes"
	"context"
	"fmt"
	"io"
	"net/http"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/s3"
)

const bucketName = "buildog-web"

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
	fileBytes, err := io.ReadAll(file)
	if err != nil {
		return fmt.Errorf("failed to read file: %v", err)
	}

	fileReader := bytes.NewReader(fileBytes)

	sess, err := session.NewSession(&aws.Config{
		Region: aws.String("us-east-2"), // Specify your region
	})
	if err != nil {
		return fmt.Errorf("failed to create AWS session: %v", err)
	}

	svc := s3.New(sess)

	objectPath := filename

	if folderName != "" {
		objectPath = fmt.Sprintf("%s/%s", folderName, filename)
	}

	_, err = svc.PutObject(&s3.PutObjectInput{
		Bucket: aws.String(bucketName),
		Key:    aws.String(objectPath),
		Body:   fileReader,
	})
	if err != nil {
		return fmt.Errorf("failed to upload file to S3: %v", err)
	}

	fmt.Printf("File %s uploaded to bucket %s in folder %s\n", filename, bucketName, folderName)
	return nil
}

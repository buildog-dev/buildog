package repository

import (
	"api/internal/models"
	"api/pkg/database"
	"time"

	"github.com/lib/pq"
)

type DocumentRepository struct {
	db *database.DB
}

func NewDocumentRepository(db *database.DB) *DocumentRepository {
	return &DocumentRepository{db: db}
}

func (r *DocumentRepository) CreateDocument(document *models.Document) (models.Document, error) {
	query := `
		INSERT INTO documents (organization_id, title, preview, status, tags, created_by, updated_by, created_at, updated_at)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
		RETURNING id, organization_id, title, preview, status, tags, created_by, updated_by
	`
	now := time.Now()

	var createdDocument models.Document
	err := r.db.QueryRow(
		query,
		document.OrganizationId,
		document.Title,
		document.Preview,
		document.Status,
		pq.Array(document.Tags),
		document.CreatedBy,
		document.UpdatedBy,
		now,
		now,
	).Scan(
		&createdDocument.Id,
		&createdDocument.OrganizationId,
		&createdDocument.Title,
		&createdDocument.Preview,
		&createdDocument.Status,
		pq.Array(&createdDocument.Tags),
		&createdDocument.CreatedBy,
		&createdDocument.UpdatedBy,
	)

	if err != nil {
		return createdDocument, err
	}

	return createdDocument, nil
}

func (r *DocumentRepository) UpdateDocument(document *models.Document) error {
	return nil
}

func (r *DocumentRepository) DeleteDocument(documentID string) error {
	return nil
}

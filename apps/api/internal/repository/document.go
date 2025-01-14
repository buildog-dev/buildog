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

func (r *DocumentRepository) GetDocuments(organizationId string) ([]models.Document, error) {
	query := `
		SELECT id, organization_id, title, preview, status, tags, created_by, updated_by, created_at, updated_at
		FROM documents
		WHERE organization_id = $1
	`

	rows, err := r.db.Query(query, organizationId)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var documents []models.Document
	for rows.Next() {
		var document models.Document
		err := rows.Scan(
			&document.Id,
			&document.OrganizationId,
			&document.Title,
			&document.Preview,
			&document.Status,
			pq.Array(&document.Tags),
			&document.CreatedBy,
			&document.UpdatedBy,
			&document.CreatedAt,
			&document.UpdatedAt,
		)
		if err != nil {
			return nil, err
		}
		documents = append(documents, document)
	}

	if err = rows.Err(); err != nil {
		return nil, err
	}

	return documents, nil
}

func (r *DocumentRepository) UpdateDocument(document *models.Document) error {
	query := `
		UPDATE documents
		SET title = $2, preview = $3, status = $4, tags = $5, updated_by = $6, updated_at = $7
		WHERE id = $1
	`
	now := time.Now()

	_, err := r.db.Exec(query, document.Id, document.Title, document.Preview, document.Status, pq.Array(document.Tags), document.UpdatedBy, now)
	if err != nil {
		return err
	}

	return nil
}

func (r *DocumentRepository) DeleteDocument(documentID string) error {
	return nil
}

func (r *DocumentRepository) GetDocument(organizationId, documentId string) (models.Document, error) {
	query := `
		SELECT id, organization_id, title, preview, status, tags, created_by, updated_by, created_at, updated_at
		FROM documents
		WHERE id = $1 AND organization_id = $2
	`

	var document models.Document
	err := r.db.QueryRow(query, documentId, organizationId).Scan(
		&document.Id,
		&document.OrganizationId,
		&document.Title,
		&document.Preview,
		&document.Status,
		pq.Array(&document.Tags),
		&document.CreatedBy,
		&document.UpdatedBy,
		&document.CreatedAt,
		&document.UpdatedAt,
	)
	if err != nil {
		return document, err
	}

	return document, nil
}

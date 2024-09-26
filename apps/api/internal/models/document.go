package models

import "time"

type Document struct {
	ID          int64     `json:"id"`
	TenantID    int64     `json:"tenant_id"`
	UserID      int64     `json:"user_id"`
	Title       string    `json:"title"`
	Content     string    `json:"content"`
	Status      string    `json:"status"`
	PublishDate time.Time `json:"publish_date"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

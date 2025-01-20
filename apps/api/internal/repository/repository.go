package repository

import "api/pkg/database"

type Repository struct {
	db                          *database.DB
	documentsRepository         *DocumentRepository
	organizationsRepository     *OrganizationRepository
	organizationUsersRepository *OrganizationUserRepository
	usersRepository             *UserRepository
}

func NewRepository(db *database.DB) *Repository {
	return &Repository{
		db:                          db,
		documentsRepository:         NewDocumentRepository(db),
		organizationsRepository:     NewOrganizationRepository(db),
		organizationUsersRepository: NewOrganizationUserRepository(db),
		usersRepository:             NewUserRepository(db),
	}
}

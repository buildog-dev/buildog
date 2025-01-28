package auth

import "api/internal/models"

type Permission string

const (
	PermissionReadUser   Permission = "read:user"
	PermissionCreateUser Permission = "create:user"
	PermissionUpdateUser Permission = "update:user"
	PermissionDeleteUser Permission = "delete:user"

	PermissionReadOrganization   Permission = "read:organization"
	PermissionCreateOrganization Permission = "create:organization"
	PermissionUpdateOrganization Permission = "update:organization"
	PermissionDeleteOrganization Permission = "delete:organization"

	PermissionCreateDocument Permission = "create:document"
	PermissionUpdateDocument Permission = "update:document"
	PermissionDeleteDocument Permission = "delete:document"
	PermissionReadDocument   Permission = "read:document"
)

const (
	RoleOwner  models.Role = "owner"
	RoleAdmin  models.Role = "admin"
	RoleWriter models.Role = "writer"
	RoleReader models.Role = "reader"
)

var RolePermissions = map[models.Role][]Permission{
	RoleOwner: {
		PermissionReadUser,
		PermissionCreateUser,
		PermissionUpdateUser,
		PermissionDeleteUser,
		PermissionReadOrganization,
		PermissionCreateOrganization,
		PermissionUpdateOrganization,
		PermissionDeleteOrganization,
		PermissionCreateDocument,
		PermissionUpdateDocument,
		PermissionDeleteDocument,
		PermissionReadDocument,
	},
	RoleAdmin: {
		PermissionReadUser,
		PermissionCreateUser,
		PermissionUpdateUser,
		PermissionDeleteUser,
		PermissionCreateDocument,
		PermissionUpdateDocument,
		PermissionDeleteDocument,
		PermissionReadDocument,
	},
	RoleWriter: {
		PermissionReadUser,
		PermissionCreateDocument,
		PermissionUpdateDocument,
		PermissionDeleteDocument,
		PermissionReadDocument,
	},
	RoleReader: {
		PermissionReadUser,
		PermissionReadDocument,
	},
}

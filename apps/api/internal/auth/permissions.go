package auth

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
)

type Role string

const (
	RoleOwner  Role = "owner"
	RoleAdmin  Role = "admin"
	RoleWriter Role = "writer"
	RoleReader Role = "reader"
)

var RolePermissions = map[Role][]Permission{
	RoleOwner: {
		PermissionReadUser,
		PermissionCreateUser,
		PermissionUpdateUser,
		PermissionDeleteUser,
		PermissionReadOrganization,
		PermissionCreateOrganization,
		PermissionUpdateOrganization,
		PermissionDeleteOrganization,
	},
	RoleAdmin: {
		PermissionReadUser,
		PermissionCreateUser,
		PermissionUpdateUser,
		PermissionDeleteUser,
	},
	RoleWriter: {
		PermissionReadUser,
	},
	RoleReader: {
		// PermissionReadUser,
	},
}

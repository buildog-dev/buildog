package messages

import "api/internal/models"

func PublicMessage() models.ApiResponse {
	return models.ApiResponse{
		Text: "This is a public message.",
	}
}

func ProtectedMessage() models.ApiResponse {
	return models.ApiResponse{
		Text: "This is a protected message.",
	}
}

func AdminMessage() models.ApiResponse {
	return models.ApiResponse{
		Text: "This is an admin message.",
	}
}

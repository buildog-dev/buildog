package firebase

import (
	"context"
	"fmt"

	firebase "firebase.google.com/go/v4"
	"firebase.google.com/go/v4/auth"
	"google.golang.org/api/option"
)

var app *firebase.App

func InitFirebase() error {
	opt := option.WithCredentialsFile("./firebase-admin.json")
	var err error
	app, err = firebase.NewApp(context.Background(), nil, opt)
	if err != nil {
		return fmt.Errorf("error initializing app: %v", err)
	}
	return nil
}

func GetAuthClient() (*auth.Client, error) {
	if app == nil {
		return nil, fmt.Errorf("Firebase app is not initialized")
	}
	client, err := app.Auth(context.Background())
	if err != nil {
		return nil, fmt.Errorf("error getting Auth client: %v", err)
	}
	return client, nil
}

func VerifyIDToken(idToken string) (*auth.Token, error) {
	authClient, err := GetAuthClient()
	if err != nil {
		return nil, err
	}

	token, err := authClient.VerifyIDToken(context.Background(), idToken)
	if err != nil {
		return nil, fmt.Errorf("error verifying ID token: %v", err)
	}
	return token, nil
}

func GetUserByUID(uid string) (*auth.UserRecord, error) {
	authClient, err := GetAuthClient()
	if err != nil {
		return nil, err
	}

	userRecord, err := authClient.GetUser(context.Background(), uid)
	if err != nil {
		return nil, fmt.Errorf("error getting user: %v", err)
	}
	return userRecord, nil
}

func UpdateUser(uid, email, password string) error {
	authClient, err := GetAuthClient()
	if err != nil {
		return err
	}

	params := (&auth.UserToUpdate{}).
		Email(email).
		Password(password)

	_, err = authClient.UpdateUser(context.Background(), uid, params)
	if err != nil {
		return fmt.Errorf("error updating user: %v", err)
	}
	return nil
}

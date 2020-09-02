package userauth

import "github.com/tludlow/deliberate/backend/internal/database"

type UserAuthController struct {
	db *database.DB
}

func New(db *database.DB) (*UserAuthController, error) {
	return &UserAuthController{db}, nil
}

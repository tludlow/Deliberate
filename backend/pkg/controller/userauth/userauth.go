package userauth

import (
	"context"

	"github.com/tludlow/deliberate/backend/internal/database"
)

type Controller struct {
	db *database.DB
}

func New(ctx context.Context, db *database.DB) *Controller {
	return &Controller{
		db: db,
	}, nil
}

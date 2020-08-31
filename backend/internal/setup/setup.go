//Package setup sets up the various internal service dependencies for the application to run
package setup

import (
	"context"
	"fmt"
	"log"

	"github.com/tludlow/deliberate/backend/internal/database"
)

type ServerEnv struct {
	Database *database.DB
}

func New(ctx context.Context) (*ServerEnv, error) {
	s := &ServerEnv{}
	//Setup database connection
	dsnString := fmt.Sprintf("host=%s port=%d user=%s password=%s dbname=%s sslmode=disable",
		"localhost",
		5432,
		"deliberate",
		"testpassword",
		"deliberate",
	)
	db, err := database.Connect(ctx, dsnString)
	if err != nil {
		return nil, err
	}
	log.Println("Created database connection")
	s.Database = db

	return s, nil
}

func (s *ServerEnv) Close() error {
	if s.Database != nil {
		s.Database.Close()
	}

	return nil
}

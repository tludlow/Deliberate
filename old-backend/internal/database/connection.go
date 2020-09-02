package database

import (
	"context"
	"fmt"
	"log"

	"github.com/jackc/pgx/v4/pgxpool"
	"github.com/pkg/errors"
)

type DB struct {
	Pool *pgxpool.Pool
}

//Connect - Connects to the database using the provided dsn string and returns the DB type
// func Connect(ctx context.Context, conStr string) (*DB, error) {
// 	pool, err := pgxpool.Connect(ctx, conStr)
// 	if err != nil {
// 		return nil, errors.Wrap(err, "creating connection string")
// 	}

// 	return &DB{Pool: pool}, nil
// }

func Connect(ctx context.Context) (*DB, error) {
	dsnString := fmt.Sprintf("host=%s port=%d user=%s password=%s dbname=%s sslmode=disable",
		"localhost",
		5432,
		"deliberate",
		"testpassword",
		"deliberate",
	)
	pool, err := pgxpool.Connect(ctx, dsnString)
	if err != nil {
		return nil, errors.Wrap(err, "creating connection to database")
	}

	return &DB{Pool: pool}, nil
}

//Close - Closes the connection to the database safely
func (db *DB) Close() {
	log.Println("closing database connection")
	db.Pool.Close()
}

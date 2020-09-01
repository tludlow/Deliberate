package database

import (
	"context"
	"log"

	"github.com/jackc/pgx/v4/pgxpool"
	"github.com/pkg/errors"
)

type DB struct {
	Pool *pgxpool.Pool
}

//Connect - Connects to the database using the provided dsn string and returns the DB type
func Connect(ctx context.Context, conStr string) (*DB, error) {
	pool, err := pgxpool.Connect(ctx, conStr)
	if err != nil {
		return nil, errors.Wrap(err, "creating connection string")
	}

	return &DB{Pool: pool}, nil
}

//Close - Closes the connection to the database safely
func (db *DB) Close() {
	log.Println("closing database connection")
	db.Pool.Close()
}

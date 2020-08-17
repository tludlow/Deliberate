package database

import (
	"context"

	"github.com/jackc/pgx/v4/pgxpool"
	"github.com/pkg/errors"
)

func Connect(ctx context.Context) (*pgxpool.Pool, error) {
	pool, err := pgxpool.Connect(ctx, "user=deliberate password=testpassword host=localhost port=5432 database=deliberate sslmode=disable")
	if err != nil {
		return nil, errors.Wrap(err, "failed to connect to the database")
	}

	//chyeck db connection is good, ping the db
	//TODO

	return pool, nil
}

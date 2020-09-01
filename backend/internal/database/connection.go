package database

import (
	"context"
	"fmt"
	"log"

	"github.com/pkg/errors"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

type DB struct {
	DB *gorm.DB
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
	db, err := gorm.Open(postgres.Open(dsnString), &gorm.Config{})
	if err != nil {
		return nil, errors.Wrap(err, "creating connection to database")
	}

	db.AutoMigrate(&User{})

	return &DB{DB: db}, nil
}

//Close - Closes the connection to the database safely
func (db *DB) Close() {
	log.Println("closing database connection")
	//Gorm, the ORM doesnt use a close method, baked in by itself so we dont need to pass it here
}

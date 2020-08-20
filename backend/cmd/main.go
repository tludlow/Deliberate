package main

import (
	"context"
	"fmt"

	"github.com/tludlow/deliberate/backend/internal/database"
)

type Server struct {
	DB *database.DB
}

func main() {
	fmt.Println("hello")
	//Connect to the database
	dsnString := fmt.Sprintf("host=%s port=%d user=%s password=%s dbname=%s sslmode=disable",
		"localhost",
		5432,
		"deliberate",
		"testpassword",
		"deliberate",
	)
	db, err := database.Connect(context.Background(), dsnString)
	if err != nil {
		panic(err.Error())
	}

	srv := &Server{DB: db}
	srv.DB.Close()
}

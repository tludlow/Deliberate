package main

import (
	"context"
	"log"

	"github.com/sethvargo/go-signalcontext"
)

func main() {
	log.Println("Starting deliberate backend")
	ctx, done := signalcontext.OnInterrupt()

	err := realMain(ctx)
	done()

	if err != nil {
		log.Fatal(err)
	}

	log.Println("successful shutdown of deliberate backend")

	//Connect to the database
	// dsnString := fmt.Sprintf("host=%s port=%d user=%s password=%s dbname=%s sslmode=disable",
	// 	"localhost",
	// 	5432,
	// 	"deliberate",
	// 	"testpassword",
	// 	"deliberate",
	// )

}

func realMain(ctx context.Context) error {
	//Setup the server environment

	//Setup API

	//Run HTTP server
	return nil
}

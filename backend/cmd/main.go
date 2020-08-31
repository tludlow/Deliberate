package main

import (
	"context"
	"log"
	"net/http"

	"github.com/pkg/errors"
	"github.com/sethvargo/go-signalcontext"
	"github.com/tludlow/deliberate/backend/internal/server"
	"github.com/tludlow/deliberate/backend/internal/setup"
)

// Much of the backend framework structure is inspired by google (the makers of golang)
// Repositories here: https://github.com/google/exposure-notifications-server/

func main() {
	log.Println("Starting deliberate backend")
	ctx, done := signalcontext.OnInterrupt()

	err := realMain(ctx)
	done()

	if err != nil {
		log.Fatal(err)
	}

	log.Println("successful shutdown of deliberate backend")

}

func realMain(ctx context.Context) error {
	//Setup the server environment
	env, err := setup.New(ctx)
	if err != nil {
		return err
	}
	defer env.Close()

	//Setup API
	mux := http.NewServeMux()
	mux.Handle("/test", server.HandleTest(ctx))

	srv, err := server.New("5000")
	if err != nil {
		return errors.Wrap(err, "server.New")
	}

	//Run HTTP server
	return srv.ServeHTTPHandler(ctx, mux)
}

package main

import (
	"context"
	"net/http"
	"os"

	"github.com/joho/godotenv"
	"github.com/pkg/errors"
	"github.com/tludlow/Deliberate/backend/internal/interrupt"
	"github.com/tludlow/Deliberate/backend/internal/logging"
	"github.com/tludlow/Deliberate/backend/internal/server"
)

func main() {
	ctx, done := interrupt.Context()
	defer done()

	if err := actualMain(ctx); err != nil {
		logger := logging.FromContext(ctx)
		logger.Fatal(err)
	}
}

func actualMain(ctx context.Context) error {
	logger := logging.FromContext(ctx)

	//load environment variables
	err := godotenv.Load()
	if err != nil {
		return errors.Wrap(err, "godotenv.Load()")
	}

	//create the server
	server, err := server.New(ctx)
	if err != nil {
		return errors.Wrap(err, "server.New")
	}


	//Need to make my own HTTP serve/listen system here so that we can close the server on context
	//Example in google-exposure server, related to done on line 15 of this file
	//TODO
	
	//Transform our gin router to be ran on a stdlib http server so we can gracefull handle shutdowns related to context
	srv := &http.Server{
		Addr: ":" + os.Getenv("PORT"),
		Handler: server.Router,
	}

	go func() {
		<-ctx.Done()

		logger.Debugf("srv.ListenAndServe: context")
		logger.Debugf("srv.ListenAndServe: shutting down gracefully")
		srv.Close()
	}()

	logger.Infof("HTTP listening on :%s", os.Getenv("PORT"))
	return srv.ListenAndServe()
}
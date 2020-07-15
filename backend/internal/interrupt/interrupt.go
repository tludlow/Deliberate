package interrupt

import (
	"context"
	"os"
	"os/signal"
	"syscall"
)

//CODE FOR THIS FOUND FROM HERE:
//https://github.com/google/exposure-notifications-server/blob/main/internal/interrupt/context.go

//Context provides a nicely wrapped context which terminates upon SIGINT and SIGTERM
//signals being generated. These are passed throughout the application
func Context() (context.Context, func()) {
	return WrappedContext(context.Background(), syscall.SIGINT, syscall.SIGTERM)
}

//WrappedContext return a new context which is wrapped in the logic which handles the closing upon signals being generated
func WrappedContext(ctx context.Context, signals ...os.Signal) (context.Context, func()) {
	ctx, closer := context.WithCancel(ctx)

	c := make(chan os.Signal, 1)
	signal.Notify(c, signals...)

	go func() {
		select {
		case <-c:
			closer()
		case <-ctx.Done():
			//os.Exit(0)
		}
	}()

	return ctx, closer
}
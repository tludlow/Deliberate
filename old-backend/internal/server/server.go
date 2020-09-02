//Provides a wrapper around the HTTP server for an opinionated version of it we run
package server

import (
	"context"
	"fmt"
	"log"
	"net"
	"net/http"
	"time"

	"github.com/pkg/errors"
)

type Server struct {
	ip       string
	port     string
	listener net.Listener
}

//New creates a new server that respondes to the provided address with the handler
//Creates the listener but not the server, thats done seperately
func New(port string) (*Server, error) {
	//Listener created first so that the connection is ready when returned to accept accepts immeditatley
	addr := fmt.Sprintf(":" + port)

	listener, err := net.Listen("tcp", addr)
	if err != nil {
		return nil, errors.Wrap(err, "failed to create server listener on"+addr)
	}

	return &Server{
		ip:       listener.Addr().(*net.TCPAddr).IP.String(),
		port:     port,
		listener: listener,
	}, nil
}

//ServeHTTP starts the server based on the server listener created in the New()
//This server is closed when the context provided is closed and has a gracefull stop implemented
func (s *Server) ServeHTTP(ctx context.Context, srv *http.Server) error {
	//Create a new go routine here which listens for the context closure, which gracefully stops the server
	errChan := make(chan error, 1)
	go func() {
		<-ctx.Done()

		log.Println("http server context close received, gracefully stopping")

		shutdownContext, done := context.WithTimeout(context.Background(), 3*time.Second)
		defer done()

		log.Println("shutting down the http server")
		if err := srv.Shutdown(shutdownContext); err != nil {
			select {
			case errChan <- err:
			default:
			}
		}
	}()

	//Serve the actual HTTP server
	if err := srv.Serve(s.listener); err != nil && errors.Cause(err) != http.ErrServerClosed {
		return errors.Wrap(err, "failed to start http server")
	}

	//Handle any errors that may have occured during the shutdown
	select {
	case err := <-errChan:
		return errors.Wrap(err, "failed to shutdown the server")
	default:
		return nil
	}
}

//ServeHTTPHandle wraps the ServeHTTP method, it provides a handler and has the potential to wrap in any observors etc...
func (s *Server) ServeHTTPHandler(ctx context.Context, handler http.Handler) error {
	log.Println("running http server")
	return s.ServeHTTP(ctx, &http.Server{
		Handler: handler,
	})
}

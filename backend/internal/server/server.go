package server

import (
	"context"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v4/pgxpool"
	"github.com/tludlow/Deliberate/backend/internal/database"
)

type Server struct {
	Pool *pgxpool.Pool    //database
	Router *gin.Engine  //http router
}


func New(ctx context.Context) (*Server, error) {
	server := &Server{}

	//connect to the database
	dbPool, err := database.Connect(ctx)
	if err != nil {
		return nil, err
	}
	server.Pool = dbPool

	//create our router
	router := NewRouter()
	server.Router = router

	return server, nil
}
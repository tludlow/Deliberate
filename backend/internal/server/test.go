package server

import (
	"context"
	"net/http"

	"github.com/gin-gonic/gin"
)

func HandleTest(ctx context.Context) gin.HandlerFunc {
	return func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"status": []string{"wow", "cool", "amazing"}})
	}
}

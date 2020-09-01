package server

import (
	"context"
	"errors"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/tludlow/deliberate/backend/internal/database"
	"gorm.io/gorm"
)

func HandleTest(ctx context.Context, db *database.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		user, err := db.FindUserByEmail("thomas@t1est.com")
		if errors.Is(err, gorm.ErrRecordNotFound) {
			c.JSON(http.StatusNotFound, gin.H{})
			return
		}
		if err != nil {
			log.Println(err.Error())
			c.JSON(http.StatusBadRequest, gin.H{"status": "error"})
			return
		}
		c.JSON(http.StatusOK, gin.H{
			"user": gin.H{
				"id":         user.ID,
				"first_name": user.First_name,
				"last_name":  user.Last_name,
				"email":      user.Email,
			},
		})
	}
}

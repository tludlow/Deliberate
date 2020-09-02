package userauth

import (
	"context"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v4"
)

//HandleLogin takes an email and password and generates a set of tokens (access, refresh) if theu ser exists with the given details
func (auth *UserAuthController) HandleLogin(ctx context.Context) gin.HandlerFunc {
	return func(c *gin.Context) {
		email := c.PostForm("email")
		password := c.PostForm("password")

		//Make sure the form parameters have been entered (not empty strings)
		if len(email) == 0 || len(password) == 0 {
			c.JSON(http.StatusBadRequest, gin.H{"message": "You must enter an email and password"})
			return
		}

		//Get the password to the corresponding email
		if err := auth.db.InTx(ctx, pgx.ReadCommitted, func(tx pgx.Tx) error {
			row := tx.QueryRow(ctx, `
				SELECT
					email, password
				FROM
					users
				WHERE email = $1
			`, email)

			var err error
			user, err = scanOneAuthorizedApp(row)
			if err != nil {
				return fmt.Errorf("failed to parse: %w", err)
			}
			return nil
		}); err != nil {
			return nil, fmt.Errorf("get authorized app: %w", err)
		}

		c.JSON(http.StatusOK, gin.H{"user": user})
	}
}

package userauth

import (
	"net/http"
	"time"

	"github.com/dgrijalva/jwt-go"
)

func (c *Controller) HandleLogin() http.Handler {
	return http.HandleFunc(func(w http.ResponseWriter, r *http.Request) {
		ctx := r.Context()

		now := time.Now().UTC()
		//Claims on the token
		claims := &jwt.StandardClaims{
			Audience:  "deliberate-backend",
			ExpiresAt: now.Add(time.Hour * 1).Unix(),
			Id:        "69",
			IssuedAt:  now.Unix(),
			Issuer:    "deliberate-backend",
			Subject:   "testing",
		}

	})
}

package auth

import "golang.org/x/crypto/bcrypt"

//Hash times: https://security.stackexchange.com/questions/17207/recommended-of-rounds-for-bcrypt

//HashPassword takes a password and products a bcrypt algorithm hash of the password
func HashPassword(password string) (string, error) {
	hash, err := bcrypt.GenerateFromPassword([]byte(password), 14)

	return string(hash), err
}

//CompareHashAndPassword takes a hash and a password and compares that they correspond to each other
func CompareHashAndPassword(password, hash string) (bool, error) {
	if err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password)); err != nil {
		return false, err
	}
	return true, nil
}

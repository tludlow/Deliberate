package auth

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

//Cant test this easily as the salt is auto generated and this causes the results to be unpredictable
// func TestPasswordHash(t *testing.T) {
// 	hash, err := HashPassword("Test_password1!")
// 	assert.Nil(t, err, "password hashing produces an error")
// 	assert.Equal(t, hash, "$2a$14$yuIzQMfsR6nb1uboWQ8.VeXWDCo9aFQz2bP/5KE68afd.awq3jxOK", "hashed password result doesnt correspond to what was expected")
// }

func TestPasswordAgainstExpectedHash(t *testing.T) {
	//Good password match
	goodMatch, err1 := CompareHashAndPassword("Test_password1!", "$2a$14$yuIzQMfsR6nb1uboWQ8.VeXWDCo9aFQz2bP/5KE68afd.awq3jxOK")
	assert.Nil(t, err1, "hash and password comparison produces an error")
	assert.True(t, goodMatch, "the hash and password dont match when they SHOULD MATCH")

	//Bad password match
	badMatch, err2 := CompareHashAndPassword("test_password1!", "$2a$14$yuIzQMfsR6nb1uboWQ8.VeXWDCo9aFQz2bP/5KE68afd.awq3jxOK")
	assert.NotNil(t, err2, "hash and password comparison doesnt produce an error when it should")
	assert.False(t, badMatch, "the hash and password match when they SHOULD NOT MATCH")
}

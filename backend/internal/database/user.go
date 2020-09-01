package database

import "gorm.io/gorm"

//User represents a user of the application
type User struct {
	gorm.Model

	ID         uint   `gorm:"primaryKey" json:"id"`
	First_name string `gorm:"type:varchar(50)" json:"first_name"`
	Last_name  string `gorm:"type:varchar(50)" json:"last_name"`
	Email      string `gorm:"type:varchar(100);unique" json:"email"`
	Password   string `gorm:"type:varchar(72)" json:"password"`
}

//FindUserByEmail finds an email with the given email
func (db *DB) FindUserByEmail(email string) (*User, error) {
	var user User
	if err := db.DB.
		Where("email = ?", email).
		First(&user).
		Error; err != nil {
		return nil, err
	}

	return &user, nil
}

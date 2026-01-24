package models

import "fmt"

//pascalcase formating for struct fields
type User struct {
	UserID int    `json:"id"`
	Name   string `json:"name"`
	Email  string `json:"email"`
	Major  string `json:"major"`
	Year   int    `json:"year"`
}

func (user *User) Greet() string {
	return fmt.Sprintf("Hello, I am %s", user.Name)
}

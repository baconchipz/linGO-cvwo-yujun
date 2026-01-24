package main

import (
	"fmt"
	"log"
	"net/http"

	"modgo/internal/database"
	"modgo/internal/router"
)

func main() {
	// Initialize database connection
	err := database.Init("localhost", "5432", "jadonkohyujun", "", "modgo")
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}
	fmt.Println("Connected to database successfully!")

	r := router.Setup()
	fmt.Println("Listening on port 8080 at http://localhost:8080!")

	log.Fatalln(http.ListenAndServe(":8080", r))
}

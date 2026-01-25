package main

import (
	"database/sql"
	"fmt"
	"log"
	"os"

	_ "github.com/lib/pq"
)

func main() {
	psqlInfo := fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=disable",
		"localhost", "5432", "jadonkohyujun", "", "jadonkohyujun")

	db, err := sql.Open("postgres", psqlInfo)
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	err = db.Ping()
	if err != nil {
		log.Fatal(err)
	}

	fmt.Println("Connected to database!")

	// read and run migration
	sqlBytes, err := os.ReadFile("migrations/005_extended_seed_data.sql")
	if err != nil {
		log.Fatal("Failed to read migration file:", err)
	}

	_, err = db.Exec(string(sqlBytes))
	if err != nil {
		log.Fatal("Failed to execute migration:", err)
	}

	fmt.Println("Migration completed successfully!")
}

package main

import (
	"fmt"
	"log"
	"net/http"

	"modgo/internal/router"
)

func main() {
	r := router.Setup()
	fmt.Println("Listening on port 8080 at http://localhost:8080!")

	log.Fatalln(http.ListenAndServe(":8080", r))
}

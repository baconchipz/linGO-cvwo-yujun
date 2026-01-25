package main

import (
    "fmt"
    "log"
    "net/http"
    "os"

    "github.com/go-chi/chi/v5"
    "github.com/go-chi/cors"


    "modgo/internal/database"
    "modgo/internal/routes"
)


func main() {
    // DB config from environment (with local fallbacks)
    dbHost := getenv("DB_HOST", "localhost")
    dbPort := getenv("DB_PORT", "5432")
    dbUser := getenv("DB_USER", "jadonkohyujun")
    dbPass := getenv("DB_PASS", "")
    dbName := getenv("DB_NAME", "jadonkohyujun")

    // Initialize database connection
    err := database.Init(dbHost, dbPort, dbUser, dbPass, dbName)
    if err != nil {
        log.Fatalf("Failed to connect to database: %v", err)
    }
    fmt.Println("Connected to database successfully!")

    r := chi.NewRouter()

    // CORS: replace with your actual Netlify domain when you have it
    r.Use(cors.Handler(cors.Options{
        AllowedOrigins:   []string{"https://your-netlify-site.netlify.app"},
        AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
        AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type"},
        AllowCredentials: true,
        MaxAge:           300,
    }))

    routes.Setup(r)

    // Respect PORT from environment (Render/Heroku/etc.), default to 8080 locally
    port := os.Getenv("PORT")
    if port == "" {
        port = "8080"
    }

    log.Printf("Listening on :%s ...", port)
    log.Fatalln(http.ListenAndServe(":"+port, r))
}

// getenv returns env var or fall
func getenv(key, fallback string) string {
    if v := os.Getenv(key); v != "" {
        return v
    }
    return fallback
}
package main

import (
    "fmt"
    "log"
    "net/http"
    "os"

    "github.com/gin-contrib/cors"

    "modgo/backend/internal/database"
    "modgo/backend/internal/router"
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

    r := router.Setup()

    // CORS: replace with your actual Netlify domain when you have it
    corsCfg := cors.DefaultConfig()
    corsCfg.AllowOrigins = []string{"https://your-netlify-site.netlify.app"}
    corsCfg.AllowMethods = []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"}
    corsCfg.AllowHeaders = []string{"Origin", "Content-Type", "Authorization"}
    corsCfg.AllowCredentials = true
    r.Use(cors.New(corsCfg))

    // Respect PORT from environment (Render/Heroku/etc.), default to 8080 locally
    port := os.Getenv("PORT")
    if port == "" {
        port = "8080"
    }

    log.Printf("Listening on :%s ...", port)
    log.Fatalln(http.ListenAndServe(":"+port, r))
}

// getenv returns env var or fallback
func getenv(key, fallback string) string {
    if v := os.Getenv(key); v != "" {
        return v
    }
    return fallback
}
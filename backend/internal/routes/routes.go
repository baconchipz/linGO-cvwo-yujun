package routes

import (
	"encoding/json"
	"modgo/internal/handlers/comments"
	"modgo/internal/handlers/posts"
	"modgo/internal/handlers/users"
	"net/http"

	"github.com/go-chi/chi/v5"
)

func GetRoutes() func(r chi.Router) {
	return func(r chi.Router) {
		// Root endpoint
		r.Get("/", func(w http.ResponseWriter, req *http.Request) {
			w.Header().Set("Content-Type", "application/json")
			w.WriteHeader(http.StatusOK)
			json.NewEncoder(w).Encode(map[string]string{
				"message":   "modGO API",
				"endpoints": "/health, /users",
			})
		})

		// Health check
		r.Get("/health", func(w http.ResponseWriter, req *http.Request) {
			w.Header().Set("Content-Type", "application/json")
			w.WriteHeader(http.StatusOK)
			json.NewEncoder(w).Encode(map[string]string{"status": "ok"})
		})

		// Users endpoint
		r.Get("/users", func(w http.ResponseWriter, req *http.Request) {
			response, err := users.HandleList(w, req)

			w.Header().Set("Content-Type", "application/json")
			if err != nil {
				w.WriteHeader(http.StatusInternalServerError)
				json.NewEncoder(w).Encode(map[string]string{"error": err.Error()})
				return
			}
			json.NewEncoder(w).Encode(response)
		})
		// Posts endpoints
		r.Get("/posts", func(w http.ResponseWriter, req *http.Request) {
			response, err := posts.HandleList(w, req)

			w.Header().Set("Content-Type", "application/json")
			if err != nil {
				w.WriteHeader(http.StatusInternalServerError)
				json.NewEncoder(w).Encode(map[string]string{"error": err.Error()})
				return
			}
			json.NewEncoder(w).Encode(response)
		})

		// Create post endpoint
		r.Post("/posts", func(w http.ResponseWriter, req *http.Request) {
			response, err := posts.HandleCreate(w, req)

			w.Header().Set("Content-Type", "application/json")
			if err != nil {
				w.WriteHeader(http.StatusBadRequest)
				json.NewEncoder(w).Encode(map[string]string{"error": err.Error()})
				return
			}
			w.WriteHeader(http.StatusCreated)
			json.NewEncoder(w).Encode(response)
		})

		// Comments endpoints
		r.Get("/posts/{postId}/comments", func(w http.ResponseWriter, req *http.Request) {
			response, err := comments.HandleList(w, req)

			w.Header().Set("Content-Type", "application/json")
			if err != nil {
				w.WriteHeader(http.StatusInternalServerError)
				json.NewEncoder(w).Encode(map[string]string{"error": err.Error()})
				return
			}
			json.NewEncoder(w).Encode(response)
		})

		// Create comment endpoint
		r.Post("/posts/{postId}/comments", func(w http.ResponseWriter, req *http.Request) {
			response, err := comments.HandleCreate(w, req)

			w.Header().Set("Content-Type", "application/json")
			if err != nil {
				w.WriteHeader(http.StatusBadRequest)
				json.NewEncoder(w).Encode(map[string]string{"error": err.Error()})
				return
			}
			w.WriteHeader(http.StatusCreated)
			json.NewEncoder(w).Encode(response)
		})

		// Post modification endpoints
		r.Put("/posts/{postId}", func(w http.ResponseWriter, req *http.Request) {
			response, err := posts.HandleUpdate(w, req)

			w.Header().Set("Content-Type", "application/json")
			if err != nil {
				w.WriteHeader(http.StatusBadRequest)
				json.NewEncoder(w).Encode(map[string]string{"error": err.Error()})
				return
			}
			json.NewEncoder(w).Encode(response)
		})

		// Delete post endpoint
		r.Delete("/posts/{postId}", func(w http.ResponseWriter, req *http.Request) {
			response, err := posts.HandleDelete(w, req)

			w.Header().Set("Content-Type", "application/json")
			if err != nil {
				w.WriteHeader(http.StatusInternalServerError)
				json.NewEncoder(w).Encode(map[string]string{"error": err.Error()})
				return
			}
			w.WriteHeader(http.StatusNoContent)
			json.NewEncoder(w).Encode(response)
		})
	}
}

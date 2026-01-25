package routes

import (
	"encoding/json"
	"modgo/internal/handlers/comments"
	"modgo/internal/handlers/modules"
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

		// Create user
		r.Post("/users", func(w http.ResponseWriter, req *http.Request) {
			response, err := users.HandleCreate(w, req)

			w.Header().Set("Content-Type", "application/json")
			if err != nil {
				w.WriteHeader(http.StatusBadRequest)
				json.NewEncoder(w).Encode(map[string]string{"error": err.Error()})
				return
			}
			w.WriteHeader(http.StatusCreated)
			json.NewEncoder(w).Encode(response)
		})

		// Update user
		r.Put("/users/{userId}", func(w http.ResponseWriter, req *http.Request) {
			response, err := users.HandleUpdate(w, req)

			w.Header().Set("Content-Type", "application/json")
			if err != nil {
				w.WriteHeader(http.StatusBadRequest)
				json.NewEncoder(w).Encode(map[string]string{"error": err.Error()})
				return
			}
			json.NewEncoder(w).Encode(response)
		})

		// Delete user
		r.Delete("/users/{userId}", func(w http.ResponseWriter, req *http.Request) {
			response, err := users.HandleDelete(w, req)

			w.Header().Set("Content-Type", "application/json")
			if err != nil {
				w.WriteHeader(http.StatusInternalServerError)
				json.NewEncoder(w).Encode(map[string]string{"error": err.Error()})
				return
			}
			w.WriteHeader(http.StatusNoContent)
			json.NewEncoder(w).Encode(response)
		})

		// Modules endpoints
		r.Get("/modules", func(w http.ResponseWriter, req *http.Request) {
			response, err := modules.HandleList(w, req)

			w.Header().Set("Content-Type", "application/json")
			if err != nil {
				w.WriteHeader(http.StatusInternalServerError)
				json.NewEncoder(w).Encode(map[string]string{"error": err.Error()})
				return
			}
			json.NewEncoder(w).Encode(response)
		})

		r.Get("/modules/code/{moduleCode}", func(w http.ResponseWriter, req *http.Request) {
			response, err := modules.HandleGetByCode(w, req)

			w.Header().Set("Content-Type", "application/json")
			if err != nil {
				w.WriteHeader(http.StatusNotFound)
				json.NewEncoder(w).Encode(map[string]string{"error": err.Error()})
				return
			}
			json.NewEncoder(w).Encode(response)
		})

		r.Get("/modules/{moduleId}", func(w http.ResponseWriter, req *http.Request) {
			response, err := modules.HandleGet(w, req)

			w.Header().Set("Content-Type", "application/json")
			if err != nil {
				w.WriteHeader(http.StatusNotFound)
				json.NewEncoder(w).Encode(map[string]string{"error": err.Error()})
				return
			}
			json.NewEncoder(w).Encode(response)
		})

		// User module subscriptions
		r.Get("/users/{userId}/modules", func(w http.ResponseWriter, req *http.Request) {
			response, err := modules.HandleUserModules(w, req)

			w.Header().Set("Content-Type", "application/json")
			if err != nil {
				w.WriteHeader(http.StatusInternalServerError)
				json.NewEncoder(w).Encode(map[string]string{"error": err.Error()})
				return
			}
			json.NewEncoder(w).Encode(response)
		})

		r.Post("/users/{userId}/modules/{moduleId}", func(w http.ResponseWriter, req *http.Request) {
			response, err := modules.HandleSubscribe(w, req)

			w.Header().Set("Content-Type", "application/json")
			if err != nil {
				w.WriteHeader(http.StatusBadRequest)
				json.NewEncoder(w).Encode(map[string]string{"error": err.Error()})
				return
			}
			json.NewEncoder(w).Encode(response)
		})

		r.Delete("/users/{userId}/modules/{moduleId}", func(w http.ResponseWriter, req *http.Request) {
			response, err := modules.HandleUnsubscribe(w, req)

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

		// Comment modification endpoints
		r.Put("/posts/{postId}/comments/{commentId}", func(w http.ResponseWriter, req *http.Request) {
			response, err := comments.HandleUpdate(w, req)

			w.Header().Set("Content-Type", "application/json")
			if err != nil {
				w.WriteHeader(http.StatusBadRequest)
				json.NewEncoder(w).Encode(map[string]string{"error": err.Error()})
				return
			}
			json.NewEncoder(w).Encode(response)
		})

		// Delete comment endpoint
		r.Delete("/posts/{postId}/comments/{commentId}", func(w http.ResponseWriter, req *http.Request) {
			response, err := comments.HandleDelete(w, req)

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

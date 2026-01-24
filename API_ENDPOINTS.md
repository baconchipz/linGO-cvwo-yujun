# modGO Backend API Endpoints

All endpoints are prefixed with `/api`.

## Posts

- **GET** `/api/posts` - List all posts (excludes soft-deleted)
- **POST** `/api/posts` - Create a new post
  - Body: `{"user_id": int, "title": string, "body": string, "module_id": int}`
- **PUT** `/api/posts/{postId}` - Update a post
  - Body: `{"title": string, "body": string}`
- **DELETE** `/api/posts/{postId}` - Soft delete a post (sets title to "[Deleted]" and deleted_at timestamp)

## Comments

- **GET** `/api/posts/{postId}/comments` - List all comments for a post (excludes soft-deleted)
- **POST** `/api/posts/{postId}/comments` - Create a new comment (increments post's comment_count)
  - Body: `{"user_id": int, "body": string}`
- **PUT** `/api/posts/{postId}/comments/{commentId}` - Update a comment
  - Body: `{"body": string}`
- **DELETE** `/api/posts/{postId}/comments/{commentId}` - Soft delete a comment (sets body to "[Deleted]" and deleted_at timestamp)

## Users

- **GET** `/api/users` - List all users (excludes soft-deleted)
- **POST** `/api/users` - Create a new user
  - Body: `{"username": string, "password": string}`
- **PUT** `/api/users/{userId}` - Update a user
  - Body: `{"username": string}` (password updates can be added later)
- **DELETE** `/api/users/{userId}` - Soft delete a user (sets deleted_at timestamp)

## Modules

- **GET** `/api/modules` - List all modules ordered by title
- **GET** `/api/modules/{moduleId}` - Get a single module by ID

## User-Module Subscriptions

- **GET** `/api/users/{userId}/modules` - Get all modules a user is subscribed to
- **POST** `/api/users/{userId}/modules/{moduleId}` - Subscribe user to a module
  - Uses ON CONFLICT DO NOTHING (idempotent)
- **DELETE** `/api/users/{userId}/modules/{moduleId}` - Unsubscribe user from a module

## Database Schema

### Tables
- `users` - user_id, username, password, created_at, deleted_at
- `modules` - module_id, module_title, description
- `posts` - post_id, user_id, title, body, module_id, created_at, updated_at, deleted_at, like_count, comment_count
- `comments` - comment_id, post_id, user_id, body, created_at, updated_at, deleted_at, like_count
- `user_modules` - user_id, module_id (junction table with composite PK)

### Soft Delete Pattern
- Posts: title → "[Deleted]", deleted_at → current timestamp
- Comments: body → "[Deleted]", deleted_at → current timestamp
- Users: deleted_at → current timestamp
- All list endpoints filter out records where deleted_at IS NOT NULL

### Tested Examples

```bash
# List modules
curl http://localhost:8080/api/modules

# Get module by ID
curl http://localhost:8080/api/modules/1

# Create user
curl -X POST -H "Content-Type: application/json" \
  -d '{"username":"newuser","password":"pass123"}' \
  http://localhost:8080/api/users

# Update user
curl -X PUT -H "Content-Type: application/json" \
  -d '{"username":"updated"}' \
  http://localhost:8080/api/users/4

# Delete user
curl -X DELETE http://localhost:8080/api/users/4

# Subscribe to module
curl -X POST http://localhost:8080/api/users/1/modules/1

# Get user's modules
curl http://localhost:8080/api/users/1/modules

# Unsubscribe from module
curl -X DELETE http://localhost:8080/api/users/1/modules/1
```


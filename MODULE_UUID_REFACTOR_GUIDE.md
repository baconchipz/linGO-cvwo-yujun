# Module UUID Refactor Implementation Guide

This guide provides complete code changes to refactor modules from integer IDs to UUIDs while displaying module codes to users.

## Summary of Changes

1. **Database**: UUID-based module IDs, module_code as display field
2. **Backend**: UUID support in Go models, handlers with module_code search
3. **Frontend**: Module code display, UUID-based API calls behind the scenes

---

## 1. Database Migration (Already Created)

Run `/backend/migrations/003_refactor_modules_uuid.sql`

This migration:
- Enables UUID extension
- Creates new modules table with UUID primary key
- Adds module_code field (what users see)
- Migrates all posts and user_modules to reference UUIDs
- Preserves all existing data

---

## 2. Backend Go Code Changes

### Models (Already Updated)

✅ `/backend/internal/models/module.go` - Uses `uuid.UUID`
✅ `/backend/internal/models/post.go` - Uses `uuid.UUID` for module_id, adds module_code field

### Data Access Layer Updates

#### `/backend/internal/dataaccess/posts.go`

Update `ListPosts` to JOIN with modules and return module_code:

```go
func ListPosts(db *database.Database) ([]models.Post, error) {
	rows, err := db.Query(`
        SELECT p.post_id, p.user_id, p.title, p.body, p.module_id,
               m.module_code,
               p.created_at, p.updated_at, p.deleted_at, p.like_count, p.comment_count
        FROM posts p
        LEFT JOIN modules m ON p.module_id = m.module_id
        WHERE p.deleted_at IS NULL
        ORDER BY p.created_at DESC`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var posts []models.Post
	for rows.Next() {
		var p models.Post
		var deletedAt sql.NullTime
		if err := rows.Scan(
			&p.PostID, &p.UserID, &p.Title, &p.Body, &p.ModuleID,
			&p.ModuleCode,
			&p.CreatedAt, &p.UpdatedAt, &deletedAt, &p.LikeCount, &p.CommentCount,
		); err != nil {
			return nil, err
		}
		if deletedAt.Valid {
			p.DeletedAt = &deletedAt.Time
		}
		posts = append(posts, p)
	}
	return posts, rows.Err()
}
```

Update `CreatePost` - accepts UUID module_id:

```go
func CreatePost(db *database.Database, post models.Post) (models.Post, error) {
	var deletedAt sql.NullTime
	err := db.QueryRow(`
		INSERT INTO posts (user_id, title, body, module_id)
		VALUES ($1, $2, $3, $4)
		RETURNING post_id, user_id, title, body, module_id, created_at, updated_at, deleted_at, like_count, comment_count`,
		post.UserID, post.Title, post.Body, post.ModuleID,
	).Scan(&post.PostID, &post.UserID, &post.Title, &post.Body, &post.ModuleID, &post.CreatedAt, &post.UpdatedAt, &deletedAt, &post.LikeCount, &post.CommentCount)
	if err != nil {
		return models.Post{}, err
	}
	if deletedAt.Valid {
		post.DeletedAt = &deletedAt.Time
	}
	return post, nil
}
```

#### `/backend/internal/dataaccess/modules.go`

Add function to get module by code (for search):

```go
package dataaccess

import (
	"database/sql"
	"modgo/internal/database"
	"modgo/internal/models"
	"github.com/google/uuid"
)

func ListModules(db *database.Database) ([]models.Module, error) {
	rows, err := db.Query(`
		SELECT module_id, module_code, module_title, description
		FROM modules
		ORDER BY module_code`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var modules []models.Module
	for rows.Next() {
		var m models.Module
		if err := rows.Scan(&m.ModuleID, &m.ModuleCode, &m.ModuleTitle, &m.Description); err != nil {
			return nil, err
		}
		modules = append(modules, m)
	}
	return modules, rows.Err()
}

func GetModuleByID(db *database.Database, moduleID uuid.UUID) (models.Module, error) {
	var m models.Module
	err := db.QueryRow(`
		SELECT module_id, module_code, module_title, description
		FROM modules
		WHERE module_id = $1`,
		moduleID,
	).Scan(&m.ModuleID, &m.ModuleCode, &m.ModuleTitle, &m.Description)
	if err == sql.ErrNoRows {
		return models.Module{}, err
	}
	return m, err
}

func GetModuleByCode(db *database.Database, moduleCode string) (models.Module, error) {
	var m models.Module
	err := db.QueryRow(`
		SELECT module_id, module_code, module_title, description
		FROM modules
		WHERE UPPER(module_code) = UPPER($1)`,
		moduleCode,
	).Scan(&m.ModuleID, &m.ModuleCode, &m.ModuleTitle, &m.Description)
	if err == sql.ErrNoRows {
		return models.Module{}, err
	}
	return m, err
}

func GetUserModules(db *database.Database, userID int) ([]models.Module, error) {
	rows, err := db.Query(`
		SELECT m.module_id, m.module_code, m.module_title, m.description
		FROM modules m
		INNER JOIN user_modules um ON m.module_id = um.module_id
		WHERE um.user_id = $1
		ORDER BY m.module_code`,
		userID,
	)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var modules []models.Module
	for rows.Next() {
		var m models.Module
		if err := rows.Scan(&m.ModuleID, &m.ModuleCode, &m.ModuleTitle, &m.Description); err != nil {
			return nil, err
		}
		modules = append(modules, m)
	}
	return modules, rows.Err()
}
```

### Handlers Updates

#### `/backend/internal/handlers/modules/modules.go`

Update `HandleGet` to accept UUID:

```go
func HandleGet(w http.ResponseWriter, r *http.Request) (*api.Response, error) {
	db := database.GetDB()

	moduleIDStr := chi.URLParam(r, "moduleId")
	moduleID, err := uuid.Parse(moduleIDStr)
	if err != nil {
		return nil, errors.Wrap(err, fmt.Sprintf(ErrInvalidModuleID, GetModule))
	}

	module, err := dataaccess.GetModuleByID(db, moduleID)
	if err != nil {
		return nil, errors.Wrap(err, fmt.Sprintf(ErrRetrieveModule, GetModule))
	}

	data, err := json.Marshal(module)
	if err != nil {
		return nil, errors.Wrap(err, fmt.Sprintf(ErrEncodeView, GetModule))
	}

	return &api.Response{
		Payload: api.Payload{
			Data: data,
		},
		Messages: []string{SuccessfulGetModuleMessage},
	}, nil
}
```

Add new handler to search by module code:

```go
func HandleGetByCode(w http.ResponseWriter, r *http.Request) (*api.Response, error) {
	db := database.GetDB()

	moduleCode := chi.URLParam(r, "moduleCode")
	if moduleCode == "" {
		return nil, errors.New("module code is required")
	}

	module, err := dataaccess.GetModuleByCode(db, moduleCode)
	if err != nil {
		return nil, errors.Wrap(err, "Failed to retrieve module by code")
	}

	data, err := json.Marshal(module)
	if err != nil {
		return nil, errors.Wrap(err, "Failed to encode response")
	}

	return &api.Response{
		Payload: api.Payload{
			Data: data,
		},
		Messages: []string{"Successfully retrieved module"},
	}, nil
}
```

#### `/backend/internal/handlers/posts/posts.go`

Update `HandleCreate` to accept UUID module_id:

```go
func HandleCreate(w http.ResponseWriter, r *http.Request) (*api.Response, error) {
	db := database.GetDB()

	var post models.Post
	if err := json.NewDecoder(r.Body).Decode(&post); err != nil {
		return nil, errors.Wrap(err, fmt.Sprintf(ErrDecodeRequest, CreatePost))
	}

	created, err := dataaccess.CreatePost(db, post)
	if err != nil {
		return nil, errors.Wrap(err, fmt.Sprintf(ErrCreatePost, CreatePost))
	}

	data, err := json.Marshal(created)
	if err != nil {
		return nil, errors.Wrap(err, fmt.Sprintf(ErrEncodeView, CreatePost))
	}

	return &api.Response{
		Payload: api.Payload{
			Data: data,
		},
		Messages: []string{SuccessfulCreatePostMessage},
	}, nil
}
```

### Router Updates

#### `/backend/internal/routes/routes.go`

Add route for module code search:

```go
r.Get("/modules/code/{moduleCode}", api.Handler(modules.HandleGetByCode))
```

---

## 3. Frontend React Changes

### API Client Updates

#### `/frontend/src/api/client.ts`

Update to handle UUIDs and add module code search:

```typescript
// Get module by UUID
export async function getModule(moduleId: string) {
  const res = await fetch(`${API_BASE_URL}/modules/${moduleId}`);
  return res.json() as Promise<ApiResponse<any>>;
}

// NEW: Get module by code (e.g., "CS2030")
export async function getModuleByCode(moduleCode: string) {
  const res = await fetch(`${API_BASE_URL}/modules/code/${moduleCode}`);
  return res.json() as Promise<ApiResponse<any>>;
}

// Update createPost to accept UUID module_id
export async function createPost(userId: number, title: string, body: string, moduleId: string) {
  const res = await fetch(`${API_BASE_URL}/posts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_id: userId, title, body, module_id: moduleId }),
  });
  return res.json() as Promise<ApiResponse<any>>;
}
```

### Type Updates

#### `/frontend/src/types/api.ts`

```typescript
export interface Module {
  module_id: string; // UUID
  module_code: string; // What users see (CS2030, CS2040, etc.)
  module_title: string;
  description: string;
}

export interface Post {
  post_id: number;
  user_id: number;
  title: string;
  body: string;
  module_id: string; // UUID
  module_code?: string; // For display
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
  like_count: number;
  comment_count: number;
}
```

### Component Updates

#### `/frontend/src/components/Header.tsx`

Update search to use module code lookup:

```typescript
const handleSearch = async (e: React.FormEvent) => {
  e.preventDefault();
  if (searchQuery.trim()) {
    const moduleMatch = searchQuery.match(/[a-zA-Z]*\d+/);
    if (moduleMatch) {
      const moduleCode = moduleMatch[0].toUpperCase();
      try {
        const response = await api.getModuleByCode(moduleCode);
        const module = response.payload.data;
        navigate(`/module/${module.module_id}`);
      } catch (err) {
        console.error('Module not found:', err);
        navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      }
    } else {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
    setSearchQuery('');
  }
};
```

#### `/frontend/src/components/CreatePostModal.tsx`

Update to fetch modules and use UUID:

```typescript
const [modules, setModules] = useState<Module[]>([]);
const [moduleId, setModuleId] = useState('');

useEffect(() => {
  const fetchModules = async () => {
    try {
      const response = await api.listModules();
      setModules(response.payload.data || []);
      if (response.payload.data.length > 0) {
        setModuleId(response.payload.data[0].module_id);
      }
    } catch (err) {
      console.error('Failed to fetch modules:', err);
    }
  };
  fetchModules();
}, []);

// In the form:
<TextField
  fullWidth
  select
  label="Module"
  value={moduleId}
  onChange={(e) => setModuleId(e.target.value)}
  SelectProps={{ native: true }}
>
  {modules.map(m => (
    <option key={m.module_id} value={m.module_id}>
      {m.module_code}
    </option>
  ))}
</TextField>
```

#### `/frontend/src/components/Postcard.tsx`

Display module_code instead of module_id:

```typescript
<Typography variant="caption">
  m/{post.module_code || post.module_id}
</Typography>
```

#### `/frontend/src/pages/Module.tsx`

Update to use UUID and display module code:

```typescript
const { moduleId } = useParams<{ moduleId: string }>();
const [moduleName, setModuleName] = useState('');

useEffect(() => {
  const fetchModule = async () => {
    try {
      const moduleResponse = await api.getModule(moduleId!);
      setModuleName(moduleResponse.payload.data.module_code);
      
      const postsResponse = await api.listPosts();
      const filtered = postsResponse.payload.data.filter(
        (p: Post) => p.module_id === moduleId
      );
      setPosts(filtered);
    } catch (err) {
      setError('Failed to load module');
    }
    setLoading(false);
  };
  fetchModule();
}, [moduleId]);

// Display:
<Typography variant="h4">{moduleName}</Typography>
```

---

## 4. Updated Seed Data

Update `/backend/migrations/002_seed_data.sql`:

```sql
-- Insert sample modules with UUIDs (these will be auto-generated)
INSERT INTO modules (module_code, module_title, description) VALUES
('CS2030', 'CS2030', 'Programming Methodology II'),
('CS2040', 'CS2040', 'Data Structures and Algorithms'),
('CS3230', 'CS3230', 'Design and Analysis of Algorithms')
ON CONFLICT (module_code) DO NOTHING;

-- Posts will need to reference the generated UUIDs
-- You can either:
-- 1. Let the migration script handle it (recommended)
-- 2. Or manually insert after getting the UUIDs
```

---

## 5. Installation & Running

### Backend Dependencies

Add UUID package to `go.mod`:

```bash
cd backend
go get github.com/google/uuid
```

### Database Migration

```bash
# Run the migration
psql -U your_user -d your_db -f backend/migrations/003_refactor_modules_uuid.sql

# Or if using a migration tool, run:
# migrate -path backend/migrations -database "postgres://..." up
```

### Rebuild & Run

```bash
# Backend
cd backend
go run cmd/server/main.go

# Frontend
cd frontend
npm run dev
```

---

## Summary

**What Users See:**
- Module codes like "CS2030", "CS2040" everywhere
- Clean URLs still reference UUIDs internally: `/module/550e8400-e29b-41d4-a716-446655440000`

**What Happens Behind the Scenes:**
- Search bar converts "CS2030" → fetches module → gets UUID → navigates
- Post creation stores UUID in database
- API responses include both UUID (for references) and module_code (for display)
- All foreign keys use UUIDs for data integrity

**Key Benefits:**
- UUIDs provide globally unique IDs
- Module codes remain human-readable
- Easy to add new modules without ID conflicts
- Clean separation between internal IDs and display values

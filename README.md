Name: Koh Yu Jun
# modGo 🚀
A Reddit-style forum for NUS students to discuss academic modules.

Deployed Website: https://modgo-cvwo-yujun-front.onrender.com/

# Functionalities
- Frontend: React (TypeScript) with Material UI (MUI).
- Backend: Go(Golang) RESTful API
- Database: PostgreSQL (Hosted on Render).
- Styling: CSS

# Key Features 
1. Create new post/comment
2. Like post/comment
3. Edit post/comment
4. Delete post/comment
5. Search for modules/posts(bugged)
6. Select user's modules
7. Filter by user's module
8. Sort by Like Count
9. Sort by Data added/updated
10. See user profile (Created posts & comments)
11. Login/Register by username
12. Logout

# Local Setup Guide for modGO

1. Download the files
    ```makefile
    git clone https://github.com/yjenexd/modGO-cvwo-yujun.git
    cd modGO-cvwo-yujun
    ```

2. Backend Setup (Go)

      a.Download Go and follow the installation instructions
    
      b.Create a .env file in backend or set these in your shell :
      ```makefile
      export DB_HOST=localhost
      export DB_PORT=5432
      export DB_USER=your_db_user
      export DB_PASS=your_db_password
      export DB_NAME=your_db_name
      export PORT=8080
      ```
      c.Install dependencies and run the server
      
      ```makefile
      cd backend
      go mod tidy
      go run cmd/server/main.go
      ```
      d.backend should now be running at ```http://localhost:8080```

3. Frontend Setup

      a.Install Node.js
      
      b.Install depencies 
      
      ```makefile
      cd frontend
      npm install
      ```
      c.Set up environment variables
      
      Create a ```.env``` file in frontend with:
      ```makefile
      VITE_API_URL=http://localhost:8080
      ```
      d.Run the front end
      
      ```makefile
      npm run dev
      ```


Developer log: https://docs.google.com/document/d/1GqNfUxdU9KmRrQROw20Gl-5Pw-loAsWc-WGBnhyvbo0/edit?usp=sharing

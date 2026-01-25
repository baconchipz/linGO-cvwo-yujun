import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { TestApiIntegration } from './components/TestApiIntegration';
import './App.css';
import { Users } from './pages/Users';
import { Home } from './pages/Home';
import { Module } from './pages/Module';
import { PostDetail } from './pages/PostDetails';
import { Profile } from './pages/Profile';
import { ModuleSelection } from './pages/ModuleSelection';
import { UserProvider, useUser } from './context/UserContext';
import { LoginModal } from './components/LoginModal';

const Shell: React.FC = () => {
  const { user } = useUser();
  const [openCreatePost, setOpenCreatePost] = useState(false);

  return (
    <>
      <Header onPostClick={() => setOpenCreatePost(true)} />
      <main className="main-content">
        <Routes>
          <Route
            path="/"
            element={
              <Home
                openCreatePost={openCreatePost}
                onCloseCreatePost={() => setOpenCreatePost(false)}
              />
            }
          />
          <Route path="/test" element={<TestApiIntegration />} />
          <Route path="/module/:moduleId" element={<Module />} />
          <Route path="/post/:postId" element={<PostDetail />} />
          <Route path="/modules" element={<ModuleSelection />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/users" element={<Users />} />
          <Route
            path="/search"
            element={
              <div className="placeholder">
                <h2>Search Results</h2>
                <p>Search results will appear here...</p>
              </div>
            }
          />
        </Routes>
      </main>
      <LoginModal open={!user} />
    </>
  );
};

export const App: React.FC = () => {
  return (
    <UserProvider>
      <Router>
        <Shell />
      </Router>
    </UserProvider>
  );
};

export default App;

//Routing: It defines which URL leads to which page (e.g., / goes to the Home page, while /search goes to the Search Results).
// Global Providers: If you use "Context" (like a Theme for dark mode or a User context to keep track of who is logged in), the providers wrap everything here.
// Layout Structure: It often contains components that should appear on every page, like your Navbar or Footer.
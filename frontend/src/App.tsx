import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import './App.css';
import { Users } from './pages/Users';
import { Home } from './pages/Home';
import { Module } from './pages/Module';
import { PostDetail } from './pages/PostDetails';

export const App: React.FC = () => {
    const [openCreatePost, setOpenCreatePost] = useState(false);

    return (
        <Router>
            <div className="app-container">
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
                        <Route path="/module/:moduleId" element={<Module />} />
                        <Route path="/post/:postId" element={<PostDetail />} />
                        <Route
                            path="/modules"
                            element={
                                <div className="placeholder">
                                    <h2>My Modules</h2>
                                    <p>Your personalized modules will appear here...</p>
                                </div>
                            }
                        />
                        <Route
                            path="/profile"
                            element={
                                <div className="placeholder">
                                    <h2>Profile</h2>
                                    <p>Manage your profile, major, and year of study...</p>
                                </div>
                            }
                        />
                        <Route
                            path="/users"
                            element={<Users />} // Using Users component for /users route
                        />

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
            </div>
        </Router>
    );
};

export default App;

//Routing: It defines which URL leads to which page (e.g., / goes to the Home page, while /search goes to the Search Results).

// Global Providers: If you use "Context" (like a Theme for dark mode or a User context to keep track of who is logged in), the providers wrap everything here.

// Layout Structure: It often contains components that should appear on every page, like your Navbar or Footer.
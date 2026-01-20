import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import './App.css';

export const App: React.FC = () => {
    return (
        <Router>
            <div className="app-container">
                <Header />
                <main className="main-content">
                    <Routes>
                        <Route
                            path="/"
                            element={
                                <div className="placeholder">
                                    <h2>Welcome to linGO Forum!</h2>
                                    <p>Home / Feed page coming soon...</p>
                                </div>
                            }
                        />
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
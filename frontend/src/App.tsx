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
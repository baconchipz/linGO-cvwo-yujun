import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Header.css';

export const Header: React.FC = () => {
    const navigate = useNavigate();
    //state variable for track the search query
    const [searchQuery, setSearchQuery] = useState(''); 

    //function to handle search form submission
    const handleSearch = (e: React.FormEvent) => {
    e.preventDefault(); 
    if (searchQuery.trim()){ //removes any whitespace from both ends of the string
        navigate(`/search?q=${encodeURIComponent(searchQuery)}`); //send user to the search results pagge with the search query as a URL parameter
        setSearchQuery(''); //clear the search input field
    }
    }  
    
    //function to handle navigation when nav links are clicked
    const handleNavigation = (path: string) => {
        navigate(path);
    }

return (
      <header className="header">
        <div className="header-container">

          {/* Logo/App Name */}
          <div className="logo-section">
            <h1 className="app-title" onClick={() => handleNavigation('/')}>
              linGO
            </h1>
          </div>

          {/* Center: Search Bar */}
          <div className="search-section">
            <form onSubmit={handleSearch} className="search-form">
              <input
                type="text"
                className="search-input"
                placeholder="Search module codes (e.g., CS1101S)..."
                value={searchQuery}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="search-button">
                🔍
              </button>
            </form>
            </div>

          {/* Right: Navigation Links */}
          <nav className="nav-section">
            {/* Home */}
            <button 
              className="nav-link"
              onClick={() => handleNavigation("/")}
              aria-label="Home"
            >
              🏠 Home
            </button>

            {/*My Modules */}
            <button 
              className="nav-link"
              onClick={() => handleNavigation("/modules")}
              aria-label="My Modules"
            >
              📚 My Modules
            </button>

            {/* Profile */}
            <button
              className="nav-link"
              onClick={() => handleNavigation('/profile')}
              aria-label="Profile"
            >
              👤 Profile
            </button>
          </nav>
        </div>
      </header>
    );
  };

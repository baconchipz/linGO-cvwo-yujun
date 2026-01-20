import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Header.css';

export const Header: React.FC = () => {
    const navigate = useNavigate();
    //state variable for track the search query
    const [searchQuery, setSearchQuery] = useState(''); 

    // State for profile menu toggle
    const  [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false); 

    const handleSearch = (e: React.FormEvent) => {
    //prevent default form submission behavior
    e.preventDefault(); 
    if (searchQuery.trim()){ //removes any whitespace from both ends of the string
        navigate(`/search?q=${encodeURIComponent(searchQuery)}`); //send user to the search results pagge with the search query as a URL parameter
        setSearchQuery(''); //clear the search input field
    }
    }  

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

            {/* Profile Section */}
            <div className="profile-dropdown">
              <button
                className="nav-link profile-link"
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                aria-label="Profile Menu"
              >
                👤 Profile
              </button>
              {isProfileMenuOpen && (
                <div className="dropdown-menu">
                  <button
                    className="dropdown-item"
                    onClick={() => {
                      handleNavigation('/profile');
                      setIsProfileMenuOpen(false);
                    }}
                  >
                    View Profile
                  </button>
                  <button
                    className="dropdown-item"
                    onClick={() => {
                      handleNavigation('/settings');
                      setIsProfileMenuOpen(false);
                    }}
                  >
                    Settings
                  </button>
                  <hr className="dropdown-divider" />
                  <button
                    className="dropdown-item logout"
                    onClick={() => {
                      handleNavigation('/login');
                      setIsProfileMenuOpen(false);
                    }}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </nav>
        </div>
      </header>
    );
  };

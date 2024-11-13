import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './styles.css';

function Navbar() {
  const location = useLocation();
  const user = localStorage.getItem('currentUser');

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    // Optionally navigate to login page
    window.location.href = '/';
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <Link className="navbar-brand" to="/">User Account Manager</Link>
        <div className="navbar-nav ms-auto">
          {user ? (
            <>
              <Link 
                className="nav-link" 
                to="/"
                onClick={handleLogout}
              >
                Logout
              </Link>
            </>
          ) : (
            <>
              <Link 
                className={`nav-link ${location.pathname === '/' ? 'active' : ''}`} 
                to="/"
              >
                Login
              </Link>
              <Link 
                className={`nav-link ${location.pathname === '/register' ? 'active' : ''}`} 
                to="/register"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar; 
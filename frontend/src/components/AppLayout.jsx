import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../state/AuthContext';

export default function AppLayout({ children, headerRight }) {
  const { user, logout } = useAuth();
  const location = useLocation();

  const navItems = [
    { path: '/profile', label: 'Profile' },
    { path: '/sheet', label: 'DSA Sheet' }
  ];

  return (
    <div className="app-shell">
      <header className="top-bar">
        <div className="top-left">
          <div>
            <h1 className="app-title-small">DSA Sheet Tracker</h1>
            <p className="welcome-text">Signed in as {user?.email}</p>
          </div>
          <nav className="top-nav">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={
                  location.pathname === item.path ? 'nav-link active' : 'nav-link'
                }
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="top-bar-right">
          {headerRight}
          <button type="button" onClick={logout} className="secondary-btn">
            Logout
          </button>
        </div>
      </header>
      <main className="page-body">{children}</main>
    </div>
  );
}



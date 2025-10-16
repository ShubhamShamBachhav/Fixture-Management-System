import React from 'react';
import { Link } from 'react-router-dom';

export default function Header(){
  return (
    <nav className="header">
      <div className="header-inner container">
        <div className="brand">Fixture Master</div>
        <div className="nav-links">
          <Link to="/" className="btn btn-sm btn-outline-light">Home</Link>
          <Link to="/add" className="btn btn-sm btn-primary ml-2">Add New Fixture</Link>
        </div>
      </div>
    </nav>
  );
}

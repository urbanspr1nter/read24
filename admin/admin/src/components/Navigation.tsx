import React from 'react';
import { Link } from 'react-router-dom';

import './Navigation.css';

export default function Navigation() {
    return (
        <div>
            <nav className="navbar navbar-expand-lg navbar-light">
                <a className="navbar-brand" href="#">read24</a>
                <div className="navbar-nav">
                    <Link to="/" className="nav-item nav-link">Home</Link>
                    <Link to="/book/add" className="nav-item nav-link">Add Book</Link>
                    <Link to="/book/list" className="nav-item nav-link">List Books</Link>
                </div>
            </nav>
        </div>
    );
}

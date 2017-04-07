import React from 'react';
import { IndexLink, Link } from 'react-router';
import './Navbar.scss';

export const Navbar = () => (
  <div className="navContainer">
    <div className="navbar">
      <ul>
        <li>
          <IndexLink to="/" className="navlink">
            Home
          </IndexLink>
        </li>
        <li>
          <Link to="/surveys/1" className="navlink">
            Surveys
          </Link>
        </li>
        <li>
          <Link to="/results" className="navlink">
            Results
          </Link>
        </li>
      </ul>
    </div>
  </div>
);

export default Navbar;

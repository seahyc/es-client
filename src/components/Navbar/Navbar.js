import React from 'react';
import { IndexLink, Link } from 'react-router';
import logo from '../../assets/images/sginnovate.svg';
import './Navbar.scss';

export const Navbar = () => (
  <div className="navContainer">
    <div className="navbar">
      <ul>
        <li>
          <Link to="/surveys/1" className="navlink">
            Surveys
          </Link>
        </li>
        <li>
          <IndexLink to="/">
            <img className="logo" src={logo} />
          </IndexLink>
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

import React from 'react';
import { connect } from 'react-redux';
import { IndexLink, Link } from 'react-router';
import './Navbar.scss';

let Navbar = props => (
  <div className="navContainer">
    <div className="navbar">
      <ul>
        <li>
          <IndexLink to={`/${props.location.query.tags ? `?tags=${props.location.query.tags}` : ''}`}
                     className="navlink">
            Home
          </IndexLink>
        </li>
        <li>
          <Link to={`/surveys${props.location.query.tags ? `?tags=${props.location.query.tags}` : ''}`}
                className="navlink">
            Surveys
          </Link>
        </li>
        <li>
          <Link to={`/results${props.location.query.tags ? `?tags=${props.location.query.tags}` : ''}`}
                className="navlink">
            Results
          </Link>
        </li>
        <li style={{ float: 'right' }}>
          {props.token ?
            (<Link to="/logout" className="navlink">
              Logout
            </Link>) : (<Link to="/login" className="navlink">
              Login
            </Link>)
          }
        </li>
      </ul>
    </div>
  </div>
);

Navbar.propTypes = {
  token: React.PropTypes.string,
  location: React.PropTypes.shape({
    query: React.PropTypes.shape({
      tags: React.PropTypes.string
    })
  })
};

Navbar = connect(state => ({
  token: state.login && state.login.token
}))(Navbar);

export default Navbar;

import React, { Component } from 'react';
import './Login.scss';
import { updatePassword, updateEmail, login } from '../modules/login';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import jwt from 'jwt-decode';

class Login extends Component {
  static propTypes = {
    token: React.PropTypes.string,
    password: React.PropTypes.string.isRequired,
    email: React.PropTypes.string.isRequired,
    error: React.PropTypes.string,
    login: React.PropTypes.func.isRequired,
    updatePassword: React.PropTypes.func.isRequired,
    updateEmail: React.PropTypes.func.isRequired,
    location: React.PropTypes.shape({
      pathname: React.PropTypes.string,
      query: React.PropTypes.shape({
        next: React.PropTypes.string
      })
    })
  };

  componentWillMount() {
    if (this.props.token && jwt(this.props.token)) {
      const next = this.props.location.query && this.props.location.query.next ? this.props.location.query.next :
        '/results';
      browserHistory.push(next);
    }
  }

  componentDidUpdate() {
    if (this.props.token && jwt(this.props.token)) {
      const next = this.props.location.query && this.props.location.query.next ? this.props.location.query.next :
        '/results';
      browserHistory.push(next);
    }
  }

  handleEmailInput(e) {
    this.props.updateEmail(e.target.value);
  }

  handlePasswordInput(e) {
    this.props.updatePassword(e.target.value);
  }

  handleLogin(e) {
    e.preventDefault();
    this.props.login();
  }

  render() {
    const { email, password, error } = this.props;
    return (
      <div className="container full-page">
        <div className="header-container">
          <h1>Results Dashboard</h1>
        </div>
        <form className="form-login" onSubmit={this.handleLogin.bind(this)}>
          <h4>Welcome!</h4>
          <label htmlFor="inputEmail" />
          <input type="email" id="inputEmail" className="form-control" onChange={this.handleEmailInput.bind(this)}
                 value={email} placeholder="Email address" required={true} autoFocus={true} />
          <label htmlFor="inputPassword" />
          <input type="password" id="inputPassword" className="form-control" value={password} placeholder="Passcode"
                 onChange={this.handlePasswordInput.bind(this)} required={true} />
          {error ? <p className="error">{error}</p> : <p>&nbsp;</p>}
          <button className="btn btn-lg btn-block gradient" type="submit">Login</button>
        </form>
      </div>
    );
  }
}

Login = connect(
  state => ({
    token: state.login.token,
    email: state.login.email,
    password: state.login.password,
    error: state.login.error
  }),
  {
    updateEmail,
    updatePassword,
    login
  }
)(Login);

export default Login;

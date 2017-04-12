import React from 'react';
import './Login.scss';

export const LoginView = () => (
  <div className="container full-page">
    <div className="header-container">
      <h1>Results Dashboard</h1>
    </div>
    <form className="form-login">
      <h4>Welcome!</h4>
      <label htmlFor="inputEmail" />
      <input type="email" id="inputEmail" className="form-control"
             placeholder="Email address" required={true} autoFocus={true} />
      <label htmlFor="inputPassword" />
      <input type="password" id="inputPassword" className="form-control" placeholder="Passcode" required={true} />
      <button className="btn btn-lg btn-block gradient" type="submit">Login</button>
    </form>
  </div>
);

export default LoginView;

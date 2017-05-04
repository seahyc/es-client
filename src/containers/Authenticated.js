import React, { Component } from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import jwt from 'jwt-decode';

export default function authenticate(WrappedComponent) {
  class AuthenticatedComponent extends Component {
    static propTypes = {
      authenticated: React.PropTypes.bool.isRequired,
      credentials: React.PropTypes.object,
      location: React.PropTypes.shape({
        pathname: React.PropTypes.string,
        search: React.PropTypes.string
      })
    };
    componentWillMount() {
      this.checkAuthenticated();
    }
    componentWillReceiveProps() {
      this.checkAuthenticated();
    }
    checkAuthenticated() {
      if (!this.props.authenticated) {
        const locationSearch = this.props.location.search;
        const query = locationSearch.replace('?', '&');
        const redirectAfterLogin = this.props.location.pathname + query;
        browserHistory.push(`/login?next=${redirectAfterLogin}`);
      }
    }
    render() {
      if (this.props.authenticated) {
        return <WrappedComponent {...this.props} />;
      }
      return (
        <div className="container">
          <h1>Sorry, you are not authorized.</h1>
        </div>
      );
    }
  }

  return connect(state => ({
    authenticated: Boolean(state.login && state.login.token && jwt(state.login.token)),
    credentials: state.login && state.login.token ? jwt(state.login.token) : null,
  }))(AuthenticatedComponent);
}

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router';

export default function authenticate(WrappedComponent, optional = false) {
  class AuthenticatedComponent extends Component {
    static propTypes = {
      authenticated: React.PropTypes.bool.isRequired,
      dispatch: React.PropTypes.func.isRequired,
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
      if (!this.props.authenticated && !optional) {
        const locationSearch = this.props.location.search;
        const query = locationSearch.replace('?', '&');
        const redirectAfterLogin = this.props.location.pathname + query;
        this.props.dispatch(push(`/login?next=${redirectAfterLogin}`));
      }
    }
    render() {
      if (this.props.authenticated || optional) {
        return <WrappedComponent {...this.props} />;
      }

      return null;
    }
  }

  return connect(state => ({
    authenticated: Boolean(state.session.token)
  }))(AuthenticatedComponent);
}

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { logout } from '../../Login/modules/login';
import { browserHistory } from 'react-router';

class Logout extends Component {
  static propTypes = {
    logout: React.PropTypes.func.isRequired
  };

  async componentWillMount() {
    await this.props.logout();
    browserHistory.push('/');
  }

  render() {
    return (<h1 className="text-center">Logging out...</h1>);
  }
}

Logout = connect(
  null,
  {
    logout
  }
)(Logout);

export default Logout;

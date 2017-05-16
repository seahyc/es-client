import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchProfile } from '../modules/result';
import Profile from './Profile';
import Particulars from './Particulars';
import moment from 'moment';
import './Result.scss';

class Result extends Component {
  static propTypes = {
    fetchProfile: React.PropTypes.func.isRequired,
    profile: React.PropTypes.array,
    params: React.PropTypes.shape({
      profileId: React.PropTypes.string
    })
  };

  async componentWillMount() {
    await this.props.fetchProfile(this.props.params.profileId);
  }

  render() {
    const { profile } = this.props;
    let particulars, attributes;
    if (profile.length) {
      particulars = profile[0].profileOwner;
      attributes = Object.keys(particulars);
    }

    return (
      <div className="container profile-panel">
        {particulars ? (
          <div className="container profile-panel">
            <h1>Result from {moment(profile[0].createdAt).format('lll')}</h1>
            <Particulars particulars={particulars} attributes={attributes} profile={profile[0]}
                         activeProfileId={profile[0].profileId} />
            <Profile profile={profile} />
          </div>) : <h1>Profile doesn't exist.</h1>}
      </div>
    );
  }
}

Result = connect(
  state => ({
    profile: state.result.profile
  }),
  {
    fetchProfile
  }
)(Result);

export default Result;

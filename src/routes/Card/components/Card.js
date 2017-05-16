import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchProfile } from '../modules/card';
import Profile from './Profile';
import './Card.scss';

class Card extends Component {
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
    let particulars;
    if (profile.length) {
      particulars = profile[0].profileOwner;
    }
    let CAS, EG, GRIT;
    profile.forEach(profile => {
      switch (profile.test) {
      case 'CAS':
        CAS = profile;
        break;
      case 'EG':
        EG = profile;
        break;
      case 'GRIT':
        GRIT = profile;
        break;
      }
    });

    return (
      <div>
        {particulars ? (
          <div className="container card-panel">
            <Profile CAS={CAS} EG={EG} GRIT={GRIT} name={`${particulars.firstName} ${particulars.lastName}`} />
          </div>) : <h1>Card doesn't exist.</h1>}
      </div>
    );
  }
}

Card = connect(
  state => ({
    profile: state.card.profile
  }),
  {
    fetchProfile
  }
)(Card);

export default Card;

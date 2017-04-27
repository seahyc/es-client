import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchUser, fetchProfile, selectActiveProfile } from '../modules/profile';
import Response from '../../Result/components/Profile';
import Particulars from '../../Result/components/Particulars';
import Authenticated  from '../../../containers/Authenticated';
import moment from 'moment';
import './Profile.scss';
import Slider from 'react-slick';
import classnames from 'classnames';

function Arrow(props) {
  const { className, onClick } = props;
  return (
    <div className={classnames(className, 'arrow')}
         onClick={onClick} />
  );
}

Arrow.propTypes = {
  className: React.PropTypes.string,
  onClick: React.PropTypes.func.isRequired
};

class Profile extends Component {
  static propTypes = {
    fetchUser: React.PropTypes.func.isRequired,
    fetchProfile: React.PropTypes.func.isRequired,
    selectActiveProfile: React.PropTypes.func.isRequired,
    user: React.PropTypes.object,
    profile: React.PropTypes.array,
    activeProfileId: React.PropTypes.string.isRequired,
    params: React.PropTypes.shape({
      userId: React.PropTypes.string
    })
  };

  async componentWillMount() {
    await this.props.fetchUser(this.props.params.userId);
  }

  async componentDidMount() {
    if (Object.keys(this.props.user).length) {
      await this.props.selectActiveProfile(this.props.user.profiles[0].id);
      this.props.fetchProfile(this.props.activeProfileId);
    }
  }

  handleClick(profileId) {
    this.props.selectActiveProfile(profileId);
    this.props.fetchProfile(profileId);
  }

  render() {
    const { user, profile, activeProfileId } = this.props;
    let particulars, attributes;
    if (Object.keys(user).length) {
      particulars = { ...user };
      delete particulars.profiles;
      attributes = Object.keys(particulars);
    }
    const settings = {
      prevArrow: <Arrow />,
      nextArrow: <Arrow />,
      adaptiveHeight: false,
      infinite: false,
      arrows: true,
      dots: true,
      centerMode: true,
      draggable: true,
      swipe: true,
      swipeToSlide: true,
      focusOnSelect: false,
      initialSlide: 1,
      slidesToShow: 3,
      slidesToScroll: 1,
      responsive: [{ breakpoint: 768, settings: { slidesToShow: 1, dots: false } }]
    };

    const colors = ['#009900', '#6D2077', '#00AEF0', '#F2813C', '#D24301'];

    return (
      <div className="container profile-panel">
        {particulars && user.profiles && user.profiles.length ? (
          <div className="container profile-panel">
            <h1>Profile of {particulars.firstName} {particulars.lastName}</h1>
            <Particulars particulars={particulars} attributes={attributes} />
            <div className="slider">
              <Slider {...settings}>
                {user.profiles.map((pro, index) => (
                  <div key={index} className={classnames('date', { 'selected': pro.id === activeProfileId })}
                       style={{ backgroundColor: colors[index % colors.length] }}
                  onClick={this.handleClick.bind(this, pro.id)}>
                    <h3>{moment(pro.createdAt).format('D MMM h:mmA')}</h3>
                  </div>
                ))}
              </Slider>
            </div>
            {profile ? (<div><h1>Result from {moment(profile[0].createdAt).format('lll')}</h1>
              <Response profile={profile} /></div>) : <h1>Loading profile...</h1>}
          </div>) : <h1>User doesn't exist.</h1>}
      </div>
    );
  }
}

Profile = connect(
  state => ({
    user: state.profile.user,
    activeProfileId: state.profile.activeProfileId,
    profile: state.profile.profiles[state.profile.activeProfileId]
  }),
  {
    fetchUser,
    fetchProfile,
    selectActiveProfile
  }
)(Authenticated(Profile));

export default Profile;

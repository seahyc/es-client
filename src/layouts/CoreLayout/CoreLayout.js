import React from 'react';
import './CoreLayout.scss';
import '../../styles/core.scss';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export const CoreLayout = ({ children, location }) => (
  <div>
    <Navbar location={location} />
    <div className="spacer">
      <a name="top" />
    </div>
    <div className="full-height">
      {children}
    </div>
    <Footer />
  </div>
);

CoreLayout.propTypes = {
  children: React.PropTypes.element.isRequired,
  location: React.PropTypes.shape({
    query: React.PropTypes.shape({
      tags: React.PropTypes.string
    })
  })
};

export default CoreLayout;

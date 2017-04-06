import React from 'react';
import './CoreLayout.scss';
import '../../styles/core.scss';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export const CoreLayout = ({ children }) => (
  <div>
    <Navbar />
    <div className="spacer">
      <a name="top" />
    </div>
    {children}
    <Footer />
  </div>
);

CoreLayout.propTypes = {
  children: React.PropTypes.element.isRequired
};

export default CoreLayout;

import React from 'react';
import './HomeView.scss';
import pointer from '../../../assets/images/pointer.svg';
import ReactRotatingText from 'react-rotating-text';
import { Link } from 'react-router';

export const HomeView = () => (
  <div className="hero container">
    <div className="row">
      <div className="col-xs-12 col-md-10">
        <div className="intro">
          <h1>I am <ReactRotatingText items={['analytical', 'a people person',
            'a leader', 'process-driven',
            'a professional', 'an entrepreneur', 'consistent', 'outcome-oriented'
          ]} /></h1>
          <Link to="/surveys/1">find out who you are now <img src={pointer} />
          </Link>
        </div>
      </div>
    </div>
  </div>
);

export default HomeView;

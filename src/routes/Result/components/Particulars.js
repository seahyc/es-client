import React from 'react';
import md5 from 'md5';
import { Link } from 'react-router';

function attributeFilter(attribute) {
  return attribute
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase());
}

const Particulars = props => (
  <div className="panel">
    <div className="panel-heading orange">
      <h2 className="panel-title">Personal Particulars</h2>
    </div>
    <div className="panel-body particulars">
      <div className="row">
        <div className="col-md-6 particular-col">
          <div className="row">
            <img src={`https://gravatar.com/avatar/${md5(props.particulars.email)}?d=retro`} />
          </div>
          {props.attributes.slice(0, props.attributes.length / 2 - 2).map(attribute =>
            (<div key={attribute} className="row">
              <strong>{attributeFilter(attribute)}:</strong> {props.particulars[attribute]}
            </div>)
          )}
          <br />
          { props.activeProfileId ? (<Link className="btn btn-success" target="_blank"
                                           to={`/card/${props.activeProfileId}`}>
              Print Nametag (Save new page in pdf)
            </Link>) : null }
        </div>
        <div className="col-md-6 particular-col">
          {props.attributes.slice(props.attributes.length / 2 - 2).map(attribute =>
            (<div key={attribute} className="row">
              <strong>{attributeFilter(attribute)}:</strong> {props.particulars[attribute]}
            </div>)
          )}
        </div>
      </div>
    </div>
  </div>

);

Particulars.propTypes = {
  particulars: React.PropTypes.object.isRequired,
  profile: React.PropTypes.array,
  attributes: React.PropTypes.arrayOf(
    React.PropTypes.string
  ),
  activeProfileId: React.PropTypes.string
};

export default Particulars;

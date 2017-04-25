import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchSurveys } from '../modules/surveys';
import { Link } from 'react-router';
import './Surveys.scss';
import Markdown from 'markdown-to-jsx';
import pointer from '../../../assets/images/pointer.svg';

class Surveys extends Component {
  static propTypes = {
    fetchSurveys: React.PropTypes.func.isRequired,
    surveys: React.PropTypes.arrayOf(React.PropTypes.shape({
      title: React.PropTypes.string
    })).isRequired,
    location: React.PropTypes.shape({
      query: React.PropTypes.shape({
        tags: React.PropTypes.string
      })
    })
  };

  async componentWillMount() {
    await this.props.fetchSurveys();
  }

  render() {
    const { surveys, location } = this.props;
    const tags = location.query.tags ? location.query.tags : null;

    return (
      <div className="container survey-panel">
        <h1>Surveys</h1>
        {surveys ? surveys.map((survey, index) => (
          <div key={index} className="panel">
            <div className="panel-heading orange">
              <h2 className="panel-title">{survey.title}</h2>
            </div>
            <div className="panel-body">
              <Markdown>
                {survey.instructions}
              </Markdown>
              <br />
              <Link to={`/surveys/${survey.id}${tags ? `?tags=${tags}` : ''}`}>
                <button className="btn btn-lg orange">Start survey <img src={pointer} /></button>
              </Link>
            </div>
          </div>)) : <h1>No surveys available</h1>}
      </div>
    );
  }
}

Surveys = connect(
  state => ({
    surveys: state.surveys.surveys
  }),
  {
    fetchSurveys
  }
)(Surveys);

export default Surveys;

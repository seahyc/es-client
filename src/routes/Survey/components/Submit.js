import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Line } from 'rc-progress';
import classnames from 'classnames';

class Submit extends Component {
  static propTypes = {
    answers: React.PropTypes.object,
    questions: React.PropTypes.array,
    percent: React.PropTypes.number,
    handleReset: React.PropTypes.func.isRequired,
    handleOnSubmit: React.PropTypes.func.isRequired,
    ensureActiveQuestionVisible: React.PropTypes.func.isRequired
  };

  handleSubmit() {
    if (this.props.percent < 100) {
      this.props.questions.some(question => {
        if (!this.props.answers[question.id]) {
          this.props.ensureActiveQuestionVisible(question.id, false);
          return true;
        }
      });
    } else {
      this.props.handleOnSubmit();
    }
  }

  render() {
    const { handleReset, percent } = this.props;
    return (<div className="submit-panel">
      <div className="row">
        <div className="col-xs-12 col-md-7">
          <p className="progress-text">{percent}%</p>
          <Line strokeColor="#FF5221" percent={percent} strokeWidth="2" trailWidth="2" />
        </div>
        <div className="col-xs-12 col-md-5">
          <div className="row button-panel">
            <div className="col-4">
              <a className="btn btn-default orange" href="#top">&#9650; Go To Top</a>
            </div>
            <div className="col-4">
              <a href="#" className="btn btn-default orange" onClick={handleReset.bind(this)}>
                  Reset
                </a>
            </div>
            <div className="col-4">
              <button type="button" className={classnames('btn btn-default orange',
                { 'translucent': percent !== 100 })} onClick={this.handleSubmit.bind(this)}>Submit
                </button>
            </div>
          </div>
        </div>
      </div>
    </div>);
  }
}

Submit = connect(
  state => ({
    answers: state.survey.answers,
    questions: state.survey.questions,
    percent: Math.round((Object.keys(state.survey.answers).length / state.survey.questions.length) * 100)
  })
)(Submit);

export default (Submit);

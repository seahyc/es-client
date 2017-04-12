import React, { Component } from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';
import keydown from 'react-keydown';
import Scroll from 'react-scroll';
import Question from './Question';
import Submit from './Submit';
import { fetchQuestions, selectActiveQuestion, saveAnswer,
submitAnswers, clearAnswers, clearErrors } from '../modules/survey';
import Waypoint from 'react-waypoint';
import _ from 'lodash';
const Element = Scroll.Element;
const scroll = Scroll.scroller;
import './Survey.scss';

class Survey extends Component {
  static propTypes = {
    questions: React.PropTypes.array,
    activeQuestionId: React.PropTypes.number.isRequired,
    fetchQuestions: React.PropTypes.func.isRequired,
    selectActiveQuestion: React.PropTypes.func.isRequired,
    saveAnswer: React.PropTypes.func.isRequired,
    clearAnswers: React.PropTypes.func.isRequired,
    clearErrors: React.PropTypes.func.isRequired,
    activePersonalAttribute: React.PropTypes.string,
    keydown: React.PropTypes.shape({
      event: React.PropTypes.object
    }),
    submitAnswers: React.PropTypes.func.isRequired
  };

  ensureActiveQuestionVisible(name, smooth = true) {
    try {
      scroll.scrollTo(String(name), {
        duration: 500,
        smooth: smooth,
        offset: -(window.innerHeight / 2) + 250,
        ignoreCancelEvents: true
      });
      const scope = this;
      setTimeout(() => {
        scope.props.selectActiveQuestion(name);
        const input = scope.refs[`qn-${name}`].getWrappedInstance().refs._input;
        if (input) {
          input.focus();
        }
      }, 500);
    } catch (e) {
      console.warn(e, 'Reached end or start of questionnaire');
    }
  }

  async handleKeyDown(event) {
    if (['ArrowRight', 'ArrowDown', 'Enter', 'Tab'].includes(event.key)) {
      await this.props.selectActiveQuestion(this.props.activeQuestionId + 1);
    }	else if (['ArrowLeft', 'ArrowUp'].includes(event.key)) {
      await this.props.selectActiveQuestion(this.props.activeQuestionId - 1);
    } else {
      const activeQuestion = _.find(this.props.questions, { order: this.props.activeQuestionId });
      if (activeQuestion) {
        this.handleQuestionKeydown(event, activeQuestion);
      }
    }
    this.ensureActiveQuestionVisible(this.props.activeQuestionId);
  }

  async handleQuestionKeydown(event, activeQuestion) {
    if (['scale', 'mcq'].includes(activeQuestion.type)) {
      const chosenOption = _.find(activeQuestion.options, { order: parseInt(event.key) });
      if (chosenOption) {
        await this.props.saveAnswer(chosenOption.value);
        setTimeout(this.ensureActiveQuestionVisible.bind(this, this.props.activeQuestionId + 1), 750);
      }
    }
  }

  componentWillMount() {
    if (this.props.questions.length === 0) {
      this.props.fetchQuestions();
    }
  }

  componentDidMount() {
    if (this.props.questions.length) {
      this.ensureActiveQuestionVisible(this.props.activeQuestionId, false);
    }
  }

  componentWillReceiveProps({ keydown }) {
    if (keydown.event && this.props.keydown.event !== keydown.event) {
      this.handleKeyDown(keydown.event);
    }
  }

  handleOnSubmit() {
    this.props.submitAnswers();
  }

  async handleReset() {
    this.props.clearAnswers();
    this.props.clearErrors();
    await this.props.fetchQuestions();
    this.ensureActiveQuestionVisible(0, false);
  }

  render() {
    const { questions, activeQuestionId } = this.props;
    return (
      <div className="container text-center">
        <h1>Questions</h1>
        {questions.length ?
          questions.map(qn => <Element name={String(qn.order)} key={qn.order}
              className={classnames({ 'inactive': qn.order !== activeQuestionId })}>
            <Waypoint onEnter={this.props.selectActiveQuestion.bind(this, qn.order)} topOffset="25%" bottomOffset="40%">
              <div onClick={this.ensureActiveQuestionVisible.bind(this, qn.order)}>
                <Question {...qn} ref={`qn-${qn.order}`} activeQuestionId={activeQuestionId}
                    active={qn.order === activeQuestionId}
                    setAndScroll={this.ensureActiveQuestionVisible.bind(this)} />
              </div>
            </Waypoint>
          </Element>) :
          null
        }
        <Submit handleReset={this.handleReset.bind(this)} handleOnSubmit={this.handleOnSubmit.bind(this)}
                ensureActiveQuestionVisible={this.ensureActiveQuestionVisible.bind(this)} />
      </div>
    );
  }
}

Survey = connect(
  state => ({
    questions: state.survey.questions,
    activeQuestionId: state.survey.activeQuestionId,
    personalAttribute: state.survey.activePersonalAttribute
  }),
  {
    fetchQuestions,
    selectActiveQuestion,
    submitAnswers,
    saveAnswer,
    clearAnswers,
    clearErrors
  },
  (stateProps, dispatchProps, ownProps) => ({
    ...ownProps,
    ...stateProps,
    ...dispatchProps,
    saveAnswer: (answer) => {
      dispatchProps.saveAnswer({
        questionId: stateProps.activeQuestionId,
        personalAttribute: stateProps.personalAttribute,
        answer: answer
      });
    }
  })
)(Survey);

export default
keydown('up', 'down', 'right', 'left', 'enter', '1', '2', '3', '4', '5', 'a', 'b', 'c', 'd', 'e')(Survey);

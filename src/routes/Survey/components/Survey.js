import React, { Component } from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';
import keydown from 'react-keydown';
import Scroll from 'react-scroll';
import Question from './Question';
import Submit from './Submit';
import { browserHistory } from 'react-router';
import { fetchQuestions, selectActiveQuestion, saveAnswer, submitAnswers, clearAnswers, clearErrors,
resetProfileId } from '../modules/survey';
import Waypoint from 'react-waypoint';
import _ from 'lodash';
const Element = Scroll.Element;
const scroll = Scroll.scroller;
import './Survey.scss';

class Survey extends Component {
  static propTypes = {
    answers: React.PropTypes.object,
    questions: React.PropTypes.array,
    profileId: React.PropTypes.string,
    activeQuestionOrder: React.PropTypes.number.isRequired,
    fetchQuestions: React.PropTypes.func.isRequired,
    selectActiveQuestion: React.PropTypes.func.isRequired,
    saveAnswer: React.PropTypes.func.isRequired,
    saveActiveAnswer: React.PropTypes.func.isRequired,
    clearAnswers: React.PropTypes.func.isRequired,
    clearErrors: React.PropTypes.func.isRequired,
    activePersonalAttribute: React.PropTypes.string,
    keydown: React.PropTypes.shape({
      event: React.PropTypes.object
    }),
    submitAnswers: React.PropTypes.func.isRequired,
    params: React.PropTypes.shape({
      surveyId: React.PropTypes.string
    }),
    resetProfileId: React.PropTypes.func.isRequired,
    location: React.PropTypes.shape({
      query: React.PropTypes.shape({
        tags: React.PropTypes.string
      })
    })
  };

  ensureActiveQuestionVisible(name, smooth = true) {
    try {
      scroll.scrollTo(String(name), {
        duration: 500,
        smooth: smooth,
        offset: -(window.innerHeight / 2) + 150,
        ignoreCancelEvents: true
      });
      const scope = this;
      setTimeout(() => {
        scope.props.selectActiveQuestion(name);
        const input = this[`qn-${name}`].getWrappedInstance()._input;
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
      await this.props.selectActiveQuestion(this.props.activeQuestionOrder + 1);
    }	else if (['ArrowLeft', 'ArrowUp'].includes(event.key)) {
      await this.props.selectActiveQuestion(this.props.activeQuestionOrder - 1);
    } else {
      const activeQuestion = _.find(this.props.questions, { order: this.props.activeQuestionOrder });
      if (activeQuestion) {
        this.handleQuestionKeydown(event, activeQuestion);
      }
    }
    this.ensureActiveQuestionVisible(this.props.activeQuestionOrder);
  }

  async handleQuestionKeydown(event, activeQuestion) {
    if (['scale', 'mcq'].includes(activeQuestion.type)) {
      const chosenOption = _.find(activeQuestion.options, { order: parseInt(event.key) });
      if (chosenOption) {
        await this.props.saveActiveAnswer(chosenOption.value);
        setTimeout(this.ensureActiveQuestionVisible.bind(this, this.props.activeQuestionOrder + 1), 750);
      }
    }
  }

  componentWillMount() {
    this.props.resetProfileId();
    if (this.props.questions.length === 0) {
      this.props.fetchQuestions({
        surveyId: this.props.params.surveyId
      });
    }
  }

  componentDidMount() {
    if (this.props.questions.length) {
      this.ensureActiveQuestionVisible(this.props.activeQuestionOrder, false);
    }
  }

  componentDidUpdate() {
    if (this.props.profileId) {
      browserHistory.push(`/results/${this.props.profileId}`);
    }
    const tags = this.props.location.query.tags;
    if (this.props.questions.length && tags) {
      const tagQuestion = this.props.questions
        .filter(qn => qn.personalAttribute && qn.personalAttribute === 'tags')[0];
      if (this.props.answers[tagQuestion.id] || (this.props.answers[tagQuestion.id].answer !== tags)) {
        this.props.saveAnswer({
          questionId: tagQuestion.id,
          personalAttribute: tagQuestion.personalAttribute,
          answer: tags
        });
      }
    }
  }

  componentWillReceiveProps({ keydown }) {
    if (keydown.event && this.props.keydown.event !== keydown.event) {
      this.handleKeyDown(keydown.event);
    }
  }

  handleOnSubmit() {
    this.props.submitAnswers(this.props.params.surveyId);
  }

  async handleReset() {
    this.props.clearAnswers();
    this.props.clearErrors();
    await this.props.fetchQuestions({
      surveyId: this.props.params.surveyId
    });
    this.ensureActiveQuestionVisible(0, false);
  }

  render() {
    const { questions, activeQuestionOrder } = this.props;
    return (
      <div className="container text-center">
        {questions.length ?
          questions.map(qn => <Element name={String(qn.order)} key={qn.order}
                className={classnames({ 'inactive': qn.order !== activeQuestionOrder })}>
            {qn.survey === 1 && qn.order === 1 ? (<h1>Personal Particulars</h1>) : null}
            {qn.survey === 1 && qn.order === 13 ? (<h1>Questionnaire</h1>) : null}
            <Waypoint onEnter={this.props.selectActiveQuestion.bind(this, qn.order)} topOffset="25%" bottomOffset="40%">
              <div onClick={this.ensureActiveQuestionVisible.bind(this, qn.order)}>
                <Question {...qn} ref={c => this[`qn-${qn.order}`] = c} activeQuestionOrder={activeQuestionOrder}
                    active={qn.order === activeQuestionOrder}
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
    answers: state.survey.answers,
    questions: state.survey.questions,
    activeQuestionOrder: state.survey.activeQuestionOrder,
    activeQuestionId: state.survey.activeQuestionId,
    personalAttribute: state.survey.activePersonalAttribute,
    profileId: state.survey.profileId
  }),
  {
    fetchQuestions,
    selectActiveQuestion,
    submitAnswers,
    saveAnswer,
    clearAnswers,
    clearErrors,
    resetProfileId
  },
  (stateProps, dispatchProps, ownProps) => ({
    ...ownProps,
    ...stateProps,
    ...dispatchProps,
    saveActiveAnswer: (answer) => {
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

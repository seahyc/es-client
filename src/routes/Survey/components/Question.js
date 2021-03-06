import React, { Component } from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';
import { saveAnswer, saveError, addOption } from '../modules/survey';
import { SimpleSelect } from 'react-selectize';

async function chooseAnswer(answer, props, event) {
  if (props.active) {
    event.stopPropagation();
  }
  await props.saveAnswer(answer);
  setTimeout(() => {
    props.setAndScroll(props.order + 1);
  }, 750);
}
/* eslint-disable no-invalid-this */
export const VerticalOptions = props => (
  <div className="vertical-option-container">
    {props.options && props.options.length ? props.options.map(opt =>
      <div key={opt.id}
        className={classnames('left', { 'chosen': opt.value === props.answer }, 'options')}
        onClick={chooseAnswer.bind(this, opt.value, props)}>
        <span className="option-key">{opt.order}</span>
        <span className="option-label">{opt.label}</span>
      </div>
    ) : null}
  </div>
);
/* eslint-enable no-invalid-this */

VerticalOptions.propTypes = {
  active: React.PropTypes.bool,
  options: React.PropTypes.array.isRequired,
  answer: React.PropTypes.oneOfType([
    React.PropTypes.string,
    React.PropTypes.number,
    React.PropTypes.bool
  ]),
  saveAnswer: React.PropTypes.func.isRequired,
  order: React.PropTypes.number.isRequired,
  setAndScroll: React.PropTypes.func.isRequired
};

/* eslint-disable no-invalid-this */
export const HorizontalOptions = props => (
  <div className="horizontal-option-container">
    {props.options && props.options.length ? props.options.map(opt =>
      <div key={opt.id}
        className={classnames({ 'left': opt.order === 1 }, { 'chosen': opt.value === props.answer }, 'options')}
        onClick={chooseAnswer.bind(this, opt.value, props)}>
        <span className="option-key">{opt.order}</span>
        <span className="option-label">{opt.label}</span>
        {opt.text ? <span>
          <div className="line" />
          <span className="option-text">{opt.text}</span>
        </span> : null }
      </div>
    ) : null}
  </div>
);
/* eslint-enable no-invalid-this */

HorizontalOptions.propTypes = {
  active: React.PropTypes.bool,
  options: React.PropTypes.array.isRequired,
  answer: React.PropTypes.oneOfType([
    React.PropTypes.string,
    React.PropTypes.number,
    React.PropTypes.bool
  ]),
  saveAnswer: React.PropTypes.func.isRequired,
  order: React.PropTypes.number.isRequired
};

class Question extends Component {
  static propTypes = {
    question: React.PropTypes.string.isRequired,
    type: React.PropTypes.string.isRequired,
    options: React.PropTypes.array,
    active: React.PropTypes.bool,
    setAndScroll: React.PropTypes.func.isRequired,
    saveAnswerError: React.PropTypes.func.isRequired,
    regex: React.PropTypes.string,
    error: React.PropTypes.bool,
    errorMessage: React.PropTypes.string,
    activeQuestionOrder: React.PropTypes.number,
    order: React.PropTypes.number,
    id: React.PropTypes.number,
    answers: React.PropTypes.object,
    personalAttribute: React.PropTypes.string,
    saveAnswer: React.PropTypes.func.isRequired,
    answer: React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.number,
      React.PropTypes.bool
    ])
  };

  componentDidUpdate(prevProps) {
    if (this._input) {
      if (prevProps.active && !this.props.active) {
        this._input.blur();
      }
    }
  }

  validateAnswer(answer, regex) {
    const re = new RegExp(regex);
    return re.test(answer);
  }

  handleKeyDown(event) {
    if (['Enter', 'ArrowDown'].includes(event.key)) {
      this.props.setAndScroll(this.props.order + 1);
    } else if (event.key === 'ArrowUp') {
      this.props.setAndScroll(this.props.order - 1);
    }
  }

  handleInput(pastError, e) {
    this.props.saveAnswer(e.target.value);
    const currentError = !this.validateAnswer(e.target.value, this.props.regex);
    if (pastError !== currentError) {
      this.props.saveAnswerError(currentError);
    }
  }

  async handleDropDownSelect(selection) {
    if (selection) {
      if (selection.newOption && this.props.options.findIndex(opt => opt.value === selection.value) === -1) {
        await this.props.addOption(selection);
      }
      this.props.saveAnswer(selection.value);
      this.props.setAndScroll(this.props.order + 1);
    }
  }
  render() {
    const {
      question, type, options, answer = '', saveAnswer, active, order, setAndScroll, error,
      errorMessage = 'Please enter a valid answer'
    } = this.props;
    let RenderedQuestion;
    const selectedOption = options.filter(opt => opt.value === answer)[0];
    const selectedOption2 = options.filter(opt => opt.value === answer)[0];
    switch (type) {
    case 'scale':
      RenderedQuestion = (
        <HorizontalOptions {...{ options, answer, saveAnswer, active, order }}
                             setAndScroll={setAndScroll.bind(this)} />
        );
      break;
    case 'mcq':
      RenderedQuestion = (
        <VerticalOptions {...{ options, answer, saveAnswer, active, order }} setAndScroll={setAndScroll.bind(this)} />
        );
      break;
    case 'input':
      RenderedQuestion = (
        <div>
          <input className="borderless-input" onKeyDown={this.handleKeyDown.bind(this)}
              value={answer} onChange={this.handleInput.bind(this, error)} ref={c => this._input = c} />
          {error ? (
              answer ? <p className="message alert alert-danger">{errorMessage}</p> :
              <p className="message alert alert-danger">Please don't leave your answer blank</p>
            ) :
              <p className="message alert orange">Press <u>Enter</u> when done</p> }
        </div>
        );
      break;
    case 'dropdown':
      RenderedQuestion = (
        <SimpleSelect className="borderless-input" ref={c => this._input = c} options={options} theme="material"
            renderResetButton={() => (<div />)} value={selectedOption}
            onValueChange={this.handleDropDownSelect.bind(this)} />
        );
      break;
    case 'dropdown-others':
      RenderedQuestion = (
        <SimpleSelect className="borderless-input" ref={c => this._input = c} options={options} theme="material"
            renderResetButton={() => (<div />)}
            createFromSearch={(options, search) => ({ label: search, value: search })}
            renderOption={arg => {
              let label, newOption, selectable;
              if (arg !== null) {
                label = arg.label;
                newOption = arg.newOption;
                selectable = arg.selectable;
              }
              const isSelectable = (typeof selectable === 'undefined' || selectable) && (label);
              return (
                <div className={`simple-option ${isSelectable ? '' : 'not-selectable'}`}>
                  <span>{newOption ? (label ? `Others: ${label}` : 'Others: Type in your answer') : label}</span>
                </div>
              );
            }}
            value={selectedOption2} onValueChange={this.handleDropDownSelect.bind(this)} />
        );
      break;
    }
    return (
      <div className={classnames('question-container', { 'error-question': error },
        { 'short-question': ['input'].includes(type) }, { 'tall-question': type === 'mcq' && options.length > 5 })}>
        <p className="question text-left">{question}</p>
        {RenderedQuestion}
      </div>
    );
  }
}
Question = connect(
  (state, props) => ({
    answer: state.survey.answers[props.id] ? state.survey.answers[props.id].answer : '',
    error: state.survey.errors[props.id]
  }),
  (dispatch, props) => ({
    saveAnswer: answer => {
      if (props.active) {
        dispatch(saveAnswer({
          questionId: props.id,
          personalAttribute: props.personalAttribute,
          answer: answer
        }));
      }
    },
    saveAnswerError: error => {
      if (props.active) {
        dispatch(saveError({
          questionId: props.id,
          error: error
        }));
      }
    },
    addOption: option => {
      if (props.active) {
        dispatch(addOption({
          questionId: props.id,
          option: option
        }));
      }
    }
  }),
  null,
  { withRef: true }
)(Question);

export default (Question);

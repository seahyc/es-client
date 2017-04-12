import _ from 'lodash';

const apiHost = process.env.API_HOST;

export const REQUEST_QUESTIONS = 'REQUEST_QUESTIONS';
export const RECEIVE_QUESTIONS = 'RECEIVE_QUESTIONS';
export const FETCH_QUESTIONS_FAILURE = 'FETCH_QUESTIONS_FAILURE';
export const SUBMITTING_ANSWERS = 'SUBMITTING_ANSWERS';
export const SUBMITTED_ANSWERS = 'SUBMITTED_ANSWERS';
export const SUBMIT_ANSWERS_FAILURE = 'SUBMIT_ANSWERS_FAILURE';
export const SELECT_ACTIVE_QUESTION = 'SELECT_ACTIVE_QUESTION';
export const SAVE_ANSWER = 'SAVE_ANSWER';
export const CLEAR_ANSWERS = 'CLEAR_ANSWERS';
export const CLEAR_ERRORS = 'CLEAR_ERRORS';
export const SAVE_ERROR = 'SAVE_ERROR';
export const ADD_OPTION = 'ADD_OPTION';

// ------------------------------------
// Actions
// ------------------------------------
export function requestQuestions() {
  return {
    type: REQUEST_QUESTIONS
  };
}

export function receiveQuestions(json) {
  return {
    type: RECEIVE_QUESTIONS,
    payload: json
  };
}

export function fetchQuestionsFailure(error) {
  return {
    type: FETCH_QUESTIONS_FAILURE,
    payload: error
  };
}

export function submitAnswersFailure(error) {
  return {
    type: SUBMIT_ANSWERS_FAILURE,
    payload: error
  };
}

export function saveError(error) {
  return {
    type: SAVE_ERROR,
    payload: error
  };
}

export function clearAnswers() {
  return {
    type: CLEAR_ANSWERS
  };
}

export function clearErrors() {
  return {
    type: CLEAR_ERRORS
  };
}

export function submittingAnswers() {
  return {
    type: SUBMITTING_ANSWERS
  };
}

export function submittedAnswers() {
  return {
    type: SUBMITTED_ANSWERS
  };
}

export const submitAnswers = () => (dispatch, getState) => new Promise(() => {
  dispatch(submittingAnswers());
  fetch(`${apiHost}/answers`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      surveyId: 1,
      responses: getState().survey.answers
    })
  })
  .then(() => {
    dispatch(submittedAnswers());
  })
  .catch(err => {
    dispatch(submitAnswersFailure(err));
  });
});

export function selectActiveQuestion(questionId) {
  return {
    type: SELECT_ACTIVE_QUESTION,
    payload: questionId
  };
}

export function saveAnswer(answer) {
  return {
    type: SAVE_ANSWER,
    payload: answer
  };
}

export function addOption(option) {
  return {
    type: ADD_OPTION,
    payload: option
  };
}

export const fetchQuestions = () => dispatch => {
  dispatch(requestQuestions());
  return new Promise(() => fetch(`${apiHost}/questions`)
      .then(res => res.json()
        .then(response => dispatch(receiveQuestions(response))))
      .catch(err => {
        dispatch(fetchQuestionsFailure(err));
      }));
};

export const actions = {
  requestQuestions,
  receiveQuestions,
  saveError,
  submittingAnswers,
  submittedAnswers,
  selectActiveQuestion,
  fetchQuestions,
  saveAnswer,
  addOption,
  clearErrors,
  clearAnswers
};
// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [REQUEST_QUESTIONS]: state => ({
    ...state,
    fetching: true
  }),
  [RECEIVE_QUESTIONS]: (state, action) => ({
    ...state,
    questions: action.payload,
    fetching: false
  }),
  [FETCH_QUESTIONS_FAILURE]: (state, action) => ({
    ...state,
    fetching: false,
    fetchError: action.payload
  }),
  [SUBMIT_ANSWERS_FAILURE]: (state, action) => ({
    ...state,
    submitting: false,
    submitted: false,
    submitError: action.payload
  }),
  [SELECT_ACTIVE_QUESTION]: (state, action) => {
    let payload = action.payload;
    const numberOfQuestions = state.questions.length;
    if (action.payload < 1) {
      payload = 1;
    } else if (action.payload > numberOfQuestions) {
      payload = numberOfQuestions;
    }
    return {
      ...state,
      activeQuestionId: payload,
      activePersonalAttribute: _.find(state.questions, { order: payload }).personalAttribute
    };
  },
  [SUBMITTING_ANSWERS]: state => ({
    ...state,
    submitting: true
  }),
  [SUBMITTING_ANSWERS]: state => ({
    ...state,
    submitting: false,
    submitted: true
  }),
  [SAVE_ANSWER]: (state, action) => ({
    ...state,
    answers: {
      ...state.answers,
      [action.payload.questionId]: {
        answer: action.payload.answer,
        personalAttribute: action.payload.personalAttribute
      }
    }
  }),
  [CLEAR_ANSWERS]: state => ({
    ...state,
    answers: {}
  }),
  [SAVE_ERROR]: (state, action) => ({
    ...state,
    errors: {
      ...state.errors,
      [action.payload.questionId]: action.payload.error
    }
  }),
  [CLEAR_ERRORS]: state => ({
    ...state,
    errors: {}
  }),
  [ADD_OPTION]: (state, action) => ({
    ...state,
    questions: state.questions.map(qn => {
      if (qn.order === action.payload.questionId && Array.isArray(qn.options)) {
        qn.options.push(action.payload.option);
      }
      return qn;
    })
  })
};

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  title: null,
  questions: [],
  activeQuestionId: 0,
  activePersonalAttribute: '',
  answers: {},
  errors: {}
};

export default function surveyReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type];

  return handler ? handler(state, action) : state;
}

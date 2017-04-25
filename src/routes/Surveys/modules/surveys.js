const apiHost = process.env.API_HOST;

export const REQUEST_SURVEYS = 'REQUEST_SURVEYS';
export const RECEIVE_SURVEYS = 'RECEIVE_SURVEYS';
export const FETCH_SURVEYS_FAILURE = 'FETCH_SURVEYS_FAILURE';

// ------------------------------------
// Actions
// ------------------------------------
export function requestSurveys() {
  return {
    type: REQUEST_SURVEYS
  };
}

export function receiveSurveys(surveys) {
  return {
    type: RECEIVE_SURVEYS,
    payload: surveys
  };
}

export function fetchSurveysFailure(error) {
  return {
    type: FETCH_SURVEYS_FAILURE,
    payload: error
  };
}

export const fetchSurveys = () => dispatch => {
  dispatch(requestSurveys());
  return new Promise(() => fetch(`${apiHost}/surveys`)
      .then(res => {
        if (res.status !== 200) {
          throw 'Cannot fetch surveys';
        }
        return res.json();
      })
      .then(response => dispatch(receiveSurveys(response)))
      .catch(err => {
        dispatch(fetchSurveysFailure(err));
      }));
};

export const actions = {
  requestSurveys,
  receiveSurveys,
  fetchSurveysFailure,
  fetchSurveys
};
// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [REQUEST_SURVEYS]: state => ({
    ...state,
    fetching: true
  }),
  [RECEIVE_SURVEYS]: (state, action) => ({
    ...state,
    surveys: action.payload,
    fetching: false
  }),
  [FETCH_SURVEYS_FAILURE]: (state, action) => ({
    ...state,
    fetching: false,
    fetchError: action.payload
  })
};

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  surveys: []
};

export default function surveysReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type];

  return handler ? handler(state, action) : state;
}

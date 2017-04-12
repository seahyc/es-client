const apiHost = process.env.API_HOST;
export const UPDATE_EMAIL = 'UPDATE_EMAIL';
export const UPDATE_PASSWORD = 'UPDATE_PASSWORD';
export const REQUEST_TOKEN = 'REQUEST_TOKEN';
export const LOGIN_FAILURE = 'LOGIN_FAILURE';
export const RECEIVE_TOKEN = 'RECEIVE_TOKEN';

// ------------------------------------
// Actions
// ------------------------------------
export function updateEmail(email) {
  return {
    type: UPDATE_EMAIL,
    payload: email
  };
}

export function updatePassword(password) {
  return {
    type: UPDATE_PASSWORD,
    payload: password
  };
}

export function requestToken() {
  return {
    type: REQUEST_TOKEN
  };
}

export function loginFailure(error) {
  return {
    type: LOGIN_FAILURE,
    payload: error
  };
}

export function receiveToken(token) {
  return {
    type: RECEIVE_TOKEN,
    payload: token
  };
}

export const login = () => (dispatch, getState) => new Promise(() => {
  dispatch(requestToken());
  fetch(`${apiHost}/login`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email: getState().login.email,
      password: getState().login.password
    })
  }).then(token => {
    dispatch(updatePassword(''));
    dispatch(receiveToken(token));
  })
  .catch(err => {
    dispatch(loginFailure(err));
  });
});

export const actions = {
  updateEmail,
  updatePassword,
  requestToken,
  loginFailure,
  receiveToken,
  login
};
// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [UPDATE_EMAIL]: (state, action) => ({
    ...state,
    email: action.payload
  }),
  [UPDATE_PASSWORD]: (state, action) => ({
    ...state,
    password: action.payload
  }),
  [REQUEST_TOKEN]: state => ({
    ...state,
    requesting: true
  }),
  [LOGIN_FAILURE]: (state, action) => ({
    ...state,
    requesting: false,
    error: action.payload
  }),
  [RECEIVE_TOKEN]: (state, action) => ({
    ...state,
    token: action.payload
  })
};

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  email: '',
  password: '',
  error: '',
  token: ''
};

export default function loginReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type];

  return handler ? handler(state, action) : state;
}

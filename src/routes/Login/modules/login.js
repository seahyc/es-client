const apiHost = process.env.API_HOST;
import jwt from 'jwt-decode';
export const UPDATE_EMAIL = 'UPDATE_EMAIL';
export const UPDATE_PASSWORD = 'UPDATE_PASSWORD';
export const REQUEST_TOKEN = 'REQUEST_TOKEN';
export const UPDATE_ERROR = 'UPDATE_ERROR';
export const RECEIVE_TOKEN = 'RECEIVE_TOKEN';
export const LOGOUT = 'LOGOUT';

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

export function updateError(error) {
  return {
    type: UPDATE_ERROR,
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
      'Accept': 'text/html',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email: getState().login.email,
      password: getState().login.password
    })
  })
  .then(res => {
    if (res.status !== 200) {
      throw 'Invalid email or password';
    }
    return res.text();
  })
  .then(token => {
    try {
      jwt(token);
    } catch (e) {
      throw 'Invalid email or password';
    }
    dispatch(updatePassword(''));
    dispatch(updateError(''));
    dispatch(receiveToken(token));
  })
  .catch(err => {
    dispatch(updateError(err));
  });
});

export function logout() {
  return {
    type: LOGOUT
  };
}

export const actions = {
  updateEmail,
  updatePassword,
  requestToken,
  updateError,
  receiveToken,
  login,
  logout
};
// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [UPDATE_EMAIL]: (state, action) => ({
    ...state,
    email: action.payload,
    error: ''
  }),
  [UPDATE_PASSWORD]: (state, action) => ({
    ...state,
    password: action.payload,
    error: ''
  }),
  [REQUEST_TOKEN]: state => ({
    ...state,
    requesting: true
  }),
  [UPDATE_ERROR]: (state, action) => ({
    ...state,
    requesting: false,
    error: action.payload
  }),
  [RECEIVE_TOKEN]: (state, action) => ({
    ...state,
    token: action.payload
  }),
  [LOGOUT]: state => ({
    ...state,
    token: ''
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

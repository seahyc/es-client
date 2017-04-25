const apiHost = process.env.API_HOST;

export const REQUEST_USER = 'REQUEST_USER';
export const RECEIVE_USER = 'RECEIVE_USER';
export const FETCH_USER_FAILURE = 'FETCH_USER_FAILURE';
export const REQUEST_PROFILE = 'REQUEST_PROFILE';
export const RECEIVE_PROFILE = 'RECEIVE_PROFILE';
export const FETCH_PROFILE_FAILURE = 'FETCH_PROFILE_FAILURE';
export const SELECT_ACTIVE_PROFILE = 'SELECT_ACTIVE_PROFILE';

// ------------------------------------
// Actions
// ------------------------------------

export function selectActiveProfile(profileId) {
  return {
    type: SELECT_ACTIVE_PROFILE,
    payload: profileId
  };
}

export function requestProfile() {
  return {
    type: REQUEST_PROFILE
  };
}

export function receiveProfile(profile) {
  return {
    type: RECEIVE_PROFILE,
    payload: profile
  };
}

export function fetchProfileFailure(error) {
  return {
    type: FETCH_PROFILE_FAILURE,
    payload: error
  };
}

export const fetchProfile = profileId => (dispatch, getState) => {
  if (!getState().profile.profiles[profileId]) {
    dispatch(requestProfile());
    return new Promise(() => fetch(`${apiHost}/profiles/${profileId}`)
      .then(res => {
        if (res.status !== 200) {
          throw 'No such profile';
        }
        return res.json();
      })
      .then(response => dispatch(receiveProfile(response)))
      .catch(err => {
        dispatch(fetchProfileFailure(err));
      }));
  }
};

export function requestUser() {
  return {
    type: REQUEST_USER
  };
}

export function receiveUser(user) {
  return {
    type: RECEIVE_USER,
    payload: user
  };
}

export function fetchUserFailure(error) {
  return {
    type: FETCH_USER_FAILURE,
    payload: error
  };
}

export const fetchUser = userId => (dispatch, getState) => {
  dispatch(requestUser());
  return new Promise(() => fetch(`${apiHost}/users/${userId}?include=[{"resource":"profiles", 
  "options": {"select":["id", "createdAt"]}}]`, {
    headers: {
      'Authorization': getState().login.token
    }
  })
      .then(res => {
        if (res.status !== 200) {
          throw 'No such user';
        }
        return res.json();
      })
      .then(response => dispatch(receiveUser(response)))
      .catch(err => {
        dispatch(fetchUserFailure(err));
      }));
};

export const actions = {
  requestUser,
  receiveUser,
  fetchUserFailure,
  fetchUser,
  requestProfile,
  receiveProfile,
  fetchProfileFailure,
  fetchProfile
};
// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [SELECT_ACTIVE_PROFILE]: (state, action) => ({
    ...state,
    activeProfileId: action.payload
  }),
  [REQUEST_USER]: state => ({
    ...state,
    fetching: true
  }),
  [RECEIVE_USER]: (state, action) => ({
    ...state,
    user: action.payload,
    fetching: false
  }),
  [FETCH_USER_FAILURE]: (state, action) => ({
    ...state,
    fetching: false,
    fetchError: action.payload,
    profiles: {},
    user: {},
    activeProfileId: ''
  }),
  [REQUEST_PROFILE]: state => ({
    ...state,
    fetching: true
  }),
  [RECEIVE_PROFILE]: (state, action) => ({
    ...state,
    profiles: {
      ...state.profiles,
      [action.payload[0].profileId]: action.payload
    },
    fetching: false
  }),
  [FETCH_PROFILE_FAILURE]: (state, action) => ({
    ...state,
    fetching: false,
    fetchError: action.payload
  })
};

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  user: {},
  profiles: {},
  activeProfileId: ''
};

export default function userReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type];

  return handler ? handler(state, action) : state;
}

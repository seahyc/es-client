const apiHost = process.env.API_HOST;

export const REQUEST_PROFILE = 'REQUEST_PROFILE';
export const RECEIVE_PROFILE = 'RECEIVE_PROFILE';
export const FETCH_PROFILE_FAILURE = 'FETCH_PROFILE_FAILURE';

// ------------------------------------
// Actions
// ------------------------------------
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

export const fetchProfile = profileId => dispatch => {
  dispatch(requestProfile());
  return new Promise(() => fetch(`${apiHost}/profiles/${profileId}?include=[{"resource": "profileOwner"}]`)
      .then(res => {
        if (res.status !== 200) {
          throw 'No such profile!';
        }
        return res.json();
      })
      .then(response => dispatch(receiveProfile(response)))
      .catch(err => {
        dispatch(fetchProfileFailure(err));
      }));
};

export const actions = {
  requestProfile,
  receiveProfile,
  fetchProfileFailure,
  fetchProfile
};
// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [REQUEST_PROFILE]: state => ({
    ...state,
    fetching: true
  }),
  [RECEIVE_PROFILE]: (state, action) => ({
    ...state,
    profile: action.payload,
    fetching: false
  }),
  [FETCH_PROFILE_FAILURE]: (state, action) => ({
    ...state,
    fetching: false,
    fetchError: action.payload,
    profile: []
  })
};

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  profile: []
};

export default function profileReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type];

  return handler ? handler(state, action) : state;
}

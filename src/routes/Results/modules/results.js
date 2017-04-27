const apiHost = process.env.API_HOST;

export const REQUEST_USERS = 'REQUEST_USERS';
export const RECEIVE_USERS = 'RECEIVE_USERS';
export const FETCH_USERS_FAILURE = 'FETCH_USERS_FAILURE';
export const SET_DATA = 'SET_DATA';
export const SET_QUERY = 'SET_QUERY';
export const SET_COLUMN_WIDTH = 'SET_COLUMN_WIDTH';

// ------------------------------------
// Actions
// ------------------------------------
export function setColumnWidth(payload) {
  return {
    type: SET_COLUMN_WIDTH,
    payload: payload
  };
}

export function setQuery(query) {
  return {
    type: SET_QUERY,
    payload: query
  };
}

export function requestUsers() {
  return {
    type: REQUEST_USERS
  };
}

export function receiveUsers(users) {
  return {
    type: RECEIVE_USERS,
    payload: users
  };
}

export function fetchUsersFailure(error) {
  return {
    type: FETCH_USERS_FAILURE,
    payload: error
  };
}

export const fetchUsers = () => (dispatch, getState) => {
  dispatch(requestUsers());
  return new Promise(() => fetch(`${apiHost}/users?where={"type":"responder"}`, {
    headers: {
      'Authorization': getState().login.token
    }
  })
      .then(res => {
        if (res.status !== 200) {
          throw 'Error fetching users';
        }
        return res.json();
      })
      .then(response => dispatch(receiveUsers(response)))
      .catch(err => {
        dispatch(fetchUsersFailure(err));
      }));
};

export function setData(data) {
  return {
    type: SET_DATA,
    payload: data
  };
}

export const actions = {
  setQuery,
  requestUsers,
  receiveUsers,
  fetchUsersFailure,
  fetchUsers,
  setData,
  setColumnWidth
};
// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [SET_QUERY]: (state, action) => ({
    ...state,
    query: action.payload
  }),
  [REQUEST_USERS]: state => ({
    ...state,
    fetching: true
  }),
  [RECEIVE_USERS]: (state, action) => {
    const users = action.payload.map(user => {
      user.noOfResponses = user.profiles.length;
      user.lastResponseDate = user.updatedAt;
      return user;
    });
    return {
      ...state,
      users: users,
      data: users,
      fetching: false
    };
  },
  [FETCH_USERS_FAILURE]: (state, action) => ({
    ...state,
    fetching: false,
    fetchError: action.payload
  }),
  [SET_DATA]: (state, action) => ({
    ...state,
    data: action.payload
  }),
  [SET_COLUMN_WIDTH]: (state, action) => ({
    ...state,
    columnWidths: {
      ...state.columnWidths,
      [action.payload.columnKey]: action.payload.newColumnWidth
    }
  })
};

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  users: [],
  data: [],
  columnWidths: {},
  query: ''
};

export default function usersReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type];

  return handler ? handler(state, action) : state;
}

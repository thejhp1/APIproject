import { csrfFetch } from "./csrf";

// constant to avoid debugging typos
const SET_USER = "session/setUser";
const REMOVE_USER = "session/removeUser";

// regular action creator
const setUser = (user) => {
  return {
    type: SET_USER,
    payload: user,
  };
};

const removeUser = () => {
  return {
    type: REMOVE_USER,
  };
};

// thunk action creator
export const login = (user) => async (dispatch) => {
  const { credential, password } = user;
  try {
    const response = await csrfFetch("/api/session", {
      method: "POST",
      body: JSON.stringify({
        credential,
        password,
      }),
    });
    const data = await response.json();
    if (response.ok === true) {
      dispatch(setUser(data.user));
    }
  } catch (error) {
    const data = await error.json();
    throw data;
  }
};

export const restoreUser = () => async (dispatch) => {
  const response = await csrfFetch("/api/session");
  const data = await response.json();
  dispatch(setUser(data.user));
  return response;
};

export const signup = (user) => async (dispatch) => {
  const { username, firstName, lastName, email, password } = user;
  try {
    const response = await csrfFetch("/api/users", {
      method: "POST",
      body: JSON.stringify({
        username,
        firstName,
        lastName,
        email,
        password,
      }),
    });
    const data = await response.json();
    if (response.ok === true) {
      dispatch(setUser(data.user));
    }
    return response;
  } catch (error) {
    const data = await error.json();
    throw data;
  }
};

export const logout = () => async (dispatch) => {
  const response = await csrfFetch("/api/session", {
    method: "DELETE",
  });
  dispatch(removeUser());
  return response;
};

// state object
const initialState = { user: null };

// reducer
const sessionReducer = (state = initialState, action) => {
  let newState;
  switch (action.type) {
    case SET_USER:
      newState = Object.assign({}, state);
      newState.user = action.payload;
      return newState;
    case REMOVE_USER:
      newState = Object.assign({}, state);
      newState.user = null;
      return newState;
    default:
      return state;
  }
};

export default sessionReducer;

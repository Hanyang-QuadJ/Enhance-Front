import { ServerEndPoint } from "../Configs/Server";

export const SUCCEED_TO_GET_ME = "SUCCEED_TO_GET_ME";
export const FAILED_TO_GET_ME = "FAILED_TO_GET_ME";

export const SUCCEED_TO_UPDATE_USERNAME = "SUCCEED_TO_UPDATE_USERNAME";
export const FAILED_TO_UPDATE_USERNAME = "FAILED_TO_UPDATE_USERNAME";

export const SUCCEED_TO_SIGNIN = "SUCCEED_TO_SIGNIN";
export const FAILED_TO_SIGNIN = "FAILED_TO_SIGNIN";

export const SUCCEED_TO_SIGNUP = "SUCCEED_TO_SIGNUP";
export const FAILED_TO_SIGNUP = "FAILED_TO_SIGNUP";

export const SUCCEED_TO_SIGNOUT = "SUCCEED_TO_SIGNOUT";

export const getMe = params => {
  return async dispatch => {
    try {
      let response = await fetch(ServerEndPoint + "api/auth/me", {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "x-access-token": params
        }
      });
      let responseJson = await response.json();
      await dispatch({
        type: SUCCEED_TO_GET_ME,
        payload: responseJson.me[0]
      });
      return responseJson.me[0];
    } catch (error) {
      dispatch({
        type: FAILED_TO_GET_ME,
        payload: { data: "NETWORK_ERROR" }
      });
    }
  };
};

export const postSignUp = params => {
  return async dispatch => {
    try {
      let response = await fetch(ServerEndPoint + "api/auth/register", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: params.email,
          password: params.password,
          username: params.username
        })
      });
      let responseJson = await response.json();
      await dispatch({
        type: SUCCEED_TO_SIGNUP,
        payload: responseJson.token
      });
      return responseJson.token;
    } catch (error) {
      dispatch({
        type: FAILED_TO_SIGNUP,
        payload: { data: "NETWORK_ERROR" }
      });
    }
  };
};

export const postSignIn = params => {
  return async dispatch => {
    try {
      let response = await fetch(ServerEndPoint + "api/auth/login", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: params.email,
          password: params.password
        })
      });
      if (response.status === 406) {
        await dispatch({
          type: FAILED_TO_SIGNIN,
          payload: null
        });
        return "failed";
      } else {
        let responseJson = await response.json();
        console.log(responseJson);
        await dispatch({
          type: SUCCEED_TO_SIGNIN,
          payload: responseJson.token
        });
        return responseJson.token;
      }
    } catch (error) {
      dispatch({
        type: FAILED_TO_SIGNIN,
        payload: { data: "NETWORK_ERROR" }
      });
    }
  };
};

export const updateUsername = params => {
  return async dispatch => {
    try {
      let response = await fetch(ServerEndPoint + "api/user", {
        method: "PATCH",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "x-access-token": params.token
        },
        body: JSON.stringify({
          username: params.username
        })
      });
      let responseJson = await response.json();
      await dispatch({
        type: SUCCEED_TO_UPDATE_USERNAME,
        payload: params.username
      });
      return "succeed";
    } catch (error) {
      dispatch({
        type: FAILED_TO_UPDATE_USERNAME,
        payload: { data: "NETWORK_ERROR" }
      });
    }
  };
};

export const signOut = () => {
  return async dispatch => {
    dispatch({
      type: SUCCEED_TO_SIGNOUT
    });
    return "signOut";
  };
};

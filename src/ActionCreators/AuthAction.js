import { ServerEndPoint } from "../Configs/Server";

export const SUCCEED_TO_GET_ME = "SUCCEED_TO_GET_ME";
export const FAILED_TO_GET_ME = "FAILED_TO_GET_ME";

export const SUCCEED_TO_UPDATE_EMAIL = "SUCCEED_TO_UPDATE_EMAIL";
export const FAILED_TO_UPDATE_EMAIL = "FAILED_TO_UPDATE_EMAIL";

export const SUCCEED_TO_UPDATE_USERNAME = "SUCCEED_TO_UPDATE_USERNAME";
export const FAILED_TO_UPDATE_USERNAME = "FAILED_TO_UPDATE_USERNAME";

export const SUCCEED_TO_UPDATE_PROFILE = "SUCCEED_TO_UPDATE_PROFILE";
export const FAILED_TO_UPDATE_PROFILE = "FAILED_TO_UPDATE_PROFILE";

export const SUCCEED_TO_UPDATE_PASSWORD = "SUCCEED_TO_UPDATE_PASSWORD";
export const FAILED_TO_UPDATE_PASSWORD = "FAILED_TO_UPDATE_PASSWORD";

export const SUCCEED_TO_GET_TEMP_PASSWORD = "SUCCEED_TO_GET_TEMP_PASSWORD";
export const FAILED_TO_GET_TEMP_PASSWORD = "FAILED_TO_GET_TEMP_PASSWORD";

export const SUCCEED_TO_DELETE_USER = "SUCCEED_TO_DELETE_USER";
export const FAILED_TO_DELETE_USER = "FAILED_TO_DELETE_USER";

export const SUCCEED_TO_POST_COIN = "SUCCEED_TO_POST_COIN";
export const FAILED_TO_POST_COIN = "FAILED_TO_POST_COIN";

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
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: params.email,
          password: params.password,
          username: params.username
        })
      });
      let responseJson = await response.json();

      if (response.status === 406) {
        await dispatch({
          type: FAILED_TO_SIGNUP,
          payload: responseJson
        });
        return responseJson.message;
      } else {
        await dispatch({
          type: SUCCEED_TO_SIGNUP,
          payload: responseJson.token
        });
        return responseJson.token;
      }
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
          "Access-Control-Allow-Origin": "*",
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
          "Access-Control-Allow-Origin": "*",
          "x-access-token": params.token
        },
        body: JSON.stringify({
          username: params.username
        })
      });
      let responseJson = await response.json();
      if (response.status === 406) {
        await dispatch({
          type: FAILED_TO_UPDATE_USERNAME,
          payload: params.username
        });
        return "failed";
      } else {
        await dispatch({
          type: SUCCEED_TO_UPDATE_USERNAME,
          payload: params.username
        });
        return "succeed";
      }
    } catch (error) {
      dispatch({
        type: FAILED_TO_UPDATE_USERNAME,
        payload: { data: "NETWORK_ERROR" }
      });
    }
  };
};

export const updatePassword = params => {
  return async dispatch => {
    try {
      let response = await fetch(ServerEndPoint + "api/user/password", {
        method: "PATCH",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "x-access-token": params.token
        },
        body: JSON.stringify({
          old_password: params.old_password,
          new_password: params.new_password
        })
      });
      let responseJson = await response.json();
      if (response.status === 406) {
        await dispatch({
          type: FAILED_TO_UPDATE_PASSWORD,
          payload: responseJson
        });
        return "failed";
      } else {
        await dispatch({
          type: SUCCEED_TO_UPDATE_PASSWORD,
          payload: responseJson
        });
        return "succeed";
      }
    } catch (error) {
      dispatch({
        type: FAILED_TO_UPDATE_PASSWORD,
        payload: { data: "NETWORK_ERROR" }
      });
    }
  };
};

export const findPassword = params => {
  return async dispatch => {
    try {
      let response = await fetch(
        ServerEndPoint + `api/user/verify?email=${params.email}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
          }
        }
      );
      let responseJson = await response.json();
      await dispatch({
        type: SUCCEED_TO_GET_TEMP_PASSWORD,
        payload: responseJson
      });
      return "succeed";
    } catch (error) {
      dispatch({
        type: FAILED_TO_GET_TEMP_PASSWORD,
        payload: { data: "NETWORK_ERROR" }
      });
    }
  };
};

export const updateProfile = params => {
  return async dispatch => {
    try {
      let response = await fetch(ServerEndPoint + "api/user/profile", {
        method: "PATCH",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "x-access-token": params.token
        },
        body: JSON.stringify({
          base64: params.base64
        })
      });
      let responseJson = await response.json();
      await dispatch({
        type: SUCCEED_TO_UPDATE_PROFILE,
        payload: params.base64
      });
      return "succeed";
    } catch (error) {
      dispatch({
        type: FAILED_TO_UPDATE_PROFILE,
        payload: { data: "NETWORK_ERROR" }
      });
    }
  };
};

export const postCoin = params => {
  return async dispatch => {
    try {
      let response = await fetch(ServerEndPoint + "api/admin/coin", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "x-access-token": params.token
        },
        body: JSON.stringify({
          kor: params.kor,
          full: params.full,
          abbr: params.abbr,
          keyword: params.keyword
        })
      });
      let responseJson = await response.json();
      if (response.status === 404) {
        await dispatch({
          type: FAILED_TO_POST_COIN,
          payload: "FAILED"
        });
        return "failed";
      } else {
        await dispatch({
          type: SUCCEED_TO_POST_COIN,
          payload: responseJson
        });
        return responseJson;
      }
    } catch (error) {
      dispatch({
        type: FAILED_TO_POST_COIN,
        payload: { data: "NETWORK_ERROR" }
      });
    }
  };
};

export const updateEmail = params => {
  return async dispatch => {
    try {
      let response = await fetch(ServerEndPoint + "api/user/email", {
        method: "PATCH",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "x-access-token": params.token
        },
        body: JSON.stringify({
          email: params.email
        })
      });
      let responseJson = await response.json();
      if (response.status === 404) {
        await dispatch({
          type: FAILED_TO_UPDATE_EMAIL,
          payload: "FAILED"
        });
        return "failed";
      } else {
        await dispatch({
          type: SUCCEED_TO_UPDATE_EMAIL,
          payload: params.email
        });
        return "succeed";
      }
    } catch (error) {
      dispatch({
        type: FAILED_TO_UPDATE_EMAIL,
        payload: { data: "NETWORK_ERROR" }
      });
    }
  };
};

export const deleteUser = params => {
  return async dispatch => {
    try {
      let response = await fetch(ServerEndPoint + "api/admin/user", {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "x-access-token": params.token
        },
        body: JSON.stringify({
          username: params.username
        })
      });
      let responseJson = await response.json();
      if (response.status === 404) {
        await dispatch({
          type: FAILED_TO_DELETE_USER,
          payload: "FAILED"
        });
        return "failed";
      } else {
        await dispatch({
          type: SUCCEED_TO_DELETE_USER,
          payload: responseJson
        });
        return "succeed";
      }
    } catch (error) {
      dispatch({
        type: FAILED_TO_DELETE_USER,
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

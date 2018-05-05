import { ServerEndPoint } from "../Configs/Server";

export const SUCCEED_TO_GET_ALL_FORUM = "SUCCEED_TO_GET_ALL_FORUM";
export const FAILED_TO_GET_ALL_FORUM = "FAILED_TO_GET_ALL_FORUM";

export const SUCCEED_TO_POST_FORUM = "SUCCEED_TO_POST_FORUM";
export const FAILED_TO_POST_FORUM = "FAILED_TO_POST_FORUM";

export const getAllForums = () => {
  return async dispatch => {
    try {
      let response = await fetch(ServerEndPoint + "api/forum/all", {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        }
      });
      let responseJson = await response.json();
      await dispatch({
        type: SUCCEED_TO_GET_ALL_FORUM,
        payload: responseJson.forums
      });
      return responseJson.forums;
    } catch (error) {
      dispatch({
        type: FAILED_TO_GET_ALL_FORUM,
        payload: { data: "NETWORK_ERROR" }
      });
    }
  };
};

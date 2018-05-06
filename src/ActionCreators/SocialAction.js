import { ServerEndPoint } from "../Configs/Server";

export const SUCCEED_TO_GET_ALL_FORUM = "SUCCEED_TO_GET_ALL_FORUM";
export const FAILED_TO_GET_ALL_FORUM = "FAILED_TO_GET_ALL_FORUM";

export const SUCCEED_TO_POST_FORUM = "SUCCEED_TO_POST_FORUM";
export const FAILED_TO_POST_FORUM = "FAILED_TO_POST_FORUM";

export const SUCCEED_TO_GET_ONE_FORUM = "SUCCEED_TO_GET_ONE_FORUM";
export const FAILED_TO_GET_ONE_FORUM = "FAILED_TO_GET_ONE_FORUM";

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

export const getOneForum = params => {
  return async dispatch => {
    try {
      let response = await fetch(
        ServerEndPoint + `api/forum/one?forum_id=${params.forum_id}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "x-access-token": params.token
          }
        }
      );
      let responseJson = await response.json();
      await dispatch({
        type: SUCCEED_TO_GET_ONE_FORUM,
        payload: responseJson.result[0]
      });
      return responseJson.result[0];
    } catch (error) {
      dispatch({
        type: FAILED_TO_GET_ONE_FORUM,
        payload: { data: "NETWORK_ERROR" }
      });
    }
  };
};

export const postForum = params => {
  return async dispatch => {
    try {
      let response = await fetch(ServerEndPoint + "api/forum/create", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "x-access-token": params.token
        },
        body: JSON.stringify({
          coin_list: params.coins,
          category: params.category,
          title: params.title,
          content: params.content
        })
      });
      let responseJson = await response.json();
      await dispatch({
        type: SUCCEED_TO_POST_FORUM,
        payload: responseJson.forum_id
      });
      return responseJson.forum_id;
    } catch (error) {
      dispatch({
        type: FAILED_TO_POST_FORUM,
        payload: { data: "NETWORK_ERROR" }
      });
    }
  };
};

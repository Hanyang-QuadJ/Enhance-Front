import { ServerEndPoint } from "../Configs/Server";

export const SUCCEED_TO_GET_ALL_FORUM = "SUCCEED_TO_GET_ALL_FORUM";
export const FAILED_TO_GET_ALL_FORUM = "FAILED_TO_GET_ALL_FORUM";

export const SUCCEED_TO_POST_FORUM = "SUCCEED_TO_POST_FORUM";
export const FAILED_TO_POST_FORUM = "FAILED_TO_POST_FORUM";

export const SUCCEED_TO_GET_ONE_FORUM = "SUCCEED_TO_GET_ONE_FORUM";
export const FAILED_TO_GET_ONE_FORUM = "FAILED_TO_GET_ONE_FORUM";

export const SUCCEED_TO_GET_FORUM_BY_USER = "SUCCEED_TO_GET_FORUM_BY_USER";
export const FAILED_TO_GET_FORUM_BY_USER = "FAILED_TO_GET_FORUM_BY_USER";

export const SUCCEED_TO_GET_USER_BY_ID = "SUCCEED_TO_GET_USER_BY_ID";
export const FAILED_TO_GET_USER_BY_ID = "FAILED_TO_GET_USER_BY_ID";

export const SUCCEED_TO_GET_COMMENTS_BY_USER =
  "SUCCEED_TO_GET_COMMENTS_BY_USER";
export const FAILED_TO_GET_COMMENTS_BY_USER = "FAILED_TO_GET_COMMENTS_BY_USER";

export const SUCCEED_TO_GET_FAVS_BY_USER = "SUCCEED_TO_GET_FAVS_BY_USER";
export const FAILED_TO_GET_FAVS_BY_USER = "FAILED_TO_GET_FAVS_BY_USER";

export const SUCCEED_TO_GET_ONE_FORUM_COINS = "SUCCEED_TO_GET_ONE_FORUM_COINS";
export const FAILED_TO_GET_ONE_FORUM_COINS = "FAILED_TO_GET_ONE_FORUM_COINS";

export const SUCCEED_TO_GET_ONE_FORUM_COMMENT =
  "SUCCEED_TO_GET_ONE_FORUM_COMMENT";
export const FAILED_TO_GET_ONE_FORUM_COMMENT =
  "FAILED_TO_GET_ONE_FORUM_COMMENT";

export const SUCCEED_TO_POST_FORUM_VIEW = "SUCCEED_TO_POST_FORUM_VIEW";
export const FAILED_TO_POST_FORUM_VIEW = "FAILED_TO_POST_FORUM_VIEW";

export const SUCCEED_TO_POST_FORUM_COMMENT = "SUCCEED_TO_POST_FORUM_COMMENT";
export const FAILED_TO_POST_FORUM_COMMENT = "FAILED_TO_POST_FORUM_COMMENT";

export const getAllForums = params => {
  return async dispatch => {
    try {
      let response = await fetch(
        ServerEndPoint + `api/forum/all?index=${params.forumIndex}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
          }
        }
      );
      let responseJson = await response.json();
      await dispatch({
        type: SUCCEED_TO_GET_ALL_FORUM,
        payload: responseJson
      });
      return responseJson;
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

export const getUserById = params => {
  return async dispatch => {
    try {
      let response = await fetch(
        ServerEndPoint + `api/user?user_id=${params.user_id}`,
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
        type: SUCCEED_TO_GET_USER_BY_ID,
        payload: responseJson.result[0]
      });
      return responseJson.result[0];
    } catch (error) {
      dispatch({
        type: FAILED_TO_GET_USER_BY_ID,
        payload: { data: "NETWORK_ERROR" }
      });
    }
  };
};

export const getForumByUser = params => {
  return async dispatch => {
    try {
      let response = await fetch(
        ServerEndPoint + `api/forum/user?user_id=${params.user_id}`,
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
        type: SUCCEED_TO_GET_FORUM_BY_USER,
        payload: responseJson.forums
      });
      return responseJson.forums;
    } catch (error) {
      dispatch({
        type: FAILED_TO_GET_FORUM_BY_USER,
        payload: { data: "NETWORK_ERROR" }
      });
    }
  };
};

export const getFavByUser = params => {
  return async dispatch => {
    try {
      let response = await fetch(
        ServerEndPoint + `api/favorite?user_id=${params.user_id}`,
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
        type: SUCCEED_TO_GET_FAVS_BY_USER,
        payload: responseJson.myFavorites
      });
      return responseJson.myFavorites;
    } catch (error) {
      dispatch({
        type: FAILED_TO_GET_FAVS_BY_USER,
        payload: { data: "NETWORK_ERROR" }
      });
    }
  };
};

export const getCommentsByUser = params => {
  return async dispatch => {
    try {
      let response = await fetch(
        ServerEndPoint + `api/forum/comment?user_id=${params.user_id}`,
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
        type: SUCCEED_TO_GET_COMMENTS_BY_USER,
        payload: responseJson.result
      });
      return responseJson.result;
    } catch (error) {
      dispatch({
        type: FAILED_TO_GET_COMMENTS_BY_USER,
        payload: { data: "NETWORK_ERROR" }
      });
    }
  };
};

export const getOneForumCoins = params => {
  return async dispatch => {
    try {
      let response = await fetch(
        ServerEndPoint + `api/forum/coin/${params.forum_id}`,
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
        payload: responseJson.result
      });
      return responseJson.result;
    } catch (error) {
      dispatch({
        type: FAILED_TO_GET_ONE_FORUM,
        payload: { data: "NETWORK_ERROR" }
      });
    }
  };
};

export const getOneForumComment = params => {
  return async dispatch => {
    try {
      let response = await fetch(
        ServerEndPoint + `api/forum/comment/${params.forum_id}`,
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
        type: SUCCEED_TO_GET_ONE_FORUM_COMMENT,
        payload: responseJson.result
      });
      return responseJson.result;
    } catch (error) {
      dispatch({
        type: FAILED_TO_GET_ONE_FORUM_COMMENT,
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

export const updateForum = params => {
  return async dispatch => {
    try {
      let response = await fetch(ServerEndPoint + "api/forum/update", {
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

export const postForumView = params => {
  return async dispatch => {
    try {
      let response = await fetch(
        ServerEndPoint + "api/forum/view/" + params.forum_id,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "x-access-token": params.token
          }
        }
      );
      let responseJson = await response.json();
      await dispatch({
        type: SUCCEED_TO_POST_FORUM_VIEW,
        payload: responseJson
      });
      return responseJson;
    } catch (error) {
      dispatch({
        type: FAILED_TO_POST_FORUM_VIEW,
        payload: { data: "NETWORK_ERROR" }
      });
    }
  };
};

export const postForumComment = params => {
  return async dispatch => {
    try {
      let response = await fetch(
        ServerEndPoint + `api/forum/create/comment/${params.forum_id}`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "x-access-token": params.token
          },
          body: JSON.stringify({
            content: params.content
          })
        }
      );
      let responseJson = await response.json();
      await dispatch({
        type: SUCCEED_TO_POST_FORUM_COMMENT,
        payload: responseJson.forum_id
      });
      return responseJson.forum_id;
    } catch (error) {
      dispatch({
        type: FAILED_TO_POST_FORUM_COMMENT,
        payload: { data: "NETWORK_ERROR" }
      });
    }
  };
};

import { ServerEndPoint } from "../Configs/Server";

export const SUCCEED_TO_GET_ALL_FORUM = "SUCCEED_TO_GET_ALL_FORUM";
export const FAILED_TO_GET_ALL_FORUM = "FAILED_TO_GET_ALL_FORUM";

export const SUCCEED_TO_FILTER_FORUM = "SUCCEED_TO_FILTER_FORUM";
export const FAILED_TO_FILTER_FORUM = "FAILED_TO_FILTER_FORUM";

export const SUCCEED_TO_SEARCH_FORUM = "SUCCEED_TO_SEARCH_FORUM";
export const FAILED_TO_SEARCH_FORUM = "FAILED_TO_SEARCH_FORUM";

export const SUCCEED_TO_FILTER_FORUM_BY_TYPE =
  "SUCCEED_TO_FILTER_FORUM_BY_TYPE";
export const FAILED_TO_FILTER_FORUM_BY_TYPE = "FAILED_TO_FILTER_FORUM_BY_TYPE";

export const SUCCEED_TO_POST_FORUM = "SUCCEED_TO_POST_FORUM";
export const FAILED_TO_POST_FORUM = "FAILED_TO_POST_FORUM";

export const SUCCEED_TO_POST_FORUM_IMAGE = "SUCCEED_TO_POST_FORUM_IMAGE";
export const FAILED_TO_POST_FORUM_IMAGE = "FAILED_TO_POST_FORUM_IMAGE";

export const SUCCEED_TO_DELETE_FORUM_IMAGE = "SUCCEED_TO_DELETE_FORUM_IMAGE";
export const FAILED_TO_DELETE_FORUM_IMAGE = "FAILED_TO_DELETE_FORUM_IMAGE";

export const SUCCEED_TO_DELETE_FORUM = "SUCCEED_TO_DELETE_FORUM";
export const FAILED_TO_DELETE_FORUM = "FAILED_TO_DELETE_FORUM";

export const SUCCEED_TO_DELETE_COMMENT = "SUCCEED_TO_DELETE_COMMENT";
export const FAILED_TO_DELETE_COMMENT = "FAILED_TO_DELETE_COMMENT";

export const SUCCEED_TO_GET_ONE_FORUM = "SUCCEED_TO_GET_ONE_FORUM";
export const FAILED_TO_GET_ONE_FORUM = "FAILED_TO_GET_ONE_FORUM";

export const SUCCEED_TO_GET_ONE_FORUM_COINS = "SUCCEED_TO_GET_ONE_FORUM_COINS";
export const FAILED_TO_GET_ONE_FORUM_COINS = "FAILED_TO_GET_ONE_FORUM_COINS";

export const SUCCEED_TO_GET_FORUM_BY_USER = "SUCCEED_TO_GET_FORUM_BY_USER";
export const FAILED_TO_GET_FORUM_BY_USER = "FAILED_TO_GET_FORUM_BY_USER";

export const SUCCEED_TO_GET_USER_BY_ID = "SUCCEED_TO_GET_USER_BY_ID";
export const FAILED_TO_GET_USER_BY_ID = "FAILED_TO_GET_USER_BY_ID";

export const SUCCEED_TO_GET_COMMENTS_BY_USER =
  "SUCCEED_TO_GET_COMMENTS_BY_USER";
export const FAILED_TO_GET_COMMENTS_BY_USER = "FAILED_TO_GET_COMMENTS_BY_USER";

export const SUCCEED_TO_GET_FAVS_BY_USER = "SUCCEED_TO_GET_FAVS_BY_USER";
export const FAILED_TO_GET_FAVS_BY_USER = "FAILED_TO_GET_FAVS_BY_USER";

export const SUCCEED_TO_GET_ONE_FORUM_COMMENT =
  "SUCCEED_TO_GET_ONE_FORUM_COMMENT";
export const FAILED_TO_GET_ONE_FORUM_COMMENT =
  "FAILED_TO_GET_ONE_FORUM_COMMENT";

export const SUCCEED_TO_GET_FORUM_LIKE_CHECK =
  "SUCCEED_TO_GET_FORUM_LIKE_CHECK";
export const FAILED_TO_GET_FORUM_LIKE_CHECK = "FAILED_TO_GET_FORUM_LIKE_CHECK";

export const SUCCEED_TO_GET_FORUM_HATE_CHECK =
  "SUCCEED_TO_GET_FORUM_HATE_CHECK";
export const FAILED_TO_GET_FORUM_HATE_CHECK = "FAILED_TO_GET_FORUM_HATE_CHECK";

export const SUCCEED_TO_POST_FORUM_LIKE = "SUCCEED_TO_POST_FORUM_LIKE";
export const FAILED_TO_POST_FORUM_LIKE = "FAILED_TO_POST_FORUM_LIKE";

export const SUCCEED_TO_POST_FORUM_HATE = "SUCCEED_TO_POST_FORUM_HATE";
export const FAILED_TO_POST_FORUM_HATE = "FAILED_TO_POST_FORUM_HATE";

export const SUCCEED_TO_POST_FORUM_UNHATE = "SUCCEED_TO_POST_FORUM_UNHATE";
export const FAILED_TO_POST_FORUM_UNHATE = "FAILED_TO_POST_FORUM_UNHATE";

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
            "Access-Control-Allow-Origin": "*",
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

export const filterForums = params => {
  if (params.keyword === undefined) {
    params.keyword = "";
  }
  return async dispatch => {
    try {
      let response = await fetch(
        ServerEndPoint +
          `api/forum/coin?index=${params.index}&order=${params.order}&keyword=${
            params.keyword
          }`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json",
            "x-access-token": params.token
          },
          body: JSON.stringify({
            coins: params.coins,
            category: params.category
          })
        }
      );
      let responseJson = await response.json();
      await dispatch({
        type: SUCCEED_TO_FILTER_FORUM,
        payload: responseJson
      });
      return responseJson;
    } catch (error) {
      dispatch({
        type: FAILED_TO_FILTER_FORUM,
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
            "Access-Control-Allow-Origin": "*",
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
            "Access-Control-Allow-Origin": "*",
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
            "Access-Control-Allow-Origin": "*",
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
            "Access-Control-Allow-Origin": "*",
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
            "Access-Control-Allow-Origin": "*",
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
            "Access-Control-Allow-Origin": "*",
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
            "Access-Control-Allow-Origin": "*",
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

export const deleteComment = params => {
  return async dispatch => {
    try {
      if (params.flag === 0) {
        let response = await fetch(
          ServerEndPoint +
            `api/forum/delete/comment?comment_id=${params.comment_id}`,
          {
            method: "DELETE",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
              "x-access-token": params.token
            }
          }
        );
        let responseJson = await response.json();
        await dispatch({
          type: SUCCEED_TO_DELETE_COMMENT,
          payload: responseJson.result
        });
        return responseJson.result;
      } else {
        let response = await fetch(
          ServerEndPoint +
            `api/forum/delete/comment?comment_id=${params.comment_id}`,
          {
            method: "DELETE",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
              "x-access-token": params.token
            }
          }
        );
        let responseJson = await response.json();
        await dispatch({
          type: SUCCEED_TO_DELETE_COMMENT,
          payload: responseJson.result
        });
        return responseJson.result;
      }
    } catch (error) {
      dispatch({
        type: FAILED_TO_DELETE_COMMENT,
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
          "Access-Control-Allow-Origin": "*",
          "x-access-token": params.token
        },
        body: JSON.stringify({
          coin_list: params.coins,
          category: params.category,
          title: params.title,
          content: params.content,
          pic_list: params.base64
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

export const editForum = params => {
  return async dispatch => {
    try {
      let response = await fetch(ServerEndPoint + "api/forum/update", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "x-access-token": params.token
        },
        body: JSON.stringify({
          id: params.id,
          coin_list: params.coins,
          pic_list: null,
          category: params.category,
          title: params.title,
          content: params.content
        })
      });
      let responseJson = await response.json();
      await dispatch({
        type: SUCCEED_TO_POST_FORUM,
        payload: responseJson
      });
      return responseJson;
    } catch (error) {
      dispatch({
        type: FAILED_TO_POST_FORUM,
        payload: { data: "NETWORK_ERROR" }
      });
    }
  };
};

export const uploadImage = params => {
  console.log(params);
  return async dispatch => {
    try {
      let response = await fetch(ServerEndPoint + "api/forum/image/upload", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "x-access-token": params.token
        },
        body: JSON.stringify({
          forum_id: params.forum_id,
          base64: params.base64
        })
      });
      let responseJson = await response.json();
      await dispatch({
        type: SUCCEED_TO_POST_FORUM_IMAGE,
        payload: responseJson
      });
      return responseJson;
    } catch (error) {
      dispatch({
        type: FAILED_TO_POST_FORUM_IMAGE,
        payload: { data: "NETWORK_ERROR" }
      });
    }
  };
};

export const deleteImage = params => {
  return async dispatch => {
    try {
      let response = await fetch(ServerEndPoint + "api/forum/image/delete", {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "x-access-token": params.token
        },
        body: JSON.stringify({
          key: params.key
        })
      });
      let responseJson = await response.json();
      await dispatch({
        type: SUCCEED_TO_DELETE_FORUM_IMAGE,
        payload: responseJson
      });
      return responseJson;
    } catch (error) {
      dispatch({
        type: FAILED_TO_DELETE_FORUM_IMAGE,
        payload: { data: "NETWORK_ERROR" }
      });
    }
  };
};

export const deleteForum = params => {
  return async dispatch => {
    try {
      if (params.flag === 0) {
        let response = await fetch(
          ServerEndPoint + "api/admin/forum" + params.forum_id,
          {
            method: "DELETE",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
              "x-access-token": params.token
            }
          }
        );
        let responseJson = await response.json();
        await dispatch({
          type: SUCCEED_TO_DELETE_FORUM,
          payload: responseJson
        });
        return responseJson;
      } else {
        let response = await fetch(
          ServerEndPoint + "api/forum/" + params.forum_id,
          {
            method: "DELETE",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
              "x-access-token": params.token
            }
          }
        );
        let responseJson = await response.json();
        await dispatch({
          type: SUCCEED_TO_DELETE_FORUM,
          payload: responseJson
        });
        return responseJson;
      }
    } catch (error) {
      dispatch({
        type: FAILED_TO_DELETE_FORUM,
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
            "Access-Control-Allow-Origin": "*",
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

export const getLikeCheck = params => {
  return async dispatch => {
    try {
      let response = await fetch(
        ServerEndPoint + "api/forum/like/check/" + params.forum_id,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "x-access-token": params.token
          }
        }
      );
      let responseJson = await response.json();
      await dispatch({
        type: SUCCEED_TO_GET_FORUM_LIKE_CHECK,
        payload: responseJson
      });
      return responseJson;
    } catch (error) {
      dispatch({
        type: FAILED_TO_GET_FORUM_LIKE_CHECK,
        payload: { data: "NETWORK_ERROR" }
      });
    }
  };
};

export const postForumLike = params => {
  return async dispatch => {
    try {
      let response = await fetch(
        ServerEndPoint + "api/forum/like/" + params.forum_id,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "x-access-token": params.token
          }
        }
      );
      let responseJson = await response.json();
      await dispatch({
        type: SUCCEED_TO_POST_FORUM_LIKE,
        payload: responseJson
      });
      return responseJson;
    } catch (error) {
      dispatch({
        type: FAILED_TO_POST_FORUM_LIKE,
        payload: { data: "NETWORK_ERROR" }
      });
    }
  };
};

export const postHate = params => {
  return async dispatch => {
    try {
      let response = await fetch(
        ServerEndPoint + "api/forum/hate/" + params.forum_id,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "x-access-token": params.token
          }
        }
      );
      let responseJson = await response.json();
      await dispatch({
        type: SUCCEED_TO_POST_FORUM_HATE,
        payload: responseJson
      });
      return responseJson;
    } catch (error) {
      dispatch({
        type: FAILED_TO_POST_FORUM_HATE,
        payload: { data: "NETWORK_ERROR" }
      });
    }
  };
};

export const getHateCheck = params => {
  return async dispatch => {
    try {
      let response = await fetch(
        ServerEndPoint + "api/forum/hate/check/" + params.forum_id,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "x-access-token": params.token
          }
        }
      );
      let responseJson = await response.json();
      await dispatch({
        type: SUCCEED_TO_GET_FORUM_HATE_CHECK,
        payload: responseJson
      });
      return responseJson;
    } catch (error) {
      dispatch({
        type: FAILED_TO_GET_FORUM_HATE_CHECK,
        payload: { data: "NETWORK_ERROR" }
      });
    }
  };
};

export const postUnHate = params => {
  return async dispatch => {
    try {
      let response = await fetch(
        ServerEndPoint + "api/forum/unhate/" + params.forum_id,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "x-access-token": params.token
          }
        }
      );
      let responseJson = await response.json();
      await dispatch({
        type: SUCCEED_TO_POST_FORUM_UNHATE,
        payload: responseJson
      });
      return responseJson;
    } catch (error) {
      dispatch({
        type: FAILED_TO_POST_FORUM_UNHATE,
        payload: { data: "NETWORK_ERROR" }
      });
    }
  };
};

export const postForumDisLike = params => {
  return async dispatch => {
    try {
      let response = await fetch(
        ServerEndPoint + "api/forum/dislike/" + params.forum_id,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "x-access-token": params.token
          }
        }
      );
      let responseJson = await response.json();
      await dispatch({
        type: SUCCEED_TO_POST_FORUM_LIKE,
        payload: responseJson
      });
      return responseJson;
    } catch (error) {
      dispatch({
        type: FAILED_TO_POST_FORUM_LIKE,
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
            "Access-Control-Allow-Origin": "*",
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
        payload: responseJson.comment_id
      });
      return responseJson.comment_id;
    } catch (error) {
      dispatch({
        type: FAILED_TO_POST_FORUM_COMMENT,
        payload: { data: "NETWORK_ERROR" }
      });
    }
  };
};

import { ServerEndPoint } from "../Configs/Server";

export const SUCCEED_TO_GET_NEWS = "SUCCEED_TO_GET_NEWS";
export const FAILED_TO_GET_NEWS = "FAILED_TO_GET_NEWS";

export const SUCCEED_TO_POST_NEWS = "SUCCEED_TO_POST_NEWS";
export const FAILED_TO_POST_NEWS = "FAILED_TO_POST_NEWS";

export const getNews = params => {
  return async dispatch => {
    try {
      let response = await fetch(
        ServerEndPoint +
          `api/naver/search/news?coin_id=${params.coinId}&source=${
            params.sourceId
          }&index=${params.newsCount}&recent=${params.recent}`,
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
        type: SUCCEED_TO_GET_NEWS,
        payload: responseJson.result
      });
      return responseJson;
    } catch (error) {
      dispatch({
        type: FAILED_TO_GET_NEWS,
        payload: { data: "NETWORK_ERROR" }
      });
    }
  };
};

export const postFeed = params => {
  return async dispatch => {
    try {
      let response = await fetch(ServerEndPoint + "api/post", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
          "x-access-token": params.token
        },
        body: JSON.stringify({
          content: params.content,
          post_type: params.type,
          pic_list: params.pic_list,
          tags: ["#sample", "#cafeSpot"]
        })
      });
      let responseJson = await response.json();
      console.log(responseJson);
      await dispatch({
        type: SUCCEED_TO_POST_FEED,
        payload: responseJson.items
      });
      return responseJson.items;
    } catch (error) {
      dispatch({
        type: FAILED_TO_POST_FEED,
        payload: { data: "NETWORK_ERROR" }
      });
    }
  };
};

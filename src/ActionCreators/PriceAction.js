import { ServerEndPoint } from "../Configs/Server";

export const SUCCEED_TO_GET_COINS = "SUCCEED_TO_GET_COINS";
export const FAILED_TO_GET_COINS = "FAILED_TO_GET_COINS";

export const SUCCEED_TO_GET_PRICE = "SUCCEED_TO_GET_PRICE";
export const FAILED_TO_GET_PRICE = "FAILED_TO_GET_PRICE";

export const SUCCEED_TO_GET_FAVS = "SUCCEED_TO_GET_FAVS";
export const FAILED_TO_GET_FAVS = "FAILED_TO_GET_FAVS";

export const SUCCEED_TO_ADD_FAV = "SUCCEED_TO_ADD_FAV";
export const FAILED_TO_ADD_FAV = "FAILED_TO_ADD_FAV";

export const SUCCEED_TO_REMOVE_FAV = "SUCCEED_TO_REMOVE_FAV";
export const FAILED_TO_REMOVE_FAV = "FAILED_TO_REMOVE_FAV";

export const getCoins = () => {
  return async dispatch => {
    try {
      let response = await fetch(ServerEndPoint + "api/coin/all", {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        }
      });
      let responseJson = await response.json();
      await dispatch({
        type: SUCCEED_TO_GET_COINS,
        payload: responseJson.coins
      });
      return responseJson.coins;
    } catch (error) {
      dispatch({
        type: FAILED_TO_GET_COINS,
        payload: { data: "NETWORK_ERROR" }
      });
    }
  };
};

export const getPrice = params => {
  return async dispatch => {
    try {
      let response = await fetch(
        `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${params}&tsyms=KRW`,
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
        type: SUCCEED_TO_GET_PRICE,
        payload: responseJson.DISPLAY
      });
      return responseJson.DISPLAY;
    } catch (error) {
      dispatch({
        type: FAILED_TO_GET_PRICE,
        payload: { data: "NETWORK_ERROR" }
      });
    }
  };
};

export const getFavs = params => {
  return async dispatch => {
    try {
      let response = await fetch(ServerEndPoint + "api/favorite/all", {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "x-access-token": params
        }
      });
      let responseJson = await response.json();
      console.log(responseJson);
      await dispatch({
        type: SUCCEED_TO_GET_FAVS,
        payload: responseJson.myFavorites
      });
      return responseJson.myFavorites;
    } catch (error) {
      dispatch({
        type: FAILED_TO_GET_FAVS,
        payload: { data: "NETWORK_ERROR" }
      });
    }
  };
};

export const addFav = params => {
  return async dispatch => {
    try {
      let response = await fetch(ServerEndPoint + "api/favorite/add", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "x-access-token": params.token
        },
        body: JSON.stringify({
          user_id: 2,
          coin_id: params.coin_id
        })
      });
      let responseJson = await response.json();
      await dispatch({
        type: SUCCEED_TO_ADD_FAV,
        payload: responseJson
      });
      return responseJson;
    } catch (error) {
      dispatch({
        type: FAILED_TO_ADD_FAV,
        payload: { data: "NETWORK_ERROR" }
      });
    }
  };
};

export const removeFav = params => {
  return async dispatch => {
    try {
      let response = await fetch(ServerEndPoint + "api/favorite/remove", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "x-access-token": params.token
        },
        body: JSON.stringify({
          user_id: 2,
          coin_id: params.coin_id
        })
      });
      let responseJson = await response.json();
      await dispatch({
        type: SUCCEED_TO_REMOVE_FAV,
        payload: responseJson
      });
      return responseJson;
    } catch (error) {
      dispatch({
        type: FAILED_TO_REMOVE_FAV,
        payload: { data: "NETWORK_ERROR" }
      });
    }
  };
};

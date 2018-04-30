import { ServerEndPoint } from "../Configs/Server";

export const SUCCEED_TO_GET_PRICE = "SUCCEED_TO_GET_PRICE";
export const FAILED_TO_GET_PRICE = "FAILED_TO_GET_PRICE";

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

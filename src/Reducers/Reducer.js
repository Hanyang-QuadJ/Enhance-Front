/*
* Author: @nayunhwan (github.com/nayunhwan)
* Email: nayunhwan.dev@mgail.com
*/

import { combineReducers } from "redux";

import DefaultAction from "../Actions/DefaultAction";
import { SUCCEED_TO_GET_NEWS } from "../ActionCreators/NewsAction";
import { SUCCEED_TO_GET_PRICE } from "../ActionCreators/PriceAction";

const initialState = {
  data: null,
  news: [],
  prices: null
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case DefaultAction.SUCCEED_TO_DEFAULT_ACTION:
      return Object.assign({}, state, {
        data: action.data
      });
    case SUCCEED_TO_GET_NEWS:
      return Object.assign({}, state, {
        news: action.payload
      });
    case SUCCEED_TO_GET_PRICE:
      return Object.assign({}, state, {
        prices: action.payload
      });
    default:
      return state;
  }
};

const Reducer = combineReducers({ reducer });
export default Reducer;

/*
* Author: @nayunhwan (github.com/nayunhwan)
* Email: nayunhwan.dev@mgail.com
*/

import { combineReducers } from "redux";

import DefaultAction from "../Actions/DefaultAction";
import { SUCCEED_TO_GET_NEWS } from "../ActionCreators/NewsAction";
import {
  SUCCEED_TO_GET_PRICE,
  SUCCEED_TO_GET_COINS
} from "../ActionCreators/PriceAction";
import {
  SUCCEED_TO_SIGNUP,
  SUCCEED_TO_SIGNIN,
  SUCCEED_TO_GET_ME,
  SUCCEED_TO_SIGNOUT,
  FAILED_TO_SIGNIN
} from "../ActionCreators/AuthAction";

const initialState = {
  data: null,
  news: [],
  newsCount: 0,
  coinId: 1,
  sourceId: 0,
  prices: null,
  coins: null,
  me: null,
  token: localStorage.getItem("token"),
  isLogin: !!localStorage.getItem("token")
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case DefaultAction.SUCCEED_TO_DEFAULT_ACTION:
      return Object.assign({}, state, {
        data: action.data
      });
    case SUCCEED_TO_SIGNUP:
      localStorage.setItem("token", action.payload);
      return Object.assign({}, state, {
        token: action.payload,
        isLogin: true
      });
    case SUCCEED_TO_SIGNIN:
      localStorage.setItem("token", action.payload);
      return Object.assign({}, state, {
        token: action.payload,
        isLogin: true
      });
    case FAILED_TO_SIGNIN:
      return Object.assign({}, state, {
        token: "",
        isLogin: false
      });
    case SUCCEED_TO_SIGNOUT:
      localStorage.removeItem("token");
      return Object.assign({}, state, {
        isLogin: false,
        token: null,
        user: []
      });
    case SUCCEED_TO_GET_NEWS:
      return Object.assign({}, state, {
        news: action.payload
      });
    case SUCCEED_TO_GET_ME:
      return Object.assign({}, state, {
        me: action.payload
      });
    case SUCCEED_TO_GET_PRICE:
      return Object.assign({}, state, {
        prices: action.payload
      });
    case SUCCEED_TO_GET_COINS:
      return Object.assign({}, state, {
        coins: action.payload
      });
    default:
      return state;
  }
};

const Reducer = combineReducers({ reducer });
export default Reducer;

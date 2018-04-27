/*
* Author: @nayunhwan (github.com/nayunhwan)
* Email: nayunhwan.dev@mgail.com
*/

import { combineReducers } from "redux";

import DefaultAction from "../Actions/DefaultAction";

const initialState = {
  data: null
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case DefaultAction.SUCCEED_TO_DEFAULT_ACTION:
      return Object.assign({}, state, {
        data: action.data
      });
    default:
      return state;
  }
};

const Reducer = combineReducers({ reducer });
export default Reducer;

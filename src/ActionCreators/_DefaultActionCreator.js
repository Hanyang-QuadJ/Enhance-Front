/*
* Author: @nayunhwan (github.com/nayunhwan)
* Email: nayunhwan.dev@mgail.com
*/

import DefaultAction from "../Actions/DefaultAction";
import * as DefaultAPI from "../API/DefaultAPI";

export function action() {
  return async dispatch => {
    try {
      dispatch({
        type: DefaultAction.START_TO_DEFAULT_ACTION
      });
      const data = await DefaultAPI.getTest();
      dispatch({
        type: DefaultAction.SUCCEED_TO_DEFAULT_ACTION,
        data
      });
    } catch (err) {
      dispatch({
        type: DefaultAction.FAILED_TO_DEFAULT_ACTION
      });
    }
  };
}

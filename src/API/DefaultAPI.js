/*
* Author: @nayunhwan (github.com/nayunhwan)
* Email: nayunhwan.dev@mgail.com
*/

import * as WebRequestUtil from "../Utils/WebRequestUtil";

export async function getTest() {
  const url = "YOUR-API-URL";
  const res = await WebRequestUtil.get({ url });
  return res.data;
}

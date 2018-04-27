/*
* Author: @nayunhwan (github.com/nayunhwan)
* Email: nayunhwan.dev@mgail.com
*/

import fetch from "isomorphic-fetch";
import { ServerEndPoint } from "../Configs/Server";
import axios from "axios";

export const getJson = (url, responseActionCreator, headers, callback) => {
  return dispatch => {
    fetch(ServerEndPoint + url, {
      method: "GET",
      headers: {
        ...headers,
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    })
      .then(response => response.json())
      .then(json => {
        dispatch(responseActionCreator(json));
        if (callback) callback();
      });
  };
};

export const postJson = (
  url,
  responseActionCreator,
  headers,
  body,
  callback
) => {
  return dispatch => {
    fetch(ServerEndPoint + url, {
      method: "POST",
      headers: {
        ...headers,
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    })
      .then(response => response.json())
      .then(json => {
        dispatch(responseActionCreator(json));
        if (callback) callback();
      });
  };
};

export const get = ({ url, headers, body }, callback) => {
  return axios({
    method: "GET",
    url: ServerEndPoint + url,
    headers: headers,
    data: body
  })
    .then(res => {
      if (callback) callback();
      return res;
    })
    .catch(err => {
      return err;
    });
};

export const post = ({ url, headers, body }, callback) => {
  return axios({
    method: "POST",
    url: ServerEndPoint + url,
    headers: headers,
    data: body
  })
    .then(res => {
      if (callback) callback();
      return res;
    })
    .catch(err => {
      return err;
    });
};

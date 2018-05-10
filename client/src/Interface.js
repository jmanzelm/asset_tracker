/**
 *  Provides post functionality
 *  @author: Taylor He
 *
 */
// import fetch from 'isomorphic-fetch';
// require("es6-promise").polyfill();
import axios from 'axios';

export function post(path, body) {
    // console.log("body is", body);
    return axios({
      method: 'post',
      url: path,
      data: body,
      headers: {
        "Access-Control-Allow-Origin": "*"
      }
    });
}

export function get(path){
    fetch(path)
    .then((response) => {
        return response;
    })
    .catch((e) => {
      console.log(e)
    });
}

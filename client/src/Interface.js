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
    let p = "https://localhost:3001/prices/stock/AAPL";
    axios.get(p)
    .then((response) => {
        console.log(response);
        return response;
    })
    .catch((e) => {
      console.log("error is:", e.response)
    });
}
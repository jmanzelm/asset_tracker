/**
 *  Provides post functionality
 *  @author: Taylor He
 *
 */
// import fetch from 'isomorphic-fetch';

import axios from 'axios';

export function post(path, body) {
    // console.log("body is", body);
    return axios({
      method: 'post',
      url: path,
      data: body, 
    });
}

export function get(path){
    // let p = "http://localhost:3001/prices/stock/AAPL/";
    return axios({
      method: 'get',
      url: path
    })
    .then(response => {
        console.log(response);
        return response;
    })
    .catch((e) => {
      console.log("error is:", e.data)
    });
}
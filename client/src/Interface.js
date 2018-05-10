/**
 *  Provides post functionality
 *  @author: Taylor He
 *
 */
import fetch from 'isomorphic-fetch';
require("es6-promise").polyfill();

export function post(path, body) {
    fetch(path, {
      method: 'POST',
      mode:'no-cors',
      headers: {
        // 'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body)
    })
   .then((response) => {
        return response;
    })
   .catch((e) => {console.log(e)})
}

export function get(path){
    fetch(path)
    .then((response) => {
        return response;
    })
    .catch((e) => {console.log(e)})
}

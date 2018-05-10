/**
 *  Provides post functionality
 *  @author: Taylor He
 *
 */
import fetch from 'isomorphic-fetch';
// require("es6-promise").polyfill();

export function post(path, body) {
    console.log("body is", body);
    fetch(path, {
      method: 'POST',
      mode:'no-cors',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
            username: "masterdetective123",
            password: "elementarymydearwatson"
      })
    })
   .then((response) => {
        console.log(response);
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

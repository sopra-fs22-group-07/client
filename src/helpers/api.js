import axios from 'axios';
import { getDomain } from 'helpers/getDomain';

export const api = axios.create({
  baseURL: getDomain(),
  headers: {
    'Content-Type': 'application/json',
  }});

// this makes axios intercept the requests and reconfigure it. Here we configure the header. With this, no more custom
// configuration is needed. See https://axios-http.com/docs/interceptors and
// https://stackoverflow.com/questions/43051291/attach-authorization-header-for-all-axios-requests
api.interceptors.request.use(function (config) {
  const token = localStorage.getItem("token")
  config.headers.authorization = token ? token : ''
  return config
})


export const handleError = error => {
  const response = error.response;

  // catch 4xx and 5xx status codes
  if (response && !!`${response.status}`.match(/^[4|5]\d{2}$/)) {
    let info = `\nrequest to: ${response.request.responseURL}`;

    if (response.data.status) {
      info += `\nstatus code: ${response.data.status}`;
      info += `\nerror: ${response.data.error}`;
      info += `\nerror message: ${response.data.message}`;
    } else {
      info += `\nstatus code: ${response.status}`;
      info += `\nerror message:\n${response.data}`;
    }

    console.log('The request was made and answered but was unsuccessful.', error.response);
    return info;
  } else {
    if (error.message.match(/Network Error/)) {
      alert('The server cannot be reached.\nDid you start it?');
    }

    console.log('Something else happened.', error);
    return error.message;
  }
};

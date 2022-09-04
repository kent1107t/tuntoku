/* global gapi */
/* eslint-disable no-undef */

//import {GoogleApiProvider} from 'react-gapi';


export const config = {
    clientId: process.env.REACT_APP_CLIENTID,
    scope: 'profile email',
};

/*
export function init(onInit) {
  if (!gapi) {
    throw new Error('Google API SDK is not loaded.');
  }

  gapi.load('client:auth2', async () => {
    try {
      await gapi.client.init(config);
      const user = gapi.auth2.getAuthInstance().currentUser.get();
      onInit(user);
    } catch (error) {
      onInit(null, error);
    }
  });
}
export async function signIn() {
  return window.gapi.auth2.getAuthInstance().signIn();
}

export async function signOut() {
  return window.gapi.auth2.getAuthInstance().signOut();
}
*/
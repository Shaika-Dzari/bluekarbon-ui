import 'whatwg-fetch';
import { browserHistory } from 'react-router';
import { push } from 'react-router-redux';
import {doStartLoading, doStopLoading} from './navigationActions.js';

export const USER_LP_USERNAME_KEYPRESS = 'USER_LP_LOGIN_KEYPRESS';
export const USER_LP_PASSWD_KEYPRESS = 'USER_LP_PASSWD_KEYPRESS';
export const USER_LP_SUBMIT = 'USER_LP_SUBMIT';
export const USER_SUCCESS_LOGIN = 'USER_SUCCESS_LOGIN';
export const USER_BAD_CREDENTIAL = 'USER_BAD_CREDENTIAL';
export const USER_CHALLENGE = 'USER_CHALLENGE';
export const USER_LOGOUT = 'USER_LOGOUT';

const USER_URL = '/api/users';
const LOGIN_URL = USER_URL + '/login';
const LOGOUT_URL = USER_URL + '/logout';
const CHALLENGE_URL = USER_URL + '/challenge';

export function doLoginPageUsernameKp(value) {
    return {
        type: USER_LP_USERNAME_KEYPRESS,
        value
    };
}

export function doLoginPagePasswdKp(value) {
    return {
        type: USER_LP_PASSWD_KEYPRESS,
        value
    };
}

export function doLoginPageSubmit() {

    return (dispatch, getState) => {

        dispatch(doStartLoading());

        let u = 'username=' + encodeURIComponent(getState().user.username);
        let p = 'password=' + encodeURIComponent(getState().user.passwd);


        let opts = {
            method: "POST",
            headers: {"Content-Type": "application/x-www-form-urlencoded"},
            body: u + "&" + p,
            credentials: 'include'
        };

        return fetch(LOGIN_URL, opts)
            .then(r => r.json())
            .then(user => {
                dispatch(doStopLoading());
                sessionStorage.setItem('4nuser', user);
                dispatch(doSuccessLogin(user));
                dispatch(push('/'));
            })
            .catch(e => {
                dispatch(doStopLoading());
                dispatch(doBadCredential(e))
            });
    };

}

export function doSuccessLogin(user) {
    return {
        type: USER_SUCCESS_LOGIN,
        user
    };
}

export function doBadCredential(error) {
    return {
        type: USER_BAD_CREDENTIAL,
        error
    };
}

export function doLogoutSuccess() {
    return {
        type: USER_LOGOUT
    };
}


export function doLogout() {
    return (dispatch, getState) => {

        sessionStorage.removeItem('4nuser');

        return window.fetch(LOGOUT_URL, {credentials: 'include'})
            .then(function(){
                dispatch(doLogoutSuccess());
                dispatch(push('/'));
            })
            .catch(e => {
                dispatch(doLogoutSuccess());
                dispatch(push('/'));
            });
    }
}

export function doChallenge(toUrl) {

    return (dispatch, getState) => {

        return fetch(CHALLENGE_URL, {credentials: 'include'})
            .then(r => r.json())
            .then(user => {

                sessionStorage.setItem('4nuser', user);
                dispatch(doSuccessLogin(user));

                if (toUrl) {
                    dispatch(push(toUrl));
                }

            }).catch(e => {
                browserHistory.push('/login');
            });
    }
}
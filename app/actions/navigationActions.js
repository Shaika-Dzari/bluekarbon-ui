//import { doSwitchModule } from './messageActions.js';
import {doBlogPostsFetchPage} from './blogPostActions.js';
import { push } from 'react-router-redux';
import * as FetchUtils from '../utils/FetchUtils.js';

export const STARTLOADING = 'STARTLOADING';
export const STOPLOADING = 'STOPLOADING';
export const GLOBAL_ERROR = 'GLOBAL_ERROR';
export const NAVIGATE_TO = 'NAVIGATE_TO';


const MODULE_URLS = {
    blog: '/blog',
    about: '/about',
    project: '/project',
    story: '/story'
};


export function doStartLoading() {
    return {
        type: STARTLOADING
    }
}

export function doStopLoading() {
    return {
        type: STOPLOADING
    }
}

export function doRaiseGlobalError(error) {

    return {
        type: GLOBAL_ERROR,
        error: error
    }
}

export function doNavigationTo(moduleid, url) {

    return (dispatch, getState) => {
        dispatch(doBlogPostsFetchPage(0, null, true));
        dispatch(push(MODULE_URLS.blog));
    };
}
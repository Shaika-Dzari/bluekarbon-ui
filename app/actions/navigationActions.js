import {doBlogPostsFetchPage} from './blogPostActions.js';
import { push } from 'react-router-redux';
import * as FetchUtils from '../utils/FetchUtils.js';

export const STARTLOADING = 'STARTLOADING';
export const STOPLOADING = 'STOPLOADING';
export const GLOBAL_ERROR = 'GLOBAL_ERROR';
export const NAVIGATE_TO = 'NAVIGATE_TO';


export const MODULE_URLS = {
    blog: '/blog',
    about: '/about',
    project: '/project',
    story: '/story',
    admin: {
        blogposts: '/dashboard/messages/blogposts',
        abouts: '/dashboard/messages/abouts',
        projects: '/dashboard/messages/projects',
        stories: '/dashboard/messages/stories'
    }
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
        dispatch(doBlogPostsFetchPage(0));
        dispatch(push(MODULE_URLS.blog));
    };
}
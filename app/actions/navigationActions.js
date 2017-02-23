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
        blog: '/dashboard/messages/blogposts',
        about: '/dashboard/messages/abouts',
        project: '/dashboard/messages/projects',
        story: '/dashboard/messages/stories'
    }
};


export function routeToModuleCode(name) {
    let r = null;

    switch (name) {
        case 'blogposts' : r = 'blog'; break;
        case 'abouts' : r = 'about'; break;
        case 'projects' : r = 'project'; break;
        case 'stories' : r = 'story'; break;
        default: r = null;
    }

    console.log(name, ' => ', r);

    return r;
}



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
import { push } from 'react-router-redux';
import PagingParam from '../utils/PagingParam.js';
import { getUrlParamsString, mkToHtml } from '../utils/HtmlUtils.js';
import * as FetchUtils from '../utils/FetchUtils.js';
import makeActionCreator from './actionCreator.js';

const BLOGPOST_URL = '/api/blog/posts';
const BLOGPOST_SIZE = 3;

// Action Constants
export const BP_FILTER = 'BP_FILTER';
export const BP_SAVED = 'BP_SAVED';
export const BP_LIST_RECEIVE = 'BP_LIST_RECEIVE';
export const BP_EDITOR_TITLE_CHANGE = 'BP_EDITOR_TITLE_CHANGE';
export const BP_EDITOR_TITLE_BLUR = 'BP_EDITOR_TITLE_BLUR';
export const BP_EDITOR_PRETTYURL_CHANGE = 'BP_EDITOR_PRETTYURL_CHANGE';
export const BP_EDITOR_TEXT_CHANGE = 'BP_EDITOR_TEXT_CHANGE';
export const BP_EDITOR_PUBLISHED_CHECK = 'BP_EDITOR_PUBLISHED_CHECK';
export const BP_EDITOR_CATEGORY_CHECK = 'BP_EDITOR_CATEGORY_CHECK';
export const BP_EDITOR_SAVE = 'BP_EDITOR_SAVE';
export const BP_EDIT = 'BP_EDIT';
export const BP_ERROR = 'BP_ERROR';

export const doBlogPostsFetchPage = (page, categoryid, skipcache) => {
    return (dispatch, getState) => {
        let needToLoad = skipcache || !getState().blogposts.preloaded;

        if (needToLoad) {

            let p = new PagingParam(page, BLOGPOST_SIZE);
            let cparam = categoryid ? 'categoryid=' + encodeURIComponent(categoryid) : '';
            return FetchUtils.get(dispatch, BLOGPOST_URL + '?' + getUrlParamsString(page, [cparam]),
                                {credentials: 'include'},
                                doBlogPostsReceive,
                                doBlogPostsError);
        }
    }
}

export const doBlogPostsFetchAndEdit = (blogpostid) => {
    if (blogpostid == 'new') {

        return {
            type: BP_EDIT,
            blogpost: {
                id: 'new',
                title: '',
                body: '',
                prettyurl: ''
            }
        }

    } else {

        return (dispatch, getState) => {
            return FetchUtils.get(dispatch, BLOGPOST_URL + '/' + blogpostid,
                                  {credentials: 'include'},
                                  doBlogPostsEdit,
                                  doBlogPostsError)
        }
    }
}

export const doBlogPostsSave = () => {
    return (dispatch, getState) => {
        let blogpost = getState().items[getState().editing];
        let url = BLOGPOST_URL + (blogpost.id === 'new' ? '' : '/' + blogpost.id);
        let protocol = blogpost.id === 'new' ? 'POST' : 'PUT';

        return FetchUtils.saveOrUpdate(dispatch, protocol, url, blogpost,
                                       doBlogPostsSaved,
                                       doBlogPostsError);
    }
}

export const doBlogPostsFilter = makeActionCreator(BP_FILTER, 'page', 'categoryid');
export const doBlogPostsReceive = makeActionCreator(BP_LIST_RECEIVE, 'blogposts');

// Related to BlogPost edition
export const doBlogPostsEdrTextChange = makeActionCreator(BP_EDITOR_TEXT_CHANGE, 'text');
export const doBlogPostsEdrTitleChange = makeActionCreator(BP_EDITOR_TITLE_CHANGE, 'title');
export const doBlogPostsEdrTitleBlur = makeActionCreator(BP_EDITOR_TITLE_BLUR, 'title');
export const doBlogPostsEdrPrettyUrlChange = makeActionCreator(BP_EDITOR_PRETTYURL_CHANGE, 'prettyurl');
export const doBlogPostsEdrPublishedCheck = makeActionCreator(BP_EDITOR_PUBLISHED_CHECK, 'published');
export const doBlogPostsEdrCategoryCheck = makeActionCreator(BP_EDITOR_CATEGORY_CHECK, 'category');
export const doBlogPostsError = makeActionCreator(BP_ERROR, 'error');
export const doBlogPostsEdit = makeActionCreator(BP_EDIT, 'blogpost');
export const doBlogPostsSaved = makeActionCreator(BP_SAVED, 'blogpost');

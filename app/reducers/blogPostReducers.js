import { BP_LIST_RECEIVE, BP_FILTER, BP_EDIT, BP_ERROR, BP_SAVED,
         BP_EDITOR_TITLE_CHANGE, BP_EDITOR_TITLE_BLUR, BP_EDITOR_PRETTYURL_CHANGE,
         BP_EDITOR_TEXT_CHANGE, BP_EDITOR_PUBLISHED_CHECK , BP_EDITOR_CATEGORY_CHECK,
       } from '../actions/blogPostActions.js';

import {updateCategory, updateMessageItem, error, receive, computePrettyUrl} from './messageReducerUtils.js';

import { normalize } from '../utils/StateUtils.js';
import { mkToHtml } from '../utils/HtmlUtils.js';

const initialState = {
    items: {}, index: [], editing: null, opened:null, page: 0, filter: null
};

export const blogPostReducers = (state = initialState, action) => {

    switch (action.type) {
        case BP_LIST_RECEIVE:
            return receive(state, action.blogposts);

        case BP_FILTER:
            return Object.assign({}, state, {page: action.page, categoryid: action.categoryid});

        case BP_EDIT:
            let pitems = Object.assign({}, state.items, {[action.blogpost.id]: action.blogpost});
            return Object.assign({}, state, {items: pitems, editing: action.blogpost.id});

        case BP_EDITOR_TITLE_CHANGE:
        case BP_EDITOR_TEXT_CHANGE:
        case BP_EDITOR_PRETTYURL_CHANGE:
        case BP_EDITOR_PUBLISHED_CHECK:
            return updateMessageItem(state, state.editing, action);

        case BP_EDITOR_TITLE_BLUR:
            if (!state.items[state.editing].prettyurl) {
                let prettyurl = computePrettyUrl(action.title);
                return updateMessageItem(state, state.editing, {prettyurl: prettyurl});
            }
            return state;

        case BP_EDITOR_CATEGORY_CHECK:
            return updateCategory(state, action);

        case BP_SAVED:
            let bp = Object.assign({}, action.blogpost);
            // bp.bodyhtml = mkToHtml(bp.body);
            let bpsprime = Object.assign({}, state.items, {[action.blogpost.id]: action.blogpost});
            return Object.assign({}, state, {items: bpsprime});

        case BP_ERROR:
            return error(action);

        default: return state;
    }
};

import { BP_LIST_RECEIVE, BP_FILTER, BP_EDIT, BP_ERROR, BP_SAVED,
         BP_EDITOR_TITLE_CHANGE, BP_EDITOR_TITLE_BLUR, BP_EDITOR_PRETTYURL_CHANGE,
         BP_EDITOR_TEXT_CHANGE, BP_EDITOR_PUBLISHED_CHECK , BP_EDITOR_CATEGORY_CHECK,
       } from '../actions/blogPostActions.js';

import { normalize } from '../utils/StateUtils.js';
import { mkToHtml } from '../utils/HtmlUtils.js';


function updateMessage(messages, id, action) {
    let update = {};
    for (let k in action) {
        if (k != 'type') {
            update[k] = action[k];
        }
    }
    let msg = Object.assign({}, messages[id], update);
    return Object.assign({}, messages, {[id]: msg});
}


function computePrettyUrl(title) {

    let p = title.replace(/[!$?*&#\\]/g, '');
    p = p.replace(/[^a-z0-9_\-]/gi, '_');

    return p.toLowerCase();
}


const initialState = {
    items: {}, index: [], editing: null, opened:null, page: 0, filter: null
};

export const blogPostReducers = (state = initialState, action) => {
    switch (action.type) {
        case BP_LIST_RECEIVE:
            let recBps = normalize(action.blogposts);
            return Object.assign({}, state, recBps);

        case BP_FILTER:
            return Object.assign({}, state, {page: action.page, categoryid: action.categoryid});

        case BP_EDIT:
            let pitems = Object.assign({}, state.items, {[action.blogpost.id]: action.blogpost});
            return Object.assign({}, state, {items: pitems, editing: action.blogpost.id});

        case BP_EDITOR_TITLE_CHANGE:
        case BP_EDITOR_TEXT_CHANGE:
        case BP_EDITOR_PRETTYURL_CHANGE:
        case BP_EDITOR_PUBLISHED_CHECK:
            return Object.assign({}, state, updateMessage(state.items, state.editing, action));

        case BP_EDITOR_TITLE_BLUR:
            if (!state.items[state.editing].prettyurl) {
                let prettyurl = computePrettyUrl(action.title);
                return Object.assign({}, state, {items: updateMessage(state.items, state.editing, {prettyurl: prettyurl})});
            }
            return state;

        case BP_EDITOR_CATEGORY_CHECK:
            let csprime = state.items[state.editing].categories ? [...state.items[state.editing].categories] : [];
            if (action.category.checked) {
                csprime.push({id: action.category.id, name: action.category.name});
            } else {
                let idx = csprime.findIndex(c => c.id == action.category.id);
                if (idx != -1) {
                    csprime.splice(idx, 1);
                }
            }

            return Object.assign({}, state, {items: updateMessage(state.items, state.editing, {categories: csprime})});

        case BP_SAVED:
            let bp = Object.assign({}, action.blogpost);
            // bp.bodyhtml = mkToHtml(bp.body);
            let bpsprime = Object.assign({}, state.items, {[action.blogpost.id]: action.blogpost});
            return Object.assign({}, state, {items: bpsprime});

        case BP_ERROR:
            return Object.assign({}, state, {error: '' + action.error});

        default: return state;
    }
};

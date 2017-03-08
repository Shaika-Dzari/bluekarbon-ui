import * as FetchUtils from '../utils/FetchUtils.js';
import makeActionCreator from './actionCreator.js';

const CATEGORY_URL = '/api/categories';

export const CATEGORY_FETCH = 'CATEGORY_FETCH';
export const CATEGORY_RECEIVE = 'CATEGORY_RECEIVE';
export const CATEGORY_UPDATED = 'CATEGORY_UPDATED';
export const CATEGORY_ERROR = 'CATEGORY_ERROR';
export const CATEGORY_CONSUME_PRELOAD = 'CATEGORY_CONSUME_PRELOAD';
export const CATEGORY_INPUT_CHANGE = 'CATEGORY_INPUT_CHANGE';

export const doCategoryReceive = makeActionCreator(CATEGORY_RECEIVE, 'categories', 'moduleid');
export const doCategoryUpdated = makeActionCreator(CATEGORY_UPDATED, 'category');
export const doCategoryError = makeActionCreator(CATEGORY_ERROR, 'error');
export const doCategoryConsumePreload = makeActionCreator(CATEGORY_CONSUME_PRELOAD);
export const doCategoryInputChange = makeActionCreator(CATEGORY_INPUT_CHANGE, 'categoryname');


export function doCategoryFetch(moduleid) {

    return (dispatch, getState) => {
        let cs = getState().categories.index;
        moduleid = moduleid || '';

        if (!cs || cs.length == 0) {
            return FetchUtils.get(dispatch, CATEGORY_URL + '?moduleid=' + moduleid, {}, {action: cs => {
                dispatch(doCategoryReceive(cs, moduleid));
            }}, doCategoryError);
        }
    };
}

export function doCategorySave(category) {
    let cid = category.id;
    let url = CATEGORY_URL + (cid === 'new' ? '' : '/' + cid);

    return dispatch => {
        if (cid === 'new') {
            return FetchUtils.post(dispatch, url, category, doCategoryUpdated, doCategoryError);
        } else {
            return FetchUtils.put(dispatch, url, category, doCategoryUpdated, doCategoryError);
        }
    };
}

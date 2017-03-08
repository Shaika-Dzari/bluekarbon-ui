import { normalize } from '../utils/StateUtils.js';
import {MODULE_LIST_RECEIVE} from '../actions/moduleActions.js';

const initialState = {
    items: {}, index: [], codeindex: {}
}

export const moduleReducers = (state = initialState, action) => {

    switch (action.type) {

        case MODULE_LIST_RECEIVE:
            let normalizeModules = normalize(action.modules);
            return Object.assign({}, state, normalizeModules);

        default:
            return state;
    }
}


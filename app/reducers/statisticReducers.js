import {STATS_RECEIVED} from '../actions/statisticActions.js';

export function statisticReducers(state = {tables: {}, preloaded: false}, action) {
    switch (action.type) {
        case STATS_RECEIVED:
            return Object.assign({}, state, {items: action.stats, preloaded: false});
        default:
            return state;
    }
}

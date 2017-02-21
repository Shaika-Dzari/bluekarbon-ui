import { normalize } from '../utils/StateUtils.js';
import { mkToHtml } from '../utils/HtmlUtils.js';



export function receive(state, newmessages) {
    let recBps = normalize(newmessages);
    return Object.assign({}, state, recBps);
}

export function updateMessageItem(state, id, action) {
    let update = {};
    for (let k in action) {
        if (k != 'type') {
            update[k] = action[k];
        }
    }

    let msg = Object.assign({}, state.items[id], update);
    let newitems = Object.assign({}, state.items, {[id]: msg});

    // Mutation...
    let newstate = Object.assign({}, state, {items: newitems});



    /*
        {
            items : {
                id: {

                }
            },
            index : []
            ...
        }

     */

    return newstate;
}

export function computePrettyUrl(title) {

    let p = title.replace(/[!$?*&#\\]/g, '');
    p = p.replace(/[^a-z0-9_\-]/gi, '_');

    return p.toLowerCase();
}

export function updateCategory(state, action) {
    let csprime = state.items[state.editing].categories ? [...state.items[state.editing].categories] : [];
    if (action.checked) {
        csprime.push({id: action.category.id, name: action.category.name});
    } else {
        let idx = csprime.findIndex(c => c.id == action.category.id);
        if (idx != -1) {
            csprime.splice(idx, 1);
        }
    }

    return updateMessageItem(state, state.editing, {categories: csprime});
}

export function error(action) {
    return {error: '' + action.error};
}

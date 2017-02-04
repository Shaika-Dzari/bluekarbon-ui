import { routerReducer } from 'react-router-redux';

import { combineReducers } from 'redux';
import { messageReducers } from './messageReducers.js';
import { categoryReducers } from './categoryReducers.js';
import { navigationReducers } from './navigationReducers.js';
import { userReducers } from './userReducers.js';
import { fileReducers, fileUploadReducers } from './fileReducers.js';
import { commentReducers } from './commentReducers.js';
import { statisticReducers } from './statisticReducers.js';
import { languageReducers } from './languageReducers.js';
import { blogPostReducers } from './blogPostReducers.js';

const RootReducers = combineReducers({
    navigation: navigationReducers,
    messages: messageReducers,
    comments: commentReducers,
    categories: categoryReducers,
    user: userReducers,
    routing: routerReducer,
    files: fileReducers,
    uploadfiles: fileUploadReducers,
    statistics: statisticReducers,
    language: languageReducers,
    blogposts: blogPostReducers,
    modules: (state = {items: {}, index: [], codeindex: {}}) => state
});

export default RootReducers;
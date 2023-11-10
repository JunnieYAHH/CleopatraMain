import { legacy_createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';

import { productsReducer, productsDetailsReducer } from './reducers/productReducers';

const reducer = combineReducers({
    products: productsReducer,
    productDetails: productsDetailsReducer
})

let initialState = {}

const middleware = [thunk];
const store = legacy_createStore(reducer, initialState, composeWithDevTools(applyMiddleware(...middleware)))

export default store;
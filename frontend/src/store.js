// import { configureStore } from '@reduxjs/toolkit'
import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import { productReducer } from './reducers/productReducer';

const reducer = combineReducers({

    products: productReducer,

});
const initialState = {};

const middleware = [thunk];



const store = createStore(
    reducer,
    initialState,
    composeWithDevTools(applyMiddleware(...middleware))
)
export default store;

//reducers , actions, constants are required

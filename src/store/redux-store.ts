import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from 'redux-thunk';
import gameReducer from "../reducers/gamePage-reducer"


let reducers = combineReducers({
    gamePage : gameReducer
});

let store = createStore(reducers, applyMiddleware(thunk));
export default store;
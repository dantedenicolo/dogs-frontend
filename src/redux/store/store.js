import { createStore, applyMiddleware, compose } from "redux";
import thunkMiddleware from "redux-thunk";
import reducer from "../reducer/reducer";

// Redux DevTools
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

// Creation of the store for global state management
const store = createStore(
	reducer,
	composeEnhancers(applyMiddleware(thunkMiddleware))
);

export default store;

import { combineReducers } from 'redux';
import userReducer from "./user";
import loginReducer from './login';

const rootReducer = combineReducers({
    login: loginReducer,
    user: userReducer
});

export default rootReducer;
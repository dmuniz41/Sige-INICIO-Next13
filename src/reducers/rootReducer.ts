import { combineReducers } from "redux";
import { userReducer } from "./userReducer";
import { workerReducer } from "./workerReducer";

export const rootReducer = combineReducers({
  user: userReducer,
  worker: workerReducer
});
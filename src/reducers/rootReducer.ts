import { combineReducers } from "redux";
import { userReducer } from "./userReducer";
import { workerReducer } from "./workerReducer";
import { warehouseReducer } from "./warehouseReducer";

export const rootReducer = combineReducers({
  user: userReducer,
  worker: workerReducer,
  warehouse: warehouseReducer
});
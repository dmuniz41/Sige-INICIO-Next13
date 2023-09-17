import { combineReducers } from "redux";
import { userReducer } from "./userReducer";
import { workerReducer } from "./workerReducer";
import { warehouseReducer } from "./warehouseReducer";
import { materialReducer } from "./materialReducer";

export const rootReducer = combineReducers({
  user: userReducer,
  worker: workerReducer,
  warehouse: warehouseReducer,
  material: materialReducer
});
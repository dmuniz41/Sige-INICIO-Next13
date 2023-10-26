import { combineReducers } from "redux";
import { userReducer } from "./userReducer";
import { workerReducer } from "./workerReducer";
import { warehouseReducer } from "./warehouseReducer";
import { materialReducer } from "./materialReducer";
import { nomenclatorReducer } from "./nomenclatorReducer";
import { costSheetReducer } from "./costSheetReducer";

export const rootReducer = combineReducers({
  user: userReducer,
  worker: workerReducer,
  warehouse: warehouseReducer,
  material: materialReducer,
  nomenclator: nomenclatorReducer,
  costSheet: costSheetReducer
});
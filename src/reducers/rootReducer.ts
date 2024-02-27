import { combineReducers } from "redux";
import { userReducer } from "./userReducer";
import { workerReducer } from "./workerReducer";
import { warehouseReducer } from "./warehouseReducer";
import { materialReducer } from "./materialReducer";
import { nomenclatorReducer } from "./nomenclatorReducer";
import { costSheetReducer } from "./costSheetReducer";
import { serviceFeeReducer } from "./serviceFeeReducer";
import { projectReducer } from "./projectReducer";
import { offerReducer } from "./offerReducer";

export const rootReducer = combineReducers({
  user: userReducer,
  worker: workerReducer,
  warehouse: warehouseReducer,
  material: materialReducer,
  nomenclator: nomenclatorReducer,
  costSheet: costSheetReducer,
  serviceFee: serviceFeeReducer,
  project: projectReducer,
  offer: offerReducer,
});

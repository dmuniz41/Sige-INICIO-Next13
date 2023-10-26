import { types } from "../types/types";

const initialState = {
  costSheets: [],
};

export const costSheetReducer = (state = initialState, action:any) => {
  switch (action.type) {
    case types.addCostSheet:
      return {
        ...state,
      };
    case types.deleteCostSheet:
      return {
        ...state,
      };
    case types.updateCostSheet:
      return {
        ...state,
      };
    case types.costSheetsLoaded:
      return {
        ...state,
        costSheets: [...action.payload],
      };

    default:
      return state;
  }
};

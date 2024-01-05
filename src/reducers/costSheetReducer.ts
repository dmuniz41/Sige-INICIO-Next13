import { types } from "../types/types";

const initialState = {
  costSheets: [],
  selectedCostSheet: {},
  currencyChange: 120
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
    case types.selectedCostSheet:
      return {
        ...state,
        selectedCostSheet: action.payload,
      };
    case types.setCurrencyChange:
      return {
        ...state,
        currencyChange: action.payload,
      };

    default:
      return state;
  }
};

import { types } from "../types/types";

const initialState = {
  warehouses: []
};

export const warehouseReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case types.addWarehouse:
      return {
        ...state
      };
    case types.deleteWarehouse:
      return {
        ...state
      };
    case types.updateWarehouse:
      return {
        ...state
      };
    case types.warehousesLoaded:
      return {
        ...state,
        warehouses: [...action.payload]
      };
    case types.selectedWarehouse:
      return {
        ...state,
        selectedWarehouse: action.payload
      };

    default:
      return state;
  }
};

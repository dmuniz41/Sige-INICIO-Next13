import { types } from "../types/types";

const initialState = {
  serviceFees: [],
  serviceFeeAuxiliary: {},
};

export const serviceFeeReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case types.updateServiceFeeAuxiliary:
      return {
        ...state,
      };
    case types.serviceFeeAuxiliaryLoaded:
      return {
        ...state,
        serviceFeeAuxiliary: action.payload,
      };
    case types.serviceFeesLoaded:
      return {
        ...state,
        serviceFees: [...action.payload],
      };
    case types.addServiceFee:
      return {
        ...state,
      };
    case types.updateServiceFee:
      return {
        ...state,
      };
    case types.deleteServiceFee:
      return {
        ...state,
      };

    default:
      return state;
  }
};

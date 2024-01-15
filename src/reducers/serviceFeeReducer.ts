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

    default:
      return state;
  }
};

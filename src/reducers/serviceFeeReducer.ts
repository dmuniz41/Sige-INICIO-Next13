import { types } from "../types/types";

const initialState = {
  serviceFees: [],
  serviceFeeAuxiliary: {},
  selectedServiceFee: {},
  serviceFeeTasks: [],
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
    case types.selectedServiceFee:
      return {
        ...state,
        selectedServiceFee: action.payload,
      };
    case types.addServiceFeeTask:
      return {
        ...state,
      };
    case types.deleteServiceFeeTask:
      return {
        ...state,
      };
    case types.updateServiceFeeTask:
      return {
        ...state,
      };
    case types.serviceFeesTasksLoaded:
      return {
        ...state,
        serviceFeeTasks: [...action.payload],
      };

    default:
      return state;
  }
};

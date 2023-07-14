import { types } from "../types/types";

const initialState = {
  workers: [],
};

export const workerReducer = (state = initialState, action:any) => {
  switch (action.type) {
    case types.addWorker:
      return {
        ...state,
      };
    case types.deleteWorker:
      return {
        ...state,
      };
    case types.updateWorker:
      return {
        ...state,
      };
    case types.workersLoaded:
      return {
        ...state,
        workers: [...action.payload],
      };
    case types.selectedWorker:
      return {
        ...state,
        selectedWorker: action.payload,
      };

    default:
      return state;
  }
};

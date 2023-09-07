import { types } from "../types/types";

const initialState = {
  materials: [],
};

export const materialReducer = (state = initialState, action:any) => {
  switch (action.type) {
    case types.addMaterial:
      return {
        ...state,
      };
    case types.deleteMaterial:
      return {
        ...state,
      };
    case types.updateMaterial:
      return {
        ...state,
      };
    case types.materialsLoaded:
      return {
        ...state,
        materials: [...action.payload],
      };

    default:
      return state;
  }
};

import { types } from "../types/types";

const initialState = {
  materials: [],
  lowExistenceMaterials: []
};

export const materialReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case types.addMaterial:
      return {
        ...state
      };
    case types.deleteMaterial:
      return {
        ...state
      };
    // case types.editMinimumExistences:
    //   return {
    //     ...state,
    //   };
    case types.materialsLoaded:
      return {
        ...state,
        materials: [...action.payload]
      };
    case types.lowExistencesMaterials:
      return {
        ...state,
        lowExistenceMaterials: [...action.payload]
      };

    default:
      return state;
  }
};

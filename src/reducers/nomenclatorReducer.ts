import { types } from "../types/types";

const initialState = {
  nomenclators: [],
};

export const nomenclatorReducer = (state = initialState, action:any) => {
  switch (action.type) {
    case types.addNomenclator:
      return {
        ...state,
      };
    case types.deleteNomenclator:
      return {
        ...state,
      };
    case types.updateNomenclator:
      return {
        ...state,
      };
    case types.nomenclatorsLoaded:
      return {
        ...state,
        nomenclators: [...action.payload],
      };

    default:
      return state;
  }
};

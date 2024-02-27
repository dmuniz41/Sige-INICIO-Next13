import { types } from "../types/types";

const initialState = {
  offers: [],
  selectedOffer: {},
};

export const offerReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case types.addOffer:
      return {
        ...state,
      };
    case types.updateOffer:
      return {
        ...state,
      };
    case types.deleteOffer:
      return {
        ...state,
      };
    case types.offersLoaded:
      return {
        ...state,
        offers: [...action.payload],
      };
    case types.selectedOffer:
      return {
        ...state,
        selectedOffer: action.payload,
      };

    default:
      return state;
  }
};

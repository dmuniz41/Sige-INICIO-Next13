import { IOffer } from "@/models/offer";
import { types } from "../types/types";

const initialState: { offers: IOffer[]; selectedOffer: IOffer } = {
  offers: [],
  selectedOffer: {
    _id: "",
    itemsList: [],
    key: "",
    name: "",
    projectName: "",
    projectId: "",
  },
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
    case types.addItemToOffer:
      return {
        ...state,
        selectedOffer: action.payload
      };

    default:
      return state;
  }
};

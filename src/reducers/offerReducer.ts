import { IOffer, IOfferItem } from "@/models/offer";
import { types } from "../types/types";

const initialState: { offers: IOffer[]; selectedOffer: IOffer; currentItem: IOfferItem } = {
  offers: [],
  selectedOffer: {
    _id: "",
    itemsList: [],
    key: "",
    name: "",
    projectName: "",
    projectId: "",
  },
  currentItem: {
    description: "",
    activities: [],
    value: 0,
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
    // case types.setCurrentItem:
    //   return {
    //     ...state,
    //     currentItem: action.payload
    //   };
    case types.setCurrentItem:
      return {
        ...state,
        selectedOffer: {
          ...state.selectedOffer,
          itemsList: [...state.selectedOffer.itemsList, action.payload],
        },
      };
    case types.clearOffer:
      return {
        ...state,
        selectedOffer: {},
        currentItem: {},
      };

    default:
      return state;
  }
};

import { IOffer, IOfferItem } from "@/models/offer";
import { types } from "../types/types";
import { selectedItem } from "@/actions/offer";

const initialState: { offers: IOffer[]; selectedOffer: IOffer; selectedItem: IOfferItem } = {
  offers: [],
  selectedOffer: {
    _id: "",
    itemsList: [],
    key: "",
    projectName: "",
    projectId: ""
  },
  selectedItem: {
    _id: "",
    description: "",
    activities: [],
    value: 0
  }
};

export const offerReducer = (state = initialState, action: any) => {
  console.log("🚀 ~ offerReducer ~ action:", action.payload);
  switch (action.type) {
    case types.addOffer:
      return {
        ...state
      };
    case types.updateOffer:
      return {
        ...state
      };
    case types.deleteOffer:
      return {
        ...state
      };
    case types.offersLoaded:
      return {
        ...state,
        offers: [...action.payload]
      };
    case types.selectedOffer:
      return {
        ...state,
        selectedOffer: action.payload
      };
    case types.setCurrentItem:
      return {
        ...state,
        selectedOffer: {
          ...state.selectedOffer,
          itemsList: [...state.selectedOffer.itemsList, action.payload]
        }
      };
    case types.deleteItem:
      return {
        ...state,
        selectedOffer: {
          ...state.selectedOffer,
          itemsList: state.selectedOffer.itemsList.filter(
            (item) => item.description != action.payload.description
          )
        }
      };
    case types.editItem:
      return {
        ...state,
        itemsList: state.selectedOffer.itemsList.map((item, index, itemList) => {
          if (itemList[index].description === action.payload.description) {
            itemList[index] = { ...action.payload };
            return itemList[index];
          }
        })
      };
    case types.selectedItem:
      return {
        ...state,
        selectedItem: action.payload
      };
    case types.clearOffer:
      return {
        ...state,
        selectedOffer: initialState.selectedOffer
      };

    default:
      return state;
  }
};

import { IActivity, IOffer, IOfferItem } from "@/models/offer";
import { types } from "../types/types";

const initialState: {
  offers: IOffer[];
  selectedOffer: IOffer;
  selectedItem: IOfferItem;
  isItemUpdated: boolean;
  itemUpdated: IOfferItem;
  finalOfferId: string;
  selectedActivity: IActivity;
} = {
  offers: [],
  selectedOffer: {
    _id: "",
    itemsList: [],
    key: "",
    projectName: "",
    projectId: "",
    representationPercentage: 1,
    representativeName: "",
    version: ""
  },
  selectedItem: {
    key: "",
    description: "",
    activities: [],
    value: 0
  },
  selectedActivity: {
    amount: 0,
    description: "",
    price: 0,
    unitMeasure: "",
    // complexity: "Baja",
    value: 0,
    listOfMeasures: [
      {
        amount: 0,
        description: "",
        height: 0,
        unitMeasure: "",
        width: 0
      }
    ]
  },
  itemUpdated: {
    key: "",
    description: "",
    activities: [],
    value: 0
  },
  isItemUpdated: false,
  finalOfferId: ""
};

export const offerReducer = (state = initialState, action: any) => {
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
            (item, index) => item.description !== action.payload
          )
        }
      };
    case types.editItem:
      return {
        ...state,
        itemUpdated: action.payload.item,
        isItemUpdated: action.payload.isItemUpdated
      };
    case types.selectedItem:
      return {
        ...state,
        selectedItem: action.payload
      };
    case types.selectedActivity:
      return {
        ...state,
        selectedActivity: action.payload
      };
    case types.clearOffer:
      return {
        ...state,
        selectedOffer: {
          ...initialState.selectedOffer,
          itemsList: action.payload
        }
      };
    case types.setFinalOffer:
      return {
        ...state,
        finalOfferId: action.payload
      };
    case types.editActivityList:
      return {
        ...state,
        selectedItem: {
          ...state.selectedItem,
          activities: action.payload
        }
      };

    default:
      return state;
  }
};

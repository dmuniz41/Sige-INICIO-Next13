import { types } from "../types/types";

const initialState = {
  nomenclators: [],
  clientNomenclators:[]
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

    // * NOMENCLADORES DE CLIENTES
    case types.addClientNomenclator:
      return {
        ...state,
      };
    case types.deleteClientNomenclator:
      return {
        ...state,
      };
    case types.updateClientNomenclator:
      return {
        ...state,
      };
    case types.clientNomenclatorsLoaded:
      return {
        ...state,
        clientNomenclators: [...action.payload],
      };

    default:
      return state;
  }
};

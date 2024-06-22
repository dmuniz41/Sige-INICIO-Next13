import { types } from "../types/types";

const initialState = {
  nomenclators: [],
  clientNomenclators: [],
  representativeNomenclators: [],
  materialsNomenclators: []
};

export const nomenclatorReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case types.addNomenclator:
      return {
        ...state
      };
    case types.deleteNomenclator:
      return {
        ...state
      };
    case types.updateNomenclator:
      return {
        ...state
      };
    case types.nomenclatorsLoaded:
      return {
        ...state,
        nomenclators: [...action.payload]
      };

    // * NOMENCLADORES DE CLIENTES
    case types.addClientNomenclator:
      return {
        ...state
      };
    case types.deleteClientNomenclator:
      return {
        ...state
      };
    case types.updateClientNomenclator:
      return {
        ...state
      };
    case types.clientNomenclatorsLoaded:
      return {
        ...state,
        clientNomenclators: [...action.payload]
      };

    // * NOMENCLADORES DE REPRESENTANTES
    case types.addRepresentativeNomenclator:
      return {
        ...state
      };
    case types.deleteRepresentativeNomenclator:
      return {
        ...state
      };
    case types.updateRepresentativeNomenclator:
      return {
        ...state
      };
    case types.representativeNomenclatorsLoaded:
      return {
        ...state,
        representativeNomenclators: [...action.payload]
      };

    // * NOMENCLADORES DE MATERIALES
    case types.addMaterialNomenclator:
      return {
        ...state
      };
    case types.deleteMaterialNomenclator:
      return {
        ...state
      };
    case types.updateMaterialNomenclator:
      return {
        ...state
      };
    case types.materialNomenclatorsLoaded:
      return {
        ...state,
        materialsNomenclators: [...action.payload]
      };

    default:
      return state;
  }
};

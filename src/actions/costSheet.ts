import Swal from "sweetalert2";
import { types } from "../types/types";
import { Toast } from "../helpers/customAlert";
import axios, { AxiosError } from "axios";
import { ICostSheet, ICostSheetSubitem } from "@/models/costSheet";
import { nomenclatorsStartLoading } from "./nomenclator";

export const startAddCostSheet = (
  administrativeExpenses: ICostSheetSubitem[] = [],
  approvedBy: string = "",
  artisticTalent: number = 0,
  category: string = "",
  createdBy: string = "",
  description: string = "",
  directSalaries: ICostSheetSubitem[] = [],
  financialExpenses: ICostSheetSubitem[] = [],
  nomenclatorId: string = "",
  otherDirectExpenses: ICostSheetSubitem[] = [],
  payMethod: string = "CONTRACT",
  productionRelatedExpenses: ICostSheetSubitem[] = [],
  rawMaterials: ICostSheetSubitem[] = [],
  rawMaterialsByClient: number = 0,
  representationCost: number = 0,
  taskName: string = "",
  taxExpenses: ICostSheetSubitem[] = [],
  transportationExpenses: ICostSheetSubitem[] = [],
  USDValue: number = 0,
  valuePerUnitMeasure: string = "",
  workersAmount: number = 0
): any => {
  const token = localStorage.getItem("accessToken");
  return async (dispatch: any) => {
    await axios
      .post(
        `${process.env.NEXT_PUBLIC_API_URL}/costSheet`,
        {
          administrativeExpenses,
          approvedBy,
          artisticTalent,
          category,
          createdBy,
          description,
          directSalaries,
          financialExpenses,
          nomenclatorId,
          otherDirectExpenses,
          payMethod,
          productionRelatedExpenses,
          rawMaterials,
          rawMaterialsByClient,
          representationCost,
          taskName,
          taxExpenses,
          transportationExpenses,
          USDValue,
          valuePerUnitMeasure,
          workersAmount,
        },
        { headers: { accessToken: token } }
      )
      .then((CostSheet) => {
        dispatch(
          addCostSheet(
            CostSheet.data.administrativeExpenses,
            CostSheet.data.approvedBy,
            CostSheet.data.artisticTalent,
            CostSheet.data.category,
            CostSheet.data.createdBy,
            CostSheet.data.description,
            CostSheet.data.directSalaries,
            CostSheet.data.financialExpenses,
            CostSheet.data.nomenclatorId,
            CostSheet.data.otherDirectExpenses,
            CostSheet.data.payMethod,
            CostSheet.data.productionRelatedExpenses,
            CostSheet.data.rawMaterials,
            CostSheet.data.rawMaterialsByClient,
            CostSheet.data.representationCost,
            CostSheet.data.taskName,
            CostSheet.data.taxExpenses,
            CostSheet.data.transportationExpenses,
            CostSheet.data.USDValue,
            CostSheet.data.valuePerUnitMeasure,
            CostSheet.data.workersAmount
          )
        );
        dispatch(nomenclatorsStartLoading());
        dispatch(costSheetsStartLoading());
        Toast.fire({
          icon: "success",
          title: "Ficha de Costo Creada",
        });
      })
      .catch((error: AxiosError) => {
        let { message }: any = error.response?.data;
        console.log("🚀 ~ file: costSheet.ts:96 ~ return ~ message:", message)
        Swal.fire("Error", 'Error al crear la ficha de costo', "error");
      });
  };
};
export const startUpdateCostSheet = (
  _id: string,
  administrativeExpenses: ICostSheetSubitem[] = [],
  approvedBy: string = "",
  artisticTalent: number = 0,
  category: string = "",
  createdBy: string = "",
  description: string = "",
  directSalaries: ICostSheetSubitem[] = [],
  financialExpenses: ICostSheetSubitem[] = [],
  otherDirectExpenses: ICostSheetSubitem[] = [],
  payMethod: string = "CONTRACT",
  productionRelatedExpenses: ICostSheetSubitem[] = [],
  rawMaterials: ICostSheetSubitem[] = [],
  rawMaterialsByClient: number = 0,
  representationCost: number = 0,
  taskName: string = "",
  taxExpenses: ICostSheetSubitem[] = [],
  transportationExpenses: ICostSheetSubitem[] = [],
  USDValue: number = 0,
  valuePerUnitMeasure: string = "",
  workersAmount: number = 0
): any => {
  const token = localStorage.getItem("accessToken");
  return async (dispatch: any) => {
    await axios
      .put(
        `${process.env.NEXT_PUBLIC_API_URL}/costSheet`,
        {
          _id,
          administrativeExpenses,
          approvedBy,
          artisticTalent,
          category,
          createdBy,
          description,
          directSalaries,
          financialExpenses,
          otherDirectExpenses,
          payMethod,
          productionRelatedExpenses,
          rawMaterials,
          rawMaterialsByClient,
          representationCost,
          taskName,
          taxExpenses,
          transportationExpenses,
          USDValue,
          valuePerUnitMeasure,
          workersAmount,
        },
        { headers: { accessToken: token } }
      )
      .then((CostSheet) => {
        dispatch(
          updateCostSheet(
            CostSheet.data._id,
            CostSheet.data.administrativeExpenses,
            CostSheet.data.approvedBy,
            CostSheet.data.artisticTalent,
            CostSheet.data.category,
            CostSheet.data.createdBy,
            CostSheet.data.description,
            CostSheet.data.directSalaries,
            CostSheet.data.financialExpenses,
            CostSheet.data.otherDirectExpenses,
            CostSheet.data.payMethod,
            CostSheet.data.productionRelatedExpenses,
            CostSheet.data.rawMaterials,
            CostSheet.data.rawMaterialsByClient,
            CostSheet.data.representationCost,
            CostSheet.data.taskName,
            CostSheet.data.taxExpenses,
            CostSheet.data.transportationExpenses,
            CostSheet.data.USDValue,
            CostSheet.data.valuePerUnitMeasure,
            CostSheet.data.workersAmount
          )
        );
        dispatch(costSheetsStartLoading());
        Toast.fire({
          icon: "success",
          title: `Ficha de Costo Actualizada`,
        });
      })
      .catch((error: AxiosError) => {
        let { message }: any = error.response?.data;
        console.log("🚀 ~ file: costSheet.ts:188 ~ return ~ message:", message)
        Swal.fire("Error", 'Error al editar la ficha de costo', "error");
      });
  };
};
export const startDeleteCostSheet = (id: string): any => {
  const token = localStorage.getItem("accessToken");
  return async (dispatch: any) => {
    await axios
      .patch(`${process.env.NEXT_PUBLIC_API_URL}/costSheet`, { id }, { headers: { accessToken: token } })
      .then(() => {
        dispatch(deleteCostSheet(id));
        dispatch(costSheetsStartLoading());
        Toast.fire({
          icon: "success",
          title: "Ficha de Costo Eliminada",
        });
      })
      .catch((error: AxiosError) => {
        let { message }: any = error.response?.data;
        console.log("🚀 ~ file: costSheet.ts:208 ~ return ~ message:", message)
        Swal.fire("Error", 'Error al eliminar la ficha de costo', "error");
      });
  };
};
export const costSheetsStartLoading = () => {
  const token = localStorage.getItem("accessToken");
  return async (dispatch: any) => {
    await axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/costSheet`, { headers: { accessToken: token } })
      .then((resp) => {
        let { listOfCostSheets } = resp.data;
        dispatch(costSheetsLoaded(listOfCostSheets));
      })
      .catch((error: AxiosError) => {
        let { message }: any = error.response?.data;
        console.log("🚀 ~ file: costSheet.ts:221 ~ return ~ message:", message)
        Swal.fire("Error", 'Error al cargar las fichas de costo', "error");
      });
  };
};
export const loadSelectedCostSheet = (id: string) => {
  const token = localStorage.getItem("accessToken");
  return async (dispatch: any) => {
    await axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/costSheet/${id}`, { headers: { accessToken: token } })
      .then((resp) => {
        let { BDCostSheet } = resp.data;
        dispatch(selectedCostSheet(BDCostSheet));
      })
      .catch((error: AxiosError) => {
        let { message }: any = error.response?.data;
        console.log("🚀 ~ file: costSheet.ts:240 ~ return ~ message:", message)
        Swal.fire("Error", 'Error al cargar la ficha de costo seleccionada', "error");
      });
  };
};
export const startSetCurrencyChange = (currencyChange: number, listOfCostSheets: ICostSheet[]): any => {
  return async (dispatch: any) => {
    listOfCostSheets.map((costSheet: ICostSheet) => {
      dispatch(
        startUpdateCostSheet(
          costSheet._id,
          costSheet.administrativeExpenses,
          costSheet.approvedBy,
          costSheet.artisticTalent,
          costSheet.category,
          costSheet.createdBy,
          costSheet.description,
          costSheet.directSalaries,
          costSheet.financialExpenses,
          costSheet.otherDirectExpenses,
          costSheet.payMethod,
          costSheet.productionRelatedExpenses,
          costSheet.rawMaterials,
          costSheet.rawMaterialsByClient,
          costSheet.representationCost,
          costSheet.taskName,
          costSheet.taxExpenses,
          costSheet.transportationExpenses,
          currencyChange,
          costSheet.valuePerUnitMeasure,
          costSheet.workersAmount
        )
      );
    });
    dispatch(costSheetsStartLoading());
    dispatch(setCurrencyChange(currencyChange));
    Toast.fire({
      icon: "success",
      title: "Tasa de Cambio Actualizada",
    });
  };
};
export const startLoadCurrencyChange = (): any => {
  const token = localStorage.getItem("accessToken");
  return async (dispatch: any) => {
    await axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/costSheet`, { headers: { accessToken: token } })
      .then((resp) => {
        let { listOfCostSheets } = resp.data;
        dispatch(setCurrencyChange(listOfCostSheets[0].USDValue));
      })
      .catch((error: AxiosError) => {
        let { message }: any = error.response?.data;
        console.log("🚀 ~ file: costSheet.ts:288 ~ return ~ message:", message)
        Swal.fire("Error", 'Error al cargar el valor del cambio de moneda', "error");
      });
  };
};

const addCostSheet = (
  administrativeExpenses: ICostSheetSubitem[],
  approvedBy: string,
  artisticTalent: number,
  category: string,
  createdBy: string,
  description: string,
  directSalaries: ICostSheetSubitem[],
  financialExpenses: ICostSheetSubitem[],
  nomenclatorId: string,
  otherDirectExpenses: ICostSheetSubitem[],
  payMethod: string,
  productionRelatedExpenses: ICostSheetSubitem[],
  rawMaterials: ICostSheetSubitem[],
  rawMaterialsByClient: number,
  representationCost: number,
  taskName: string,
  taxExpenses: ICostSheetSubitem[],
  transportationExpenses: ICostSheetSubitem[],
  USDValue: number,
  valuePerUnitMeasure: string,
  workersAmount: number
) => ({
  type: types.addCostSheet,
  payload: {
    administrativeExpenses,
    approvedBy,
    artisticTalent,
    category,
    createdBy,
    description,
    directSalaries,
    financialExpenses,
    nomenclatorId,
    otherDirectExpenses,
    payMethod,
    productionRelatedExpenses,
    rawMaterials,
    rawMaterialsByClient,
    representationCost,
    taskName,
    taxExpenses,
    transportationExpenses,
    USDValue,
    valuePerUnitMeasure,
    workersAmount,
  },
});

const updateCostSheet = (
  _id: string,
  administrativeExpenses: ICostSheetSubitem[],
  approvedBy: string,
  artisticTalent: number,
  category: string,
  createdBy: string,
  description: string,
  directSalaries: ICostSheetSubitem[],
  financialExpenses: ICostSheetSubitem[],
  otherDirectExpenses: ICostSheetSubitem[],
  payMethod: string,
  productionRelatedExpenses: ICostSheetSubitem[],
  rawMaterials: ICostSheetSubitem[],
  rawMaterialsByClient: number,
  representationCost: number,
  taskName: string,
  taxExpenses: ICostSheetSubitem[],
  transportationExpenses: ICostSheetSubitem[],
  USDValue: number,
  valuePerUnitMeasure: string,
  workersAmount: number
) => ({
  type: types.updateCostSheet,
  payload: {
    _id,
    administrativeExpenses,
    approvedBy,
    artisticTalent,
    category,
    createdBy,
    description,
    directSalaries,
    financialExpenses,
    otherDirectExpenses,
    payMethod,
    productionRelatedExpenses,
    rawMaterials,
    rawMaterialsByClient,
    representationCost,
    taskName,
    taxExpenses,
    transportationExpenses,
    USDValue,
    valuePerUnitMeasure,
    workersAmount,
  },
});
export const costSheetsLoaded = (costSheets: any) => ({
  type: types.costSheetsLoaded,
  payload: costSheets,
});
const deleteCostSheet = (id: string) => ({
  type: types.deleteCostSheet,
  payload: {
    id,
  },
});
const selectedCostSheet = (costSheet: any) => ({
  type: types.selectedCostSheet,
  payload: costSheet,
});

export const setCurrencyChange = (currencyChange: number) => ({
  type: types.setCurrencyChange,
  payload: currencyChange,
});

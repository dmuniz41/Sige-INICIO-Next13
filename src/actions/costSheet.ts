import Swal from "sweetalert2";
import { types } from "../types/types";
import { Toast } from "../helpers/customAlert";
import axios, { AxiosError } from "axios";
import { ICostSheetSubitem } from "@/models/costSheet";
import { nomenclatorsStartLoading, startAddNomenclator } from "./nomenclator";

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
  USDValue: number = 250,
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
            CostSheet.data.workersAmount
          )
        );
        // dispatch(startAddNomenclator("Ficha de costo", nomenclatorId));
        dispatch(nomenclatorsStartLoading());
        dispatch(costSheetsStartLoading());
        Toast.fire({
          icon: "success",
          title: "Ficha de Costo Creada",
        });
      })
      .catch((error: AxiosError) => {
        let { message }: any = error.response?.data;
        Swal.fire("Error", message, "error");
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
  USDValue: number = 250,
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
        Swal.fire("Error", message, "error");
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
        Swal.fire("Error", message, "error");
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
        Swal.fire("Error", message, "error");
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
        Swal.fire("Error", message, "error");
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

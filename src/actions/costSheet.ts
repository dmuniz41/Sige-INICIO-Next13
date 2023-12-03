import Swal from "sweetalert2";
import { types } from "../types/types";
import { Toast } from "../helpers/customAlert";
import axios, { AxiosError } from "axios";
import { ICostSheetSubitem } from "@/models/costSheet";

export const startAddCostSheet = (
  taskName: string = "",
  payMethod: string = "CONTRACT",
  createdBy: string = "",
  approvedBy: string = "",
  description: string = "",
  USDValue: number = 250,
  workersAmount: number = 0,
  rawMaterials: ICostSheetSubitem[] = [],
  directSalaries: ICostSheetSubitem[] = [],
  otherDirectExpenses: ICostSheetSubitem[] = [],
  productionRelatedExpenses: ICostSheetSubitem[] = [],
  administrativeExpenses: ICostSheetSubitem[] = [],
  transportationExpenses: ICostSheetSubitem[] = [],
  financialExpenses: ICostSheetSubitem[] = [],
  taxExpenses: ICostSheetSubitem[] = [],
  artisticTalent: number = 0,
  representationCost: number = 0,
  rawMaterialsByClient: number = 0
): any => {
  const token = localStorage.getItem("accessToken");
  return async (dispatch: any) => {
    await axios
      .post(
        `${process.env.NEXT_PUBLIC_API_URL}/costSheet`,
        {
          taskName,
          payMethod,
          createdBy,
          approvedBy,
          description,
          USDValue,
          workersAmount,
          rawMaterials,
          directSalaries,
          otherDirectExpenses,
          productionRelatedExpenses,
          administrativeExpenses,
          transportationExpenses,
          financialExpenses,
          taxExpenses,
          artisticTalent,
          representationCost,
          rawMaterialsByClient,
        },
        { headers: { accessToken: token } }
      )
      .then(() => {
        dispatch(
          addCostSheet(
            taskName,
            payMethod,
            createdBy,
            approvedBy,
            description,
            USDValue,
            workersAmount,
            rawMaterials,
            directSalaries,
            otherDirectExpenses,
            productionRelatedExpenses,
            administrativeExpenses,
            transportationExpenses,
            financialExpenses,
            taxExpenses,
            artisticTalent,
            representationCost,
            rawMaterialsByClient
          )
        );
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
  taskName: string = "",
  payMethod: string = "CONTRACT",
  createdBy: string = "",
  approvedBy: string = "",
  description: string = "",
  USDValue: number = 250,
  workersAmount: number = 0,
  rawMaterials: ICostSheetSubitem[] = [],
  directSalaries: ICostSheetSubitem[] = [],
  otherDirectExpenses: ICostSheetSubitem[] = [],
  productionRelatedExpenses: ICostSheetSubitem[] = [],
  administrativeExpenses: ICostSheetSubitem[] = [],
  transportationExpenses: ICostSheetSubitem[] = [],
  financialExpenses: ICostSheetSubitem[] = [],
  taxExpenses: ICostSheetSubitem[] = [],
  artisticTalent: number = 0,
  representationCost: number = 0,
  rawMaterialsByClient: number = 0
): any => {
  const token = localStorage.getItem("accessToken");
  return async (dispatch: any) => {
    await axios
      .put(
        `${process.env.NEXT_PUBLIC_API_URL}/costSheet`,
        {
          taskName,
          payMethod,
          createdBy,
          approvedBy,
          description,
          USDValue,
          workersAmount,
          rawMaterials,
          directSalaries,
          otherDirectExpenses,
          productionRelatedExpenses,
          administrativeExpenses,
          transportationExpenses,
          financialExpenses,
          taxExpenses,
          artisticTalent,
          representationCost,
          rawMaterialsByClient,
        },
        { headers: { accessToken: token } }
      )
      .then(() => {
        dispatch(
          updateCostSheet(
            taskName,
            payMethod,
            createdBy,
            approvedBy,
            description,
            USDValue,
            workersAmount,
            rawMaterials,
            directSalaries,
            otherDirectExpenses,
            productionRelatedExpenses,
            administrativeExpenses,
            transportationExpenses,
            financialExpenses,
            taxExpenses,
            artisticTalent,
            representationCost,
            rawMaterialsByClient
          )
        );
        dispatch(costSheetsStartLoading());
        Toast.fire({
          icon: "success",
          title: `Ficha de Costo ${taskName} Actualizada`,
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
export const costSheetsLoaded = (costSheets: any) => ({
  type: types.costSheetsLoaded,
  payload: costSheets,
});
const addCostSheet = (
  taskName: string,
  payMethod: string,
  createdBy: string,
  approvedBy: string,
  description: string,
  USDValue: number,
  workersAmount: number,
  rawMaterials: ICostSheetSubitem[],
  directSalaries: ICostSheetSubitem[],
  otherDirectExpenses: ICostSheetSubitem[],
  productionRelatedExpenses: ICostSheetSubitem[],
  administrativeExpenses: ICostSheetSubitem[],
  transportationExpenses: ICostSheetSubitem[],
  financialExpenses: ICostSheetSubitem[],
  taxExpenses: ICostSheetSubitem[],
  artisticTalent: number,
  representationCost: number,
  rawMaterialsByClient: number
) => ({
  type: types.addCostSheet,
  payload: {
    taskName,
    payMethod,
    createdBy,
    approvedBy,
    description,
    USDValue,
    workersAmount,
    rawMaterials,
    directSalaries,
    otherDirectExpenses,
    productionRelatedExpenses,
    administrativeExpenses,
    transportationExpenses,
    financialExpenses,
    taxExpenses,
    artisticTalent,
    representationCost,
    rawMaterialsByClient,
  },
});
const updateCostSheet = (
  taskName: string,
  payMethod: string,
  createdBy: string,
  approvedBy: string,
  description: string,
  USDValue: number,
  workersAmount: number,
  rawMaterials: ICostSheetSubitem[],
  directSalaries: ICostSheetSubitem[],
  otherDirectExpenses: ICostSheetSubitem[],
  productionRelatedExpenses: ICostSheetSubitem[],
  administrativeExpenses: ICostSheetSubitem[],
  transportationExpenses: ICostSheetSubitem[],
  financialExpenses: ICostSheetSubitem[],
  taxExpenses: ICostSheetSubitem[],
  artisticTalent: number,
  representationCost: number,
  rawMaterialsByClient: number
) => ({
  type: types.updateCostSheet,
  payload: {
    taskName,
    payMethod,
    createdBy,
    approvedBy,
    description,
    USDValue,
    workersAmount,
    rawMaterials,
    directSalaries,
    otherDirectExpenses,
    productionRelatedExpenses,
    administrativeExpenses,
    transportationExpenses,
    financialExpenses,
    taxExpenses,
    artisticTalent,
    representationCost,
    rawMaterialsByClient,
  },
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

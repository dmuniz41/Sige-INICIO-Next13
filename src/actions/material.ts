import Swal from "sweetalert2";
import axios, { AxiosError } from "axios";

import { types } from "../types/types";
import { Toast } from "../helpers/customAlert";
import { IOperation } from "@/models/operation";

export const startAddMaterial = (
  warehouse: string,
  operation: IOperation,
  materialName: string,
  category: string,
  unitMeasure: string,
  costPerUnit: number,
  minimumExistence: number
): any => {
  const token = localStorage.getItem("accessToken");
  return async (dispatch: any) => {
    await axios
      .post(
        `${process.env.NEXT_PUBLIC_API_URL}/material`,
        { operation, warehouse, category, materialName, unitMeasure, costPerUnit, minimumExistence },
        { headers: { accessToken: token } }
      )
      .then(() => {
        let code = `${category}${materialName}${costPerUnit}`;
        dispatch(addMaterial(code, materialName, category, costPerUnit, minimumExistence, unitMeasure));
        dispatch(materialsStartLoading(warehouse));

        if (operation.tipo === "Sustraer") {
          Toast.fire({
            icon: "success",
            title: "Material Sustraído",
          });
        } else {
          Toast.fire({
            icon: "success",
            title: "Material Añadido",
          });
        }
      })
      .catch((error: AxiosError) => {
        let { message }: any = error.response?.data;
        Swal.fire("Error", message, "error");
      });
  };
};

export const materialsStartLoading = (id: string) => {
  const token = localStorage.getItem("accessToken");
  return async (dispatch: any) => {
    await axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/material/${id}`, { headers: { accessToken: token } })
      .then((resp) => {
        let { listOfMaterials } = resp.data;
        dispatch(materialsLoaded(listOfMaterials));
      })
      .catch((error: AxiosError) => {
        let { message }: any = error.response?.data;
        Swal.fire("Error", message, "error");
      });
  };
};

export const startDeleteMaterial = (code: string, warehouse: string): any => {
  const token = localStorage.getItem("accessToken");
  return async (dispatch: any) => {
    await axios
      .patch(`${process.env.NEXT_PUBLIC_API_URL}/material`, { code, warehouse }, { headers: { accessToken: token } })
      .then(() => {
        dispatch(deleteMaterial(code));
        dispatch(materialsStartLoading(warehouse));
        Toast.fire({
          icon: "success",
          title: "Material Eliminado",
        });
      })
      .catch((error: AxiosError) => {
        let { message }: any = error.response?.data;
        Swal.fire("Error", message, "error");
      });
  };
};

export const editMinimumExistences = (code: string, minimumExistence: number, warehouse: string): any => {
  const token = localStorage.getItem("accessToken");
  return async (dispatch: any) => {
    await axios
      .put(`${process.env.NEXT_PUBLIC_API_URL}/material`, { minimumExistence, code, warehouse }, { headers: { accessToken: token } })
      .then(() => {
        dispatch(updateMaterial(code,minimumExistence));
        dispatch(materialsStartLoading(warehouse));
        Toast.fire({
          icon: "success",
          title: "Existencias mínimas actualizadas",
        });
      })
      .catch((error: AxiosError) => {
        let { message }: any = error.response?.data;
        Swal.fire("Error", message, "error");
      });
  };
};

const addMaterial = (code: string, materialName: string, category: string, costPerUnit: number, minimumExistence: number, unitMeasure?: string) => ({
  type: types.addWarehouse,
  payload: {
    code,
    materialName,
    category,
    costPerUnit,
    minimumExistence,
    unitMeasure,
  },
});

export const materialsLoaded = (materials: any) => ({
  type: types.materialsLoaded,
  payload: materials,
});

const deleteMaterial = (code: string) => ({
  type: types.deleteMaterial,
  payload: {
    code,
  },
});

const updateMaterial = (code: string, minimumExistence: number) => ({
  type: types.editMinimumExistences,
  payload: {
    code,
    minimumExistence,
  },
});

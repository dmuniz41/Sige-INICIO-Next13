import Swal from "sweetalert2";
import axios, { AxiosError } from "axios";

import { types } from "../types/types";
import { Toast } from "../helpers/customAlert";
import { IOperation } from "@/models/operation";

export const startAddMaterial = (
  category: string,
  costPerUnit: number,
  description: string,
  enterDate: string,
  materialName: string,
  minimumExistence: number,
  operation: IOperation,
  provider: string,
  unitMeasure: string,
  warehouse: string
): any => {
  const token = localStorage.getItem("accessToken");
  return async (dispatch: any) => {
    await axios
      .post(
        `${process.env.NEXT_PUBLIC_API_URL}/material`,
        { operation, description, warehouse, category, materialName, unitMeasure, costPerUnit, minimumExistence, provider, enterDate },
        { headers: { accessToken: token } }
      )
      .then(() => {
        let code = `${category}${materialName}${costPerUnit}`;
        dispatch(addMaterial(category, code, costPerUnit, description, enterDate, materialName, minimumExistence, provider, unitMeasure));
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

export const editMaterial = (code: string, minimumExistence: number, materialName: string, warehouse: string): any => {
  const token = localStorage.getItem("accessToken");
  return async (dispatch: any) => {
    await axios
      .put(`${process.env.NEXT_PUBLIC_API_URL}/material`, { minimumExistence, code, warehouse, materialName }, { headers: { accessToken: token } })
      .then(() => {
        dispatch(updateMaterial(code, minimumExistence, materialName));
        dispatch(materialsStartLoading(warehouse));
        Toast.fire({
          icon: "success",
          title: "Material actualizado",
        });
      })
      .catch((error: AxiosError) => {
        let { message }: any = error.response?.data;
        Swal.fire("Error", message, "error");
      });
  };
};

const addMaterial = (
  category: string,
  code: string,
  costPerUnit: number,
  description: string,
  enterDate: string,
  materialName: string,
  minimumExistence: number,
  provider: string,
  unitMeasure: string
) => ({
  type: types.addWarehouse,
  payload: {
    category,
    code,
    costPerUnit,
    description,
    enterDate,
    materialName,
    minimumExistence,
    provider,
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

const updateMaterial = (code: string, minimumExistence: number, materialName: string) => ({
  type: types.editMaterial,
  payload: {
    code,
    materialName,
    minimumExistence,
  },
});

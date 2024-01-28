import Swal from "sweetalert2";
import axios, { AxiosError } from "axios";

import { types } from "../types/types";
import { Toast } from "../helpers/customAlert";
import { IOperation } from "@/models/operation";
import { IMaterial } from "@/models/material";

export const startAddMaterial = ({ ...material }): any => {
  const token = localStorage.getItem("accessToken");
  return async (dispatch: any) => {
    await axios
      .post(
        `${process.env.NEXT_PUBLIC_API_URL}/material`,
        {
          category: material.category,
          costPerUnit: material.costPerUnit,
          description: material.description,
          enterDate: material.enterDate,
          materialName: material.materialName,
          minimumExistence: material.minimumExistence,
          operation: material.operation,
          provider: material.provider,
          unitMeasure: material.unitMeasure,
          warehouse: material.warehouse,
        },

        { headers: { accessToken: token } }
      )
      .then(() => {
        dispatch(addMaterial(material));
        dispatch(materialsStartLoading(material?.warehouse));

        if (material.operation.tipo === "Sustraer") {
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

export const editMaterial = (category: string, code: string, description: string, materialName: string, minimumExistence: number, warehouse: string): any => {
  const token = localStorage.getItem("accessToken");
  return async (dispatch: any) => {
    await axios
      .put(`${process.env.NEXT_PUBLIC_API_URL}/material`, { category, minimumExistence, code, warehouse, materialName, description }, { headers: { accessToken: token } })
      .then(() => {
        dispatch(updateMaterial(code, minimumExistence, materialName, description));
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

const addMaterial = ({ ...material }) => ({
  type: types.addWarehouse,
  payload: {
    category: material.category,
    costPerUnit: material.costPerUnit,
    description: material.description,
    enterDate: material.enterDate,
    materialName: material.materialName,
    minimumExistence: material.minimumExistence,
    operation: material.operation,
    provider: material.provider,
    unitMeasure: material.unitMeasure,
    warehouse: material.warehouse,
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

const updateMaterial = (code: string, minimumExistence: number, materialName: string, description: string) => ({
  type: types.editMaterial,
  payload: {
    code,
    description,
    materialName,
    minimumExistence,
  },
});

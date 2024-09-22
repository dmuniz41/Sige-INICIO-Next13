import Swal from "sweetalert2";
import axios, { AxiosError } from "axios";

import { types } from "../types/types";
import { Toast } from "../helpers/customAlert";

/**
 *
 * @param material: IMaterial
 * @returns Success message if the material was created successfully
 */
export const startAddMaterial = ({ ...material }): any => {
  const token = localStorage.getItem("accessToken");
  return async (dispatch: any) => {
    await axios
      .post(`${process.env.NEXT_PUBLIC_API_URL}/material`, { ...material }, { headers: { accessToken: token } })
      .then(() => {
        dispatch(addMaterial(material));
        dispatch(materialsStartLoading(material?.warehouse));
        if (material.operation.tipo === "Sustraer") {
          Toast.fire({
            icon: "success",
            title: "Material Sustraído"
          });
        } else {
          Toast.fire({
            icon: "success",
            title: "Material Añadido"
          });
        }
      })
      .catch((error: AxiosError) => {
        let { message }: any = error.response?.data;
        console.log("🚀 ~ return ~ message:", message);
        Swal.fire("Error", "Error al crear el material", "error");
      });
  };
};

/**
 *
 * @param warehouseId
 * @returns List of all materials inside a warehouse
 */
export const materialsStartLoading = (warehouseId: string) => {
  const token = localStorage.getItem("accessToken");
  return async (dispatch: any) => {
    await axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/material/${warehouseId}`, { headers: { accessToken: token } })
      .then((resp) => {
        let { listOfMaterials } = resp.data;
        dispatch(materialsLoaded(listOfMaterials));
      })
      .catch((error: AxiosError) => {
        let { message }: any = error.response?.data;
        console.log("🚀 ~ return ~ message:", message);
        Swal.fire("Error", "Error al cargar el material", "error");
      });
  };
};

/**
 *
 * @param materialCode
 * @param warehouseId
 * @returns Success message if the material was deleted successfully
 */
export const startDeleteMaterial = (materialCode: string, warehouseId: string): any => {
  const token = localStorage.getItem("accessToken");
  return async (dispatch: any) => {
    await axios
      .delete(`${process.env.NEXT_PUBLIC_API_URL}/material?code=${materialCode}&warehouse=${warehouseId}`, {
        headers: { accessToken: token }
      })
      .then(() => {
        dispatch(deleteMaterial(materialCode));
        dispatch(materialsStartLoading(warehouseId));
        Toast.fire({
          icon: "success",
          title: "Material Eliminado"
        });
      })
      .catch((error: AxiosError) => {
        let { message }: any = error.response?.data;
        console.log("🚀 ~ return ~ message:", message);
        Swal.fire("Error", "Error al eliminar el material", "error");
      });
  };
};

/**
 *
 * @param category
 * @param code
 * @param description
 * @param materialName
 * @param minimumExistence
 * @param warehouse
 * @returns Success message if the material was edited successfully
 */
export const editMaterial = (
  category: string,
  code: string,
  description: string,
  materialName: string,
  minimumExistence: number,
  warehouse: string
): any => {
  const token = localStorage.getItem("accessToken");
  return async (dispatch: any) => {
    await axios
      .put(
        `${process.env.NEXT_PUBLIC_API_URL}/material`,
        { category, minimumExistence, code, warehouse, materialName, description },
        { headers: { accessToken: token } }
      )
      .then(() => {
        dispatch(updateMaterial(code, minimumExistence, materialName, description));
        dispatch(materialsStartLoading(warehouse));
        Toast.fire({
          icon: "success",
          title: "Material actualizado"
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
    ...material
  }
});

export const materialsLoaded = (materials: any) => ({
  type: types.materialsLoaded,
  payload: materials
});

const deleteMaterial = (code: string) => ({
  type: types.deleteMaterial,
  payload: {
    code
  }
});

const updateMaterial = (code: string, minimumExistence: number, materialName: string, description: string) => ({
  type: types.editMaterial,
  payload: {
    code,
    description,
    materialName,
    minimumExistence
  }
});

import Swal from "sweetalert2";
import axios, { AxiosError } from "axios";

import { types } from "../types/types";
import { Toast } from "../helpers/customAlert";

// * CREA UN NUEVO MATERIAL * //
export const startAddMaterial = ({ ...material }): any => {
  const token = localStorage.getItem("accessToken");
  return async (dispatch: any) => {
    await axios
      .post(
        `${process.env.NEXT_PUBLIC_API_URL}/material`,
        {
          ...material
        },

        { headers: { accessToken: token } }
      )
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

// * CARGA UN MATERIAL POR SU ID * //
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
        console.log("🚀 ~ return ~ message:", message);
        Swal.fire("Error", "Error al cargar el material", "error");
      });
  };
};

// * ELIMINA UN MATERIAL POR SU CODIGO EN EL ALMACEN SELECCIONADO * //
export const startDeleteMaterial = (code: string, warehouse: string): any => {
  const token = localStorage.getItem("accessToken");
  return async (dispatch: any) => {
    await axios
      .delete(
        `${process.env.NEXT_PUBLIC_API_URL}/material?code=${code}&warehouse=${warehouse}`,
        { headers: { accessToken: token } }
      )
      .then(() => {
        dispatch(deleteMaterial(code));
        dispatch(materialsStartLoading(warehouse));
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

// * EDITA EL MATERIAL SELECCIONADO * //
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

const updateMaterial = (
  code: string,
  minimumExistence: number,
  materialName: string,
  description: string
) => ({
  type: types.editMaterial,
  payload: {
    code,
    description,
    materialName,
    minimumExistence
  }
});

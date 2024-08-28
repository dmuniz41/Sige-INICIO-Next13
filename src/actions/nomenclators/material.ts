import axios, { AxiosError } from "axios";
import Swal from "sweetalert2";

import { Toast } from "@/helpers/customAlert";
import { types } from "@/types/types";

/**
 *
 * @param materialNomenclator: IMaterialNomenclator
 * @returns Success message if the material nomenclator was created successfully
 */
export const startAddMaterialNomenclator = ({ ...materialNomenclator }): any => {
  const token = localStorage.getItem("accessToken");
  return async (dispatch: any) => {
    await axios
      .post(`${process.env.NEXT_PUBLIC_API_URL}/nomenclators/material`, { ...materialNomenclator }, { headers: { accessToken: token } })
      .then(() => {
        dispatch(addMaterialNomenclator(materialNomenclator));
        dispatch(materialNomenclatorsStartLoading());
        Toast.fire({
          icon: "success",
          title: "Nomenclador de Material Creado"
        });
      })
      .catch((error: AxiosError) => {
        let { message }: any = error.response?.data;
        console.log("🚀 ~ return ~ message:", message);
        Swal.fire("Error", "Error al crear el nomenclador de material", "error");
      });
  };
};

/**
 *
 * @param materialNomenclator: IMaterialNomenclator
 * @returns Success message if the material nomenclator was updated successfully
 */
export const startUpdateMaterialNomenclator = ({ ...materialNomenclator }): any => {
  const token = localStorage.getItem("accessToken");
  return async (dispatch: any) => {
    await axios
      .put(`${process.env.NEXT_PUBLIC_API_URL}/nomenclators/material`, { ...materialNomenclator }, { headers: { accessToken: token } })
      .then(() => {
        dispatch(updateMaterialNomenclator(materialNomenclator));
        dispatch(materialNomenclatorsStartLoading());
        Toast.fire({
          icon: "success",
          title: "Nomenclador de Material Actualizado"
        });
      })
      .catch((error: AxiosError) => {
        let { message }: any = error.response?.data;
        console.log("🚀 ~ return ~ message:", message);
        Swal.fire("Error", "Error al editar el nomenclador de material", "error");
      });
  };
};

/**
 *
 * @param id
 * @returns Success message if the material nomenclator was deleted successfully
 */
export const startDeleteMaterialNomenclator = (id: string): any => {
  const token = localStorage.getItem("accessToken");
  return async (dispatch: any) => {
    await axios
      .delete(`${process.env.NEXT_PUBLIC_API_URL}/nomenclators/material?id=${id}`, {
        headers: { accessToken: token }
      })
      .then(() => {
        dispatch(deleteMaterialNomenclator(id));
        dispatch(materialNomenclatorsStartLoading());
        Toast.fire({
          icon: "success",
          title: "Nomenclador de Material Eliminado"
        });
      })
      .catch((error: AxiosError) => {
        let { message }: any = error.response?.data;
        console.log("🚀 ~ return ~ message:", message);
        Swal.fire("Error", "Error al eliminar el nomenclador de material", "error");
      });
  };
};

/**
 *
 * @returns List of all material nomenclators
 */
export const materialNomenclatorsStartLoading = () => {
  const token = localStorage.getItem("accessToken");
  return async (dispatch: any) => {
    await axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/nomenclators/material`, {
        headers: { accessToken: token }
      })
      .then((resp) => {
        let { listOfMaterialNomenclators } = resp.data;
        dispatch(materialNomenclatorsLoaded(listOfMaterialNomenclators));
      })
      .catch((error: AxiosError) => {
        let { message }: any = error?.response?.data;
        console.log("🚀 ~ return ~ message:", message);
        Swal.fire("Error", "Error al cargar los nomencladores de materiales", "error");
      });
  };
};

export const materialNomenclatorsLoaded = (materialNomenclators: any) => ({
  type: types.materialNomenclatorsLoaded,
  payload: materialNomenclators
});

const addMaterialNomenclator = (materialNomenclator: any) => ({
  type: types.addMaterialNomenclator,
  payload: materialNomenclator
});

const updateMaterialNomenclator = (materialNomenclator: any) => ({
  type: types.updateMaterialNomenclator,
  payload: materialNomenclator
});

const deleteMaterialNomenclator = (id: string) => ({
  type: types.deleteMaterialNomenclator,
  payload: {
    id
  }
});

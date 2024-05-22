import axios, { AxiosError } from "axios";
import Swal from "sweetalert2";

import { Toast } from "@/helpers/customAlert";
import { types } from "@/types/types";

// * CREA UN NUEVO NOMENCLADOR DE MATERIAL //
export const startAddMaterialNomenclator = ({ ...materialNomenclator }): any => {
  const token = localStorage.getItem("accessToken");
  return async (dispatch: any) => {
    await axios
      .post(
        `${process.env.NEXT_PUBLIC_API_URL}/nomenclators/material`,
        { ...materialNomenclator },
        { headers: { accessToken: token } }
      )
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
        Swal.fire("Error", message, "error");
      });
  };
};

// * ACTUALIZA UN NOMENCLADOR DE MATERIAL POR SU ID //
export const startUpdateMaterialNomenclator = ({ ...materialNomenclator }): any => {
  const token = localStorage.getItem("accessToken");
  return async (dispatch: any) => {
    await axios
      .put(
        `${process.env.NEXT_PUBLIC_API_URL}/nomenclators/material`,
        { ...materialNomenclator },
        { headers: { accessToken: token } }
      )
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
        Swal.fire("Error", message, "error");
      });
  };
};

// * ELIMINA UN NOMENCLADOR DE MATERIAL POR SU ID //
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
        Swal.fire("Error", message, "error");
      });
  };
};

// * CARGA TODOS LOS NOMENCLADORES DE MATERIALES//
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
        Swal.fire("Error", message, "error");
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

import Swal from "sweetalert2";
import { types } from "../types/types";
import { Toast } from "../helpers/customAlert";
import axios, { AxiosError } from "axios";

export const startAddNomenclator = (category: string, code: string): any => {
  const token = localStorage.getItem("accessToken");
  return async (dispatch: any) => {
    await axios
      .post(`${process.env.NEXT_PUBLIC_API_URL}/nomenclators`, { code, category }, { headers: { accessToken: token } })
      .then(() => {
        dispatch(addNomenclator(code, category));
        dispatch(nomenclatorsStartLoading());
        Toast.fire({
          icon: "success",
          title: "Nomenclador Creado",
        });
      })
      .catch((error: AxiosError) => {
        let { message }: any = error.response?.data;
        Swal.fire("Error", message, "error");
      });
  };
};
export const startUpdateNomenclator = (id: string,code: string, category: string): any => {
  const token = localStorage.getItem("accessToken");
  return async (dispatch: any) => {
    await axios
      .put(`${process.env.NEXT_PUBLIC_API_URL}/nomenclators`, { id, code, category }, { headers: { accessToken: token } })
      .then(() => {
        dispatch(updateNomenclator(code, category));
        dispatch(nomenclatorsStartLoading());
        Toast.fire({
          icon: "success",
          title: "Nomenclador Actualizado",
        });
      })
      .catch((error: AxiosError) => {
        let { message }: any = error.response?.data;
        Swal.fire("Error", message, "error");
      });
  };
};
export const startDeleteNomenclator = (id: string): any => {
  const token = localStorage.getItem("accessToken");
  return async (dispatch: any) => {
    await axios
      .patch(`${process.env.NEXT_PUBLIC_API_URL}/nomenclators`, { id }, { headers: { accessToken: token } })
      .then(() => {
        dispatch(deleteNomenclator(id));
        dispatch(nomenclatorsStartLoading());
        Toast.fire({
          icon: "success",
          title: "Nomenclador Eliminado",
        });
      })
      .catch((error: AxiosError) => {
        let { message }: any = error.response?.data;
        Swal.fire("Error", message, "error");
      });
  };
};
export const nomenclatorsStartLoading = () => {
  const token = localStorage.getItem("accessToken");
  return async (dispatch: any) => {
    await axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/nomenclators`, { headers: { accessToken: token } })
      .then((resp) => {
        let { listOfNomenclators } = resp.data;
        dispatch(nomenclatorsLoaded(listOfNomenclators));
      })
      .catch((error: AxiosError) => {
        let { message }: any = error.response?.data;
        Swal.fire("Error", message, "error");
      });
  };
};
export const nomenclatorsLoaded = (nomenclators: any) => ({
  type: types.nomenclatorsLoaded,
  payload: nomenclators,
});
const addNomenclator = (code: string, category: string) => ({
  type: types.addNomenclator,
  payload: {
    code,
    category,
  },
});
const updateNomenclator = (code: string, category: string) => ({
  type: types.updateNomenclator,
  payload: {
    code,
    category,
  },
});
const deleteNomenclator = (id: string) => ({
  type: types.deleteNomenclator,
  payload: {
    id,
  },
});

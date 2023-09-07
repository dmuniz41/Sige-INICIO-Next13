import Swal from "sweetalert2";
import { types } from "../types/types";
import { Toast } from "../helpers/customAlert";
import axios, { AxiosError } from "axios";

export const materialsStartLoading = (id: string) => {
  const token = localStorage.getItem("accessToken");
  return async (dispatch: any) => {
    await axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/material/${id}`, { headers: { accessToken: token } })
      .then((resp) => {
        console.log("🚀 ~ file: material.ts:12 ~ .then ~ resp:", resp)
        let { listOfMaterials } = resp.data;
        dispatch(materialsLoaded(listOfMaterials));
      })
      .catch((error: AxiosError) => {
        let { message }: any = error.response?.data;
        Swal.fire("Error", message, "error");
      });
  };
};

export const materialsLoaded = (materials: any) => ({
  type: types.materialsLoaded,
  payload: materials,
});
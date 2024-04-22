import { Toast } from "@/helpers/customAlert";
import { types } from "@/types/types";
import axios, { AxiosError } from "axios";
import Swal from "sweetalert2";

// * ACTUALIZA LOS AUXILIARES DE LAS TARIFAS DE SERVICIO // 
export const startUpdateServiceFeeAuxiliary = ({ ...serviceFeeAuxiliary }): any => {
  const token = localStorage.getItem("accessToken");
  return async (dispatch: any) => {
    await axios
      .put(
        `${process.env.NEXT_PUBLIC_API_URL}/serviceFeeAuxiliary`,
        { ...serviceFeeAuxiliary },
        { headers: { accessToken: token } }
      )
      .then(() => {
        dispatch(updateServiceFeeAuxiliary(serviceFeeAuxiliary));
        dispatch(startLoadServiceFeeAuxiliary());
        Toast.fire({
          icon: "success",
          title: `Auxiliares actualizados`
        });
      })
      .catch((error: AxiosError) => {
        let { message }: any = error.response?.data;
        console.log("🚀 ~ file: serviceFeeAuxiliary.ts:39 ~ return ~ message:", message);
        Swal.fire("Error", "Error al editar los auxiliares de las tarifas de servicio", "error");
      });
  };
};

// * CARGA LOS AUXILIARES DE LAS TARIFAS DE SERVICIO //
export const startLoadServiceFeeAuxiliary = (): any => {
  const token = localStorage.getItem("accessToken");
  return async (dispatch: any) => {
    await axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/serviceFeeAuxiliary`, {
        headers: { accessToken: token }
      })
      .then((resp) => {
        let { BDserviceFeeAuxiliary } = resp.data;
        dispatch(serviceFeeAuxiliaryLoaded(BDserviceFeeAuxiliary));
      })
      .catch((error: AxiosError) => {
        let { message }: any = error.response?.data;
        console.log("🚀 ~ file: serviceFeeAuxiliary.ts:56 ~ return ~ message:", message);
        Swal.fire("Error", "Error al cargar los auxiliares de las tarifas de servicio", "error");
      });
  };
};

const updateServiceFeeAuxiliary = (serviceFeeAuxiliary: any) => ({
  type: types.updateServiceFeeAuxiliary,
  payload: {
    serviceFeeAuxiliary
  }
});

const serviceFeeAuxiliaryLoaded = (serviceFeeAuxiliary: any) => ({
  type: types.serviceFeeAuxiliaryLoaded,
  payload: serviceFeeAuxiliary
});

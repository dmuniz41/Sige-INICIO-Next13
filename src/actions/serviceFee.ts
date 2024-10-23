import axios, { AxiosError } from "axios";
import Swal from "sweetalert2";

import { nomenclatorsStartLoading } from "./nomenclator";
import { Toast } from "@/helpers/customAlert";
import { types } from "@/types/types";

// * CREA UNA NUEVA TARIFA DE SERVICIO //
export const startAddServiceFee = ({ ...serviceFee }): any => {
  const token = localStorage.getItem("accessToken");
  return async (dispatch: any) => {
    await axios
      .post(`${process.env.NEXT_PUBLIC_API_URL}/serviceFee`, { ...serviceFee }, { headers: { accessToken: token } })
      .then((serviceFee) => {
        dispatch(addServiceFee(serviceFee));
        dispatch(nomenclatorsStartLoading());
        dispatch(serviceFeeStartLoading());
        Toast.fire({
          icon: "success",
          title: "Tarifa de Servicio Creada"
        });
      })
      .catch((error: AxiosError) => {
        let { message }: any = error.response?.data;
        console.log("🚀 ~ file: serviceFee.ts:31 ~ return ~ message:", message);
        if (error.response?.status === 409) {
          Swal.fire("Error", "Ya existe una tarifa de servicio con ese nombre", "error");
        } else Swal.fire("Error", "Error al crear la tarifa de servicio", "error");
      });
  };
};

// * ACTUALIZA UNA TARIFA DE SERVICIO POR SU ID //
export const startUpdateServiceFee = ({ ...serviceFee }): any => {
  const token = localStorage.getItem("accessToken");
  return async (dispatch: any) => {
    await axios
      .put(`${process.env.NEXT_PUBLIC_API_URL}/serviceFee`, { ...serviceFee }, { headers: { accessToken: token } })
      .then((serviceFee) => {
        dispatch(updateServiceFee(serviceFee));
        dispatch(serviceFeeStartLoading());
        Toast.fire({
          icon: "success",
          title: `Tarifa de Servicio Actualizada`
        });
      })
      .catch((error: AxiosError) => {
        let { message }: any = error.response?.data;
        console.log("🚀 ~ file: serviceFee.ts:59 ~ return ~ message:", message);
        Swal.fire("Error", "Error al editar la tarifa de servicio", "error");
      });
  };
};

// * CARGA TODAS LAS TARIFAS DE SERVICIO //
export const serviceFeeStartLoading = () => {
  const token = localStorage.getItem("accessToken");
  return async (dispatch: any) => {
    await axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/serviceFee`, { headers: { accessToken: token } })
      .then((resp) => {
        let { listOfServiceFees } = resp.data;
        dispatch(serviceFeeLoaded(listOfServiceFees));
      })
      .catch((error: AxiosError) => {
        let { message }: any = error.response?.data;
        console.log("🚀 ~ file: serviceFee.ts:77 ~ return ~ message:", message);
        Swal.fire("Error", "Error al cargar las tarifas de servicio", "error");
      });
  };
};

// * ELIMINA UNA TARIFA DE SERVICIO //
export const startDeleteServiceFee = (id: string): any => {
  const token = localStorage.getItem("accessToken");
  return async (dispatch: any) => {
    await axios
      .delete(`${process.env.NEXT_PUBLIC_API_URL}/serviceFee?id=${id}`, {
        headers: { accessToken: token }
      })
      .then(() => {
        dispatch(deleteServiceFee(id));
        dispatch(serviceFeeStartLoading());
        Toast.fire({
          icon: "success",
          title: "Tarifa de Servicio Eliminada"
        });
      })
      .catch((error: AxiosError) => {
        let { message }: any = error.response?.data;
        console.log("🚀 ~ file: serviceFee.ts:101 ~ return ~ message:", message);
        Swal.fire("Error", "Error al eliminar la tarifa de servicio", "error");
      });
  };
};

// * CARGA UNA TARIFA DE SERVICIO POR SU ID //
export const loadSelectedServiceFee = (id: string) => {
  const token = localStorage.getItem("accessToken");
  return async (dispatch: any) => {
    await axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/serviceFee/${id}`, {
        headers: { accessToken: token }
      })
      .then((resp) => {
        let { BDServiceFee } = resp.data;
        dispatch(selectedServiceFee(BDServiceFee));
      })
      .catch((error: AxiosError) => {
        let { message }: any = error.response?.data;
        console.log("🚀 ~ file: serviceFee.ts:121 ~ return ~ message:", message);
        Swal.fire("Error", "Error al cargar tarifa de servicio seleccionada", "error");
      });
  };
};

const addServiceFee = ({ ...serviceFee }) => ({
  type: types.addServiceFee,
  payload: JSON.stringify(serviceFee)
});

export const updateServiceFee = ({ ...serviceFee }) => ({
  type: types.updateServiceFee,
  payload: JSON.stringify(serviceFee)
});

export const serviceFeeLoaded = (serviceFees: any) => ({
  type: types.serviceFeesLoaded,
  payload: serviceFees
});

const deleteServiceFee = (id: string) => ({
  type: types.deleteServiceFee,
  payload: id
});

const selectedServiceFee = (serviceFee: any) => ({
  type: types.selectedServiceFee,
  payload: serviceFee
});

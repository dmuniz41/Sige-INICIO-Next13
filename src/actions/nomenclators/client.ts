import axios, { AxiosError } from "axios";
import Swal from "sweetalert2";

import { Toast } from "@/helpers/customAlert";
import { types } from "@/types/types";

/**
 *
 * @param clientNomenclator: IClienNomenclator
 * @returns Success message if the client nomenclator was created successfully
 */
export const startAddClientNomenclator = ({ ...clientNomenclator }): any => {
  const token = localStorage.getItem("accessToken");
  return async (dispatch: any) => {
    await axios
      .post(`${process.env.NEXT_PUBLIC_API_URL}/nomenclators/client`, { ...clientNomenclator }, { headers: { accessToken: token } })
      .then(() => {
        dispatch(addClientNomenclator(clientNomenclator));
        dispatch(clientNomenclatorsStartLoading());
        Toast.fire({
          icon: "success",
          title: "Nomenclador Creado"
        });
      })
      .catch((error: AxiosError) => {
        let { message }: any = error.response?.data;
        console.log("🚀 ~ return ~ message:", message);
        Swal.fire("Error", "Error al crear el nomenclador de cliente", "error");
      });
  };
};

/**
 *
 * @param clientNomenclator: IClienNomenclator
 * @returns Success message if the client nomenclator was updated successfully
 */
export const startUpdateClientNomenclator = ({ ...clientNomenclator }): any => {
  const token = localStorage.getItem("accessToken");
  return async (dispatch: any) => {
    await axios
      .put(`${process.env.NEXT_PUBLIC_API_URL}/nomenclators/client`, { ...clientNomenclator }, { headers: { accessToken: token } })
      .then(() => {
        dispatch(updateClientNomenclator(clientNomenclator));
        dispatch(clientNomenclatorsStartLoading());
        Toast.fire({
          icon: "success",
          title: "Nomenclador Actualizado"
        });
      })
      .catch((error: AxiosError) => {
        let { message }: any = error.response?.data;
        console.log("🚀 ~ return ~ message:", message);
        Swal.fire("Error", "Error al actualizar el nomenclador de cliente.", "error");
      });
  };
};

/**
 *
 * @param id
 * @returns Success message if the client nomenclator was deleted successfully
 */
export const startDeleteClientNomenclator = (id: string): any => {
  const token = localStorage.getItem("accessToken");
  return async (dispatch: any) => {
    await axios
      .delete(`${process.env.NEXT_PUBLIC_API_URL}/nomenclators/client?id=${id}`, {
        headers: { accessToken: token }
      })
      .then(() => {
        dispatch(deleteClientNomenclator(id));
        dispatch(clientNomenclatorsStartLoading());
        Toast.fire({
          icon: "success",
          title: "Nomenclador Eliminado"
        });
      })
      .catch((error: AxiosError) => {
        let { message }: any = error.response?.data;
        console.log("🚀 ~ return ~ message:", message);
        Swal.fire("Error", "Error al eliminar el nomenclador de cliente", "error");
      });
  };
};

/**
 *
 * @returns List of all client nomenclators
 */
export const clientNomenclatorsStartLoading = () => {
  const token = localStorage.getItem("accessToken");
  return async (dispatch: any) => {
    await axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/nomenclators/client`, {
        headers: { accessToken: token }
      })
      .then((resp: any) => {
        let { listOfClientNomenclators } = resp.data;
        dispatch(clientNomenclatorsLoaded(listOfClientNomenclators));
      })
      .catch((error: AxiosError) => {
        let { message }: any = error.response?.data;
        console.log("🚀 ~ return ~ message:", message);
        Swal.fire("Error", "Error al cargar los nomencladores de clientes", "error");
      });
  };
};

export const clientNomenclatorsLoaded = (clientNomenclators: any) => ({
  type: types.clientNomenclatorsLoaded,
  payload: clientNomenclators
});

const addClientNomenclator = ({ ...clientNomenclator }) => ({
  type: types.addClientNomenclator,
  payload: {
    clientNomenclator
  }
});

const updateClientNomenclator = ({ ...clientNomenclator }) => ({
  type: types.updateClientNomenclator,
  payload: {
    clientNomenclator
  }
});

const deleteClientNomenclator = (id: string) => ({
  type: types.deleteClientNomenclator,
  payload: {
    id
  }
});

import axios, { AxiosError } from "axios";
import Swal from "sweetalert2";

import { types } from "../types/types";
import { Toast } from "../helpers/customAlert";

// * CREA UN NUEVO TRABAJADOR * //
export const startAddWorker = ({ ...worker }): any => {
  const token = localStorage.getItem("accessToken");
  return async (dispatch: any) => {
    await axios
      .post(
        `${process.env.NEXT_PUBLIC_API_URL}/worker`,
        { ...worker },
        { headers: { accessToken: token } }
      )
      .then(() => {
        dispatch(addWorker(worker));
        dispatch(workersStartLoading());
        Toast.fire({
          icon: "success",
          title: "Trabajador Creado"
        });
      })
      .catch((error: AxiosError) => {
        let { message }: any = error.response?.data;
        console.log("🚀 ~ return ~ message:", message)
        Swal.fire("Error", "Error al crear trabajador", "error");
      });
  };
};

// * ACTUALIZA UN TRABAJADOR POR SU ID * //
export const startUpdateWorker = ({ ...worker }): any => {
  const token = localStorage.getItem("accessToken");
  return async (dispatch: any) => {
    await axios
      .put(
        `${process.env.NEXT_PUBLIC_API_URL}/worker`,
        { ...worker },
        { headers: { accessToken: token } }
      )
      .then(() => {
        dispatch(updateWorker(worker));
        dispatch(workersStartLoading());
        Toast.fire({
          icon: "success",
          title: "Trabajador Actualizado"
        });
      })
      .catch((error: AxiosError) => {
        let { message }: any = error.response?.data;
        console.log("🚀 ~ return ~ message:", message)
        Swal.fire("Error", "Error al actualizar el trabajador ", "error");
      });
  };
};

// * ELIMINA UN TRABAJADOR POR SU ID * //
export const startDeleteWorker = (id: string): any => {
  const token = localStorage.getItem("accessToken");
  return async (dispatch: any) => {
    await axios
      .delete(`${process.env.NEXT_PUBLIC_API_URL}/worker?id=${id}`, {
        headers: { accessToken: token }
      })
      .then(() => {
        dispatch(deleteWorker(id));
        dispatch(workersStartLoading());
        Toast.fire({
          icon: "success",
          title: "Trabajador Eliminado"
        });
      })
      .catch((error: AxiosError) => {
        let { message }: any = error.response?.data;
        console.log("🚀 ~ return ~ message:", message)
        Swal.fire("Error", "Error al eliminar el trabajador", "error");
      });
  };
};

// *  CARGA TODOS LOS TRABAJADORES * //
export const workersStartLoading = () => {
  const token = localStorage.getItem("accessToken");
  return async (dispatch: any) => {
    await axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/worker`, { headers: { accessToken: token } })
      .then((resp) => {
        let { listOfWorkers } = resp.data;
        dispatch(workersLoaded(listOfWorkers));
      })
      .catch((error: AxiosError) => {
        let { message }: any = error.response?.data;
        console.log("🚀 ~ return ~ message:", message)
        Swal.fire("Error", "Error al cargar el trabajador ", "error");
      });
  };
};

export const workersLoaded = (workers: any) => ({
  type: types.workersLoaded,
  payload: workers
});

const addWorker = ({ ...worker }) => ({
  type: types.addWorker,
  payload: {
    worker
  }
});

const updateWorker = ({ ...worker }) => ({
  type: types.updateWorker,
  payload: {
    worker
  }
});
const deleteWorker = (id: string) => ({
  type: types.deleteWorker,
  payload: {
    id
  }
});

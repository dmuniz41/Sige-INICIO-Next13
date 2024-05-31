import axios, { AxiosError } from "axios";
import Swal from "sweetalert2";

import { IServiceFeeTask } from "@/models/serviceFeeTask";
import { Toast } from "@/helpers/customAlert";
import { types } from "@/types/types";

// * CREA UNA NUEVA TAREA  //
export const startAddServiceFeeTask = ({ ...serviceFeeTask }): any => {
  const token = localStorage.getItem("accessToken");
  return async (dispatch: any) => {
    await axios
      .post(
        `${process.env.NEXT_PUBLIC_API_URL}/serviceFeeTask`,
        {
          key: serviceFeeTask.key,
          amount: serviceFeeTask.amount,
          category: serviceFeeTask.category,
          description: serviceFeeTask.description,
          price: serviceFeeTask.price,
          unitMeasure: serviceFeeTask.unitMeasure
        },
        { headers: { accessToken: token } }
      )
      .then((serviceFeeTask) => {
        dispatch(addServiceFeeTask(serviceFeeTask));
        dispatch(startLoadServiceFeesTasks());
        Toast.fire({
          icon: "success",
          title: `Tarea Creada`
        });
      })
      .catch((error: AxiosError) => {
        let { message }: any = error.response?.data;
        console.log("🚀 ~ file: serviceFeeTask.ts:35 ~ return ~ message:", message);
        Swal.fire("Error", "Error al crear la tarea", "error");
      });
  };
};

// * ACTUALIZA UNA TAREA //
export const startUpdateServiceFeeTask = ({ ...serviceFeeTask }): any => {
  const token = localStorage.getItem("accessToken");
  return async (dispatch: any) => {
    await axios
      .put(
        `${process.env.NEXT_PUBLIC_API_URL}/serviceFeeTask`,
        {
          _id: serviceFeeTask._id,
          key: serviceFeeTask.key,
          amount: serviceFeeTask.amount,
          category: serviceFeeTask.category,
          description: serviceFeeTask.description,
          price: serviceFeeTask.price,
          unitMeasure: serviceFeeTask.unitMeasure
        },
        { headers: { accessToken: token } }
      )
      .then((serviceFeeTask) => {
        dispatch(updateServiceFeeTask(serviceFeeTask));
        dispatch(startLoadServiceFeesTasks());
        Toast.fire({
          icon: "success",
          title: `Tarea Actualizada`
        });
      })
      .catch((error: AxiosError) => {
        let { message }: any = error.response?.data;
        console.log("🚀 ~ file: serviceFeeTask.ts:68 ~ return ~ message:", message);
        Swal.fire("Error", "Error al editar la tarea", "error");
      });
  };
};

// * CARGA TODAS LAS TAREAS //
export const startLoadServiceFeesTasks = (): any => {
  const token = localStorage.getItem("accessToken");
  return async (dispatch: any) => {
    await axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/serviceFeeTask`, { headers: { accessToken: token } })
      .then((resp) => {
        let { listOfTasks } = resp.data;
        dispatch(serviceFeesTasksLoaded(listOfTasks));
      })
      .catch((error: AxiosError) => {
        let { message }: any = error.response?.data;
        console.log("🚀 ~ file: serviceFeeTask.ts:85 ~ return ~ message:", message);
        Swal.fire("Error", "Error al cargar las tareas", "error");
      });
  };
};

// * ELIMINA UNA TAREA //
export const startDeleteServiceFeeTask = (id: string): any => {
  const token = localStorage.getItem("accessToken");
  return async (dispatch: any) => {
    await axios
      .delete(`${process.env.NEXT_PUBLIC_API_URL}/serviceFeeTask?id=${id}`, {
        headers: { accessToken: token }
      })
      .then(() => {
        dispatch(deleteServiceFeeTask(id));
        dispatch(startLoadServiceFeesTasks());
        Toast.fire({
          icon: "success",
          title: "Tarea Eliminada"
        });
      })
      .catch((error: AxiosError) => {
        let { message }: any = error.response?.data;
        console.log("🚀 ~ file: serviceFeeTask.ts:106 ~ return ~ message:", message);
        Swal.fire("Error", "Error al eliminar la tarea", "error");
      });
  };
};

const addServiceFeeTask = ({ ...serviceFeeTask }) => ({
  type: types.addServiceFeeTask,
  payload: {
    amount: serviceFeeTask.amount,
    category: serviceFeeTask.category,
    description: serviceFeeTask.description,
    price: serviceFeeTask.price,
    unitMeasure: serviceFeeTask.unitMeasure
  }
});

const updateServiceFeeTask = ({ ...serviceFeeTask }) => ({
  type: types.updateServiceFeeTask,
  payload: {
    _id: serviceFeeTask._id,
    key: serviceFeeTask.key,
    amount: serviceFeeTask.amount,
    category: serviceFeeTask.category,
    description: serviceFeeTask.description,
    price: serviceFeeTask.price,
    unitMeasure: serviceFeeTask.unitMeasure
  }
});

const serviceFeesTasksLoaded = (serviceFeesTasks: IServiceFeeTask[]) => ({
  type: types.serviceFeesTasksLoaded,
  payload: serviceFeesTasks
});
const deleteServiceFeeTask = (id: string) => ({
  type: types.deleteServiceFeeTask,
  payload: {
    id
  }
});

import Swal from "sweetalert2";
import { types } from "../types/types";
import { Toast } from "../helpers/customAlert";
import axios, { AxiosError } from "axios";

export const startAddWorker = (name: string, CI: number, address: string, role: string[], phoneNumber: number, bankAccount: number): any => {
  const token = localStorage.getItem("accessToken");
  return async (dispatch: any) => {
    await axios
      .post(`${process.env.NEXT_PUBLIC_API_URL}/worker`, { name, CI, address, role, phoneNumber, bankAccount }, { headers: { accessToken: token } })
      .then(() => {
        dispatch(addWorker(name, CI, address, role, phoneNumber, bankAccount));
        dispatch(workersStartLoading())
        Toast.fire({
          icon: "success",
          title: "Trabajador Creado",
        });
      })
      .catch((error: AxiosError) => {
        let { msg }: any = error.response?.data;
        Swal.fire("Error", msg, "error");
      });
  };
};
export const startUpdateWorker = (_id: string ,name: string, CI: number, address: string, role: string[], phoneNumber: number, bankAccount: number): any => {
  const token = localStorage.getItem("accessToken");
  return async (dispatch: any) => {
    await axios
      .put(`${process.env.NEXT_PUBLIC_API_URL}/worker`, { _id, name, CI, address, role, phoneNumber, bankAccount },{ headers: { accessToken: token } })
      .then(() => {
        dispatch(updateWorker(name, CI, address, role, phoneNumber, bankAccount));
        dispatch(workersStartLoading())
        Toast.fire({
          icon: "success",
          title: "Trabajador Actualizado",
        });
      })
      .catch((error: AxiosError) => {
        let { msg }: any = error.response?.data;
        Swal.fire("Error", msg, "error");
      });
  };
};
export const startDeleteWorker = (CI: number): any => {
  const token = localStorage.getItem("accessToken");
  return async (dispatch: any) => {
    await axios
      .patch(`${process.env.NEXT_PUBLIC_API_URL}/worker`, { CI }, { headers: { accessToken: token } })
      .then(() => {
        dispatch(deleteWorker(CI));
        dispatch(workersStartLoading())
        Toast.fire({
          icon: "success",
          title: "Trabajador Eliminado",
        });
      })
      .catch((error: AxiosError) => {
        let { msg }: any = error.response?.data;
        Swal.fire("Error", msg, "error");
      });
  };
};
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
        let { msg }: any = error.response?.data;
        Swal.fire("Error", msg, "error");
      });
  };
};
export const workersLoaded = (workers: any) => ({
  type: types.workersLoaded,
  payload: workers,
});

const addWorker = (name: string, CI: number, address: string, role: string[], phoneNumber: number, bankAccount: number) => ({
  type: types.addWorker,
  payload: {
    name,
    CI,
    address,
    role,
    phoneNumber,
    bankAccount,
  },
});
const updateWorker = (name: string, CI: number, address: string, role: string[], phoneNumber: number, bankAccount: number) => ({
  type: types.updateWorker,
  payload: {
    name,
    CI,
    address,
    role,
    phoneNumber,
    bankAccount,
  },
});
const deleteWorker = (CI: number) => ({
  type: types.deleteWorker,
  payload: {
    CI,
  },
});

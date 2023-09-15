import Swal from "sweetalert2";
import { types } from "../types/types";
import { Toast } from "../helpers/customAlert";
import axios, { AxiosError } from "axios";

export const startAddWarehouse = (name: string): any => {
  const token = localStorage.getItem("accessToken");
  return async (dispatch: any) => {
    await axios
      .post(`${process.env.NEXT_PUBLIC_API_URL}/warehouse`, { name }, { headers: { accessToken: token } })
      .then(() => {
        dispatch(addWarehouse(name));
        dispatch(warehousesStartLoading())
        Toast.fire({
          icon: "success",
          title: "Almacén Creado",
        });
      })
      .catch((error: AxiosError) => {
        let { message }: any = error.response?.data;
        Swal.fire("Error", message, "error");
      });
  };
};
export const startUpdateWarehouse = (_id: string ,name?: string, totalValue?: number): any => {
  const token = localStorage.getItem("accessToken");
  return async (dispatch: any) => {
    await axios
      .put(`${process.env.NEXT_PUBLIC_API_URL}/warehouse`, { _id, name, totalValue },{ headers: { accessToken: token } })
      .then(() => {
        dispatch(updateWarehouse(name!, totalValue!));
        dispatch(warehousesStartLoading())
        Toast.fire({
          icon: "success",
          title: "Almacén Actualizado",
        });
      })
      .catch((error: AxiosError) => {
        let { message }: any = error.response?.data;
        Swal.fire("Error", message, "error");
      });
  };
};
export const startDeleteWarehouse = (name: string): any => {
  const token = localStorage.getItem("accessToken");
  return async (dispatch: any) => {
    await axios
      .patch(`${process.env.NEXT_PUBLIC_API_URL}/warehouse`, { name }, { headers: { accessToken: token } })
      .then(() => {
        dispatch(deleteWarehouse(name));
        dispatch(warehousesStartLoading())
        Toast.fire({
          icon: "success",
          title: "Almacén Eliminado",
        });
      })
      .catch((error: AxiosError) => {
        let { message }: any = error.response?.data;
        Swal.fire("Error", message, "error");
      });
    };
  };  
export const warehousesStartLoading = () => {
  const token = localStorage.getItem("accessToken");
  return async (dispatch: any) => {
    await axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/warehouse`, { headers: { accessToken: token } })
      .then((resp) => {
        let { listOfWarehouses } = resp.data;
        dispatch(warehousesLoaded(listOfWarehouses));
      })
      .catch((error: AxiosError) => {
        let { message }: any = error.response?.data;
        Swal.fire("Error", message, "error");
      });
  };
};
export const warehousesLoaded = (warehouses: any) => ({
  type: types.warehousesLoaded,
  payload: warehouses,
});
export const selectedWarehouse = ( id: string) => ({
  type: types.selectedWarehouse,
  payload: {
    id,
  },
});
const addWarehouse = (name: string, ) => ({
  type: types.addWarehouse,
  payload: {
    name,
  },
});
const updateWarehouse = ( name: string, totalValue: number) => ({
  type: types.updateWarehouse,
  payload: {
    name,
    totalValue
  },
});
const deleteWarehouse = ( name: string) => ({
  type: types.deleteWorker,
  payload: {
    name,
  },
});

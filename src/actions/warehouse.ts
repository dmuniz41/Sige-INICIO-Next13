import Swal from "sweetalert2";
import axios, { AxiosError } from "axios";

import { IMaterial } from "@/models/material";
import { Toast } from "../helpers/customAlert";
import { types } from "../types/types";

// * CREA UN NUEVO ALMACEN * //
export const startAddWarehouse = (name: string): any => {
  const token = localStorage.getItem("accessToken");
  return async (dispatch: any) => {
    await axios
      .post(`${process.env.NEXT_PUBLIC_API_URL}/warehouse`, { name }, { headers: { accessToken: token } })
      .then(() => {
        dispatch(addWarehouse(name));
        dispatch(warehousesStartLoading());
        Toast.fire({
          icon: "success",
          title: "Almacén Creado",
        });
      })
      .catch((error: AxiosError) => {
        let { message }: any = error.response?.data;
        console.log("🚀 ~ return ~ message:", message)
        Swal.fire("Error", "Error al crear almacén", "error");
      });
  };
};

// * ACTUALIZA UN ALMACEN POR SI ID * //
export const startUpdateWarehouse = (_id: string, name?: string, totalValue?: number): any => {
  const token = localStorage.getItem("accessToken");
  return async (dispatch: any) => {
    await axios
      .put(`${process.env.NEXT_PUBLIC_API_URL}/warehouse`, { _id, name, totalValue }, { headers: { accessToken: token } })
      .then(() => {
        dispatch(updateWarehouse(name!, totalValue!));
        dispatch(warehousesStartLoading());
        Toast.fire({
          icon: "success",
          title: "Almacén Actualizado",
        });
      })
      .catch((error: AxiosError) => {
        let { message }: any = error.response?.data;
        console.log("🚀 ~ return ~ message:", message)
        Swal.fire("Error", "Error al actualizar el almacén", "error");
      });
  };
};

// * ELIMINA UN ALMACEN POR SU ID * //
export const startDeleteWarehouse = (id: string): any => {
  const token = localStorage.getItem("accessToken");
  return async (dispatch: any) => {
    await axios
      .delete(`${process.env.NEXT_PUBLIC_API_URL}/warehouse?${id}`, { headers: { accessToken: token } })
      .then(() => {
        dispatch(deleteWarehouse(id));
        dispatch(warehousesStartLoading());
        Toast.fire({
          icon: "success",
          title: "Almacén Eliminado",
        });
      })
      .catch((error: AxiosError) => {
        let { message }: any = error.response?.data;
        console.log("🚀 ~ return ~ message:", message)
        Swal.fire("Error", "Error al eliminar el almacén ", "error");
      });
  };
};

// * CARGA TODOS LOS ALMACENES * //
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
        console.log("🚀 ~ return ~ message:", message)
        Swal.fire("Error", "Error al cargar los almacenes", "error");
      });
  };
};

// * CARGA LOS MATERIALES CON BAJAS EXISTENCIAS * //
export const lowExistenceMaterialsStartLoading = () => {
  const token = localStorage.getItem("accessToken");
  return async (dispatch: any) => {
    await axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/material`, { headers: { accessToken: token } })
      .then((resp) => {
        const lowExistenceMaterials: IMaterial[] = [];
        let { listOfMaterials } = resp.data;
        listOfMaterials.map((material: IMaterial) => {
          if (material.unitsTotal <= material.minimumExistence) {
            lowExistenceMaterials.push(material);
          }
        });
        dispatch(lowExistenceMaterialsLoaded(lowExistenceMaterials));
      })
      .catch((error: AxiosError) => {
        let { message }: any = error.response?.data;
        console.log("🚀 ~ return ~ message:", message)
        Swal.fire("Error", "Error al cargar los almacenes con bajas existencias", "error");
      });
  };
};
export const warehousesLoaded = (warehouses: any) => ({
  type: types.warehousesLoaded,
  payload: warehouses,
});

export const lowExistenceMaterialsLoaded = (lowExistenceMaterials: any) => ({
  type: types.lowExistencesMaterials,
  payload: lowExistenceMaterials,
});

export const selectedWarehouse = (id: string) => ({
  type: types.selectedWarehouse,
  payload: {
    id,
  },
});

const addWarehouse = (name: string) => ({
  type: types.addWarehouse,
  payload: {
    name,
  },
});

const updateWarehouse = (name: string, totalValue: number) => ({
  type: types.updateWarehouse,
  payload: {
    name,
    totalValue,
  },
});

const deleteWarehouse = (id: string) => ({
  type: types.deleteWorker,
  payload: {
    id,
  },
});

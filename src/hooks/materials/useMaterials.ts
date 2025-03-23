import { Toast } from "@/helpers/customAlert";
import { InsertMaterial, RemoveMaterial, UpdateMaterial } from "@/types/DTOs/materials/materials";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import axios, { AxiosError } from "axios";
import Swal from "sweetalert2";

const getMaterialsAPI = async (page: number = 1, limit: number = 10, warehouseId: number) => {
  const token = localStorage.getItem("accessToken");
  const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/material/${warehouseId}?page=${page}&limit=${limit}`, {
    headers: { accessToken: token }
  });
  return response.data;
};

const getMaterialByIdAPI = async (materialId: number, warehouseId: number) => {
  const token = localStorage.getItem("accessToken");
  const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/material/${warehouseId}?materialId=${materialId}`, {
    headers: { accessToken: token }
  });
  return response.data;
};

const addMaterialAPI = async (values: InsertMaterial) => {
  const token = localStorage.getItem("accessToken");
  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/material/addMaterial`,
    { ...values },
    { headers: { accessToken: token } }
  );
  return response.data;
};

const removeMaterialAPI = async (values: RemoveMaterial) => {
  const token = localStorage.getItem("accessToken");
  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/material/removeMaterial`,
    { ...values },
    { headers: { accessToken: token } }
  );
  return response.data;
};

const updateMaterialAPI = async (warehouseId: number, materialId: number, values: UpdateMaterial) => {
  const token = localStorage.getItem("accessToken");
  const response = await axios.put(
    `${process.env.NEXT_PUBLIC_API_URL}/material/${warehouseId}?materialId=${materialId}`,
    { ...values },
    { headers: { accessToken: token } }
  );
  return response.data;
};

// TODO: PENDIENTE
// const deleteMaterialAPI = async (id: number) => {
//   const token = localStorage.getItem("accessToken");
//   const response = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/warehouse/${id}`, {
//     headers: { accessToken: token }
//   });
//   return response.data;
// };

const useGetMaterials = (page: number, limit: number, warehouseId: number) => {
  const query = useQuery({
    queryKey: ["GetMaterials", page, limit, warehouseId],
    queryFn: () => getMaterialsAPI(page, limit, warehouseId)
  });

  return query;
};
const useGetMaterialById = (materialId: number, warehouseId: number) => {
  const query = useQuery({
    queryKey: ["GetMaterialById", materialId, warehouseId],
    queryFn: () => getMaterialByIdAPI(materialId, warehouseId)
  });

  return query;
};

const useAddMaterial = () => {
  const queryWarehouse = useQueryClient();
  const query = useMutation({
    mutationKey: ["AddMaterial"],
    mutationFn: (values: InsertMaterial) => addMaterialAPI(values),
    onSuccess: () => {
      queryWarehouse.invalidateQueries({ queryKey: ["GetMaterials"] });
      Toast.fire({
        icon: "success",
        title: "Material añadido"
      });
    },
    onError: (error: AxiosError<{ ok: boolean; message: string }>) => {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error?.response?.data?.message
      });
    }
  });

  return query;
};

const useRemoveMaterial = () => {
  const queryWarehouse = useQueryClient();
  const query = useMutation({
    mutationKey: ["RemoveMaterial"],
    mutationFn: (values: RemoveMaterial) => removeMaterialAPI(values),
    onSuccess: () => {
      queryWarehouse.invalidateQueries({ queryKey: ["GetMaterials"] });
      Toast.fire({
        icon: "success",
        title: "Material removido"
      });
    },
    onError: (error: AxiosError<{ ok: boolean; message: string }>) => {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error?.response?.data?.message
      });
    }
  });

  return query;
};

const useUpdateMaterial = () => {
  const queryClient = useQueryClient();
  const query = useMutation({
    mutationKey: ["UpdateMaterial"],
    mutationFn: ({ warehouseId, materialId, values }: { warehouseId: number; materialId: number; values: UpdateMaterial }) =>
      updateMaterialAPI(warehouseId, materialId, values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["GetMaterials"] });
      Toast.fire({
        icon: "success",
        title: "Material actualizado"
      });
    },
    onError: (error: AxiosError<{ ok: boolean; message: string }>) => {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error?.response?.data?.message
      });
    }
  });

  return query;
};

export const useMaterials = () => {
  return {
    useGetMaterials,
    useAddMaterial,
    useRemoveMaterial,
    useUpdateMaterial,
    useGetMaterialById
  };
};

import { Toast } from "@/helpers/customAlert";
import { InsertWarehouse, UpdateWarehouse } from "@/types/DTOs/warehouse/warehouse";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import axios, { AxiosError } from "axios";
import Swal from "sweetalert2";

const getWarehousesAPI = async (page: number = 1, limit: number = 10) => {
  const token = localStorage.getItem("accessToken");
  const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/warehouse?page=${page}&limit=${limit}`, {
    headers: { accessToken: token }
  });
  return response.data;
};

const getWarehousePerIdAPI = async (id: number) => {
  const token = localStorage.getItem("accessToken");
  const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/warehouse/${id}`, {
    headers: { accessToken: token }
  });
  return response.data;
};

const createWarehouseAPI = async (values: InsertWarehouse) => {
  const token = localStorage.getItem("accessToken");
  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/warehouse`,
    { ...values },
    { headers: { accessToken: token } }
  );
  return response.data;
};

const updateWarehouseAPI = async (id: number, values: UpdateWarehouse) => {
  const token = localStorage.getItem("accessToken");
  const response = await axios.put(
    `${process.env.NEXT_PUBLIC_API_URL}/warehouse/${id}`,
    { ...values },
    { headers: { accessToken: token } }
  );
  return response.data;
};

const deleteWarehouseAPI = async (id: number) => {
  const token = localStorage.getItem("accessToken");
  const response = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/warehouse/${id}`, {
    headers: { accessToken: token }
  });
  return response.data;
};

const useGetWarehouses = (page: number, limit: number) => {
  const query = useQuery({
    queryKey: ["GetWarehouses"],
    queryFn: () => getWarehousesAPI(page, limit)
  });

  return query;
};

const useGetWarehousePerId = (id: number) => {
  const query = useQuery({
    queryKey: ["GetWarehousePerId"],
    queryFn: () => getWarehousePerIdAPI(id)
  });

  return query;
};

const useCreateWarehouse = () => {
  const queryWarehouse = useQueryClient();
  const query = useMutation({
    mutationKey: ["CreateWarehouse"],
    mutationFn: (values: InsertWarehouse) => createWarehouseAPI(values),
    onSuccess: () => {
      queryWarehouse.invalidateQueries({ queryKey: ["GetWarehouses"] });
      Toast.fire({
        icon: "success",
        title: "Nuevo almacen creado"
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

const useUpdateWarehouse = () => {
  const queryClient = useQueryClient();
  const query = useMutation({
    mutationKey: ["UpdateWarehouse"],
    mutationFn: ({ id, values }: { id: number; values: UpdateWarehouse }) => updateWarehouseAPI(id, values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["GetWarehouses"] });
      Toast.fire({
        icon: "success",
        title: "Almacen actualizado"
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

const useDeleteWarehouse = () => {
  const queryClient = useQueryClient();
  const query = useMutation({
    mutationKey: ["DeleteWarehouse"],
    mutationFn: (id: number) => deleteWarehouseAPI(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["GetWarehouses"] });
      Toast.fire({
        icon: "success",
        title: "Almacen eliminado"
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

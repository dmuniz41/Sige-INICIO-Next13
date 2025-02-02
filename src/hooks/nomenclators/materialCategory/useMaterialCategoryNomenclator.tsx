import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import Swal from "sweetalert2";

import { MaterialCategoryNomenclators } from "@/db/migrations/schema";
import { Toast } from "@/helpers/customAlert";

const getMaterialCategoryNomenclatorsAPI = async (page: number = 1, limit: number = 10) => {
  const token = localStorage.getItem("accessToken");
  const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/nomenclators/material?page=${page}&limit=${limit}`, {
    headers: { accessToken: token }
  });
  return response.data;
};

const getMaterialCategoryNomenclatorsPerCodeAPI = async (code: string) => {
  const token = localStorage.getItem("accessToken");
  const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/nomenclators/material/${code}`, {
    headers: { accessToken: token }
  });
  return response.data;
};

const createMaterialCategoryNomenclatorsAPI = async (values: MaterialCategoryNomenclators) => {
  const token = localStorage.getItem("accessToken");
  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/nomenclators/material`,
    {
      ...values
    },
    {
      headers: { accessToken: token }
    }
  );
  return response.data;
};

const updateMaterialCategoryNomenclatorsAPI = async (values: MaterialCategoryNomenclators) => {
  const token = localStorage.getItem("accessToken");
  const response = await axios.put(
    `${process.env.NEXT_PUBLIC_API_URL}/nomenclators/material`,
    {
      ...values
    },
    {
      headers: { accessToken: token }
    }
  );
  return response.data;
};

const deleteMaterialCategoryNomenclatorsAPI = async (code: string) => {
  const token = localStorage.getItem("accessToken");
  const response = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/nomenclators/material/${code}`, {
    headers: { accessToken: token }
  });
  return response.data;
};

const useGetMaterialCategoryNomenclator = (page: number, limit: number) => {
  const query = useQuery({
    queryKey: ["GetMaterialCategoryNomenclators"],
    queryFn: () => getMaterialCategoryNomenclatorsAPI(page, limit)
  });

  return query;
};

const useGetMaterialCategoryNomenclatorPerCode = (code: string) => {
  const query = useQuery({
    queryKey: ["GetMaterialCategoryNomenclatorsPerCode"],
    queryFn: () => getMaterialCategoryNomenclatorsPerCodeAPI(code)
  });

  return query;
};

const useCreateMaterialCategoryNomenclator = () => {
  const queryClient = useQueryClient();
  const query = useMutation({
    mutationKey: ["CreateMaterialCategoryNomenclator"],
    mutationFn: (values: MaterialCategoryNomenclators) => createMaterialCategoryNomenclatorsAPI(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["GetMaterialCategoryNomenclators"] });
      Toast.fire({
        icon: "success",
        title: "Categoría de Material Creada"
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

const useUpdateMaterialCategoryNomenclator = () => {
  const queryClient = useQueryClient();
  const query = useMutation({
    mutationKey: ["UpdateMaterialCategoryNomenclator"],
    mutationFn: (values: MaterialCategoryNomenclators) => updateMaterialCategoryNomenclatorsAPI(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["GetMaterialCategoryNomenclators"] });
      Toast.fire({
        icon: "success",
        title: "Categoría de Material Actualizada"
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

const useDeleteMaterialCategoryNomenclator = () => {
  const queryClient = useQueryClient();
  const query = useMutation({
    mutationKey: ["DeleteMaterialCategoryNomenclator"],
    mutationFn: (code: string) => deleteMaterialCategoryNomenclatorsAPI(code),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["GetMaterialCategoryNomenclators"] });
      Toast.fire({
        icon: "success",
        title: "Categoría de Material Eliminada"
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

export const useMaterialCategoryNomenclator = () => {
  return {
    useGetMaterialCategoryNomenclator,
    useGetMaterialCategoryNomenclatorPerCode,
    useCreateMaterialCategoryNomenclator,
    useUpdateMaterialCategoryNomenclator,
    useDeleteMaterialCategoryNomenclator
  };
};

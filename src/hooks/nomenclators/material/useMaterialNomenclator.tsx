import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import Swal from "sweetalert2";

import { MaterialNomenclators } from "@/db/migrations/schema";
import { Toast } from "@/helpers/customAlert";
import { InsertMaterialNomenclator, UpdateMaterialNomenclator } from "@/types/DTOs/nomenclators/materials";

const getMaterialNomenclatorsAPI = async (page: number = 1, limit: number = 10) => {
  const token = localStorage.getItem("accessToken");
  const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/nomenclators/material?page=${page}&limit=${limit}`, {
    headers: { accessToken: token }
  });
  return response.data;
};

const getMaterialNomenclatorsPerCodeAPI = async (code: number) => {
  const token = localStorage.getItem("accessToken");
  const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/nomenclators/material/${code}`, {
    headers: { accessToken: token }
  });
  return response.data;
};

const createMaterialNomenclatorsAPI = async (values: InsertMaterialNomenclator) => {
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

const updateMaterialNomenclatorsAPI = async (values: UpdateMaterialNomenclator) => {
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

const deleteMaterialNomenclatorsAPI = async (code: number) => {
  const token = localStorage.getItem("accessToken");
  const response = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/nomenclators/material/${code}`, {
    headers: { accessToken: token }
  });
  return response.data;
};

const useGetMaterialNomenclator = (page: number, limit: number) => {
  const query = useQuery({
    queryKey: ["GetMaterialNomenclators"],
    queryFn: () => getMaterialNomenclatorsAPI(page, limit)
  });

  return query;
};

const useGetMaterialNomenclatorPerCode = (code: number) => {
  const query = useQuery({
    queryKey: ["GetMaterialNomenclatorsPerCode"],
    queryFn: () => getMaterialNomenclatorsPerCodeAPI(code)
  });

  return query;
};

const useCreateMaterialNomenclator = () => {
  const queryClient = useQueryClient();
  const query = useMutation({
    mutationKey: ["CreateMaterialNomenclator"],
    mutationFn: (values: InsertMaterialNomenclator) => createMaterialNomenclatorsAPI(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["GetMaterialNomenclators"] });
      Toast.fire({
        icon: "success",
        title: "Nomenclador de material creado"
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

const useUpdateMaterialNomenclator = () => {
  const queryClient = useQueryClient();
  const query = useMutation({
    mutationKey: ["UpdateMaterialNomenclator"],
    mutationFn: (values: UpdateMaterialNomenclator) => updateMaterialNomenclatorsAPI(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["GetMaterialNomenclators"] });
      Toast.fire({
        icon: "success",
        title: "Nomenclador de material actualizado"
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

const useDeleteMaterialNomenclator = () => {
  const queryClient = useQueryClient();
  const query = useMutation({
    mutationKey: ["DeleteMaterialNomenclator"],
    mutationFn: (code: number) => deleteMaterialNomenclatorsAPI(code),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["GetMaterialNomenclators"] });
      Toast.fire({
        icon: "success",
        title: "Nomenclador de material eliminado"
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

export const useMaterialNomenclator = () => {
  return {
    useGetMaterialNomenclator,
    useGetMaterialNomenclatorPerCode,
    useCreateMaterialNomenclator,
    useUpdateMaterialNomenclator,
    useDeleteMaterialNomenclator
  };
};

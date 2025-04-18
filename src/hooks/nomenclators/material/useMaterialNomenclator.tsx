import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import Swal from "sweetalert2";

import { MaterialNomenclators } from "@/db/migrations/schema";
import { Toast } from "@/helpers/customAlert";
import { InsertMaterialNomenclator, UpdateMaterialNomenclator } from "@/types/DTOs/nomenclators/materials";
import { MaterialsNomenclatorsFilters } from "@/app/dashboard/nomenclators/materials/MaterialsNomenclatorsFilters";

const getMaterialNomenclatorsAPI = async (page: number = 1, limit: number = 10, filters: MaterialsNomenclatorsFilters) => {
  const token = localStorage.getItem("accessToken");
  const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/nomenclators/material`, {
    params: {
      page,
      limit,
      material_category: filters.material_category,
      material_name: filters.material_name,
      isDecrease: filters.isDecrease,
      isNotDecrease: filters.isNotDecrease
    },
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

const   useGetMaterialNomenclator = (page: number, limit: number, filters: MaterialsNomenclatorsFilters) => {
  const query = useQuery({
    queryKey: ["GetMaterialNomenclators", page, limit, filters],
    queryFn: () => getMaterialNomenclatorsAPI(page, limit, filters)
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

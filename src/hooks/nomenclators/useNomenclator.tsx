import { Toast } from "@/helpers/customAlert";
import { MaterialNomenclatorsFilters } from "@/types/DTOs/nomenclators/materials";
import { CreateNomenclator, UpdateNomenclator } from "@/types/DTOs/nomenclators/nomenclators";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import axios, { AxiosError } from "axios";
import { useSession } from "next-auth/react";
import Swal from "sweetalert2";

const getNomenclatorsAPI = async (page: number = 1, limit: number = 10, filters: MaterialNomenclatorsFilters, accessToken?: string) => {
  console.log("🚀 ~ getNomenclatorsAPI ~ page:", page)
  console.log("🚀 ~ getNomenclatorsAPI ~ accessToken:", accessToken)
  const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/nomenclators?page=${page}&limit=${limit}`, {
    params: filters,
    headers: { accessToken }
  });
  return response.data;
};

const getNomenclatorsByCategoryCodeAPI = async (categoryCode: string) => {
  const token = localStorage.getItem("accessToken");
  const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/nomenclators?categoryCode=${categoryCode}`, {
    headers: { accessToken: token }
  });
  return response.data;
};

const createNomenclatorAPI = async (values: CreateNomenclator) => {
  const token = localStorage.getItem("accessToken");
  const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/nomenclators`, { ...values }, { headers: { accessToken: token } });
  return response.data;
};

const updateNomenclatorAPI = async (values: UpdateNomenclator) => {
  const token = localStorage.getItem("accessToken");
  const response = await axios.put(
    `${process.env.NEXT_PUBLIC_API_URL}/nomenclators/${values.id}`,
    { ...values },
    { headers: { accessToken: token } }
  );
  return response.data;
};

const deleteNomenclatorAPI = async (id: number) => {
  const token = localStorage.getItem("accessToken");
  const response = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/nomenclators/${id}`, {
    headers: { accessToken: token }
  });
  return response.data;
};

const useGetNomenclators = (currentPage: number, pageSize: number, filters: MaterialNomenclatorsFilters) => {
  const { data: session, status } = useSession();
  const accessToken = (session?.user as any)?.accessToken;
  const query = useQuery({
    queryKey: ["GetNomenclators"],
    queryFn: () => getNomenclatorsAPI(currentPage, pageSize, filters, accessToken),
    enabled: status === "authenticated"
  });

  return query;
};

const useGetNomenclatorsByCategoryCode = (categoryCode: string) => {
  const query = useQuery({
    queryKey: ["GetNomenclatorsPerCategoryCode", { categoryCode }],
    queryFn: () => getNomenclatorsByCategoryCodeAPI(categoryCode)
  });

  return query;
};

const useCreateNomenclator = () => {
  const queryClient = useQueryClient();
  const query = useMutation({
    mutationKey: ["CreateNomenclator"],
    mutationFn: (values: CreateNomenclator) => createNomenclatorAPI(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["GetNomenclators"] });
      Toast.fire({
        icon: "success",
        title: "Nuevo Nomenclador creado"
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

const useUpdateNomenclator = () => {
  const queryClient = useQueryClient();
  const query = useMutation({
    mutationKey: ["UpdateNomenclator"],
    mutationFn: (values: UpdateNomenclator) => updateNomenclatorAPI(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["GetNomenclators"] });
      Toast.fire({
        icon: "success",
        title: "Nomenclador actualizado"
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

const useDeleteNomenclator = () => {
  const queryClient = useQueryClient();
  const query = useMutation({
    mutationKey: ["DeleteNomenclator"],
    mutationFn: (idNumber: number) => deleteNomenclatorAPI(idNumber),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["GetNomenclators"] });
      Toast.fire({
        icon: "success",
        title: "Nomenclador eliminado"
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

export const useNomenclator = () => {
  return {
    useGetNomenclators,
    useGetNomenclatorsByCategoryCode,
    useCreateNomenclator,
    useUpdateNomenclator,
    useDeleteNomenclator
  };
};

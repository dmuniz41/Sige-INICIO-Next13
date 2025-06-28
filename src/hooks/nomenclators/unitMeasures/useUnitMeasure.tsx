import { notification } from "antd";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import axios, { AxiosError } from "axios";

import { MaterialNomenclatorsFilters } from "@/types/DTOs/nomenclators/materials";
import { InsertUnitMeasureNomenclator, UpdateUnitMeasureNomenclator } from "@/types/DTOs/nomenclators/unitMeasures";


const getUnitMeasureNomenclatorsAPI = async (
  page: number = 1,
  limit: number = 10,
  filters: MaterialNomenclatorsFilters,
  accessToken: string
) => {
  const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/nomenclators/unitMeasure?page=${page}&limit=${limit}`, {
    params: { ...filters },
    headers: { accessToken }
  });
  return response.data;
};


const createUnitMeasureNomenclatorAPI = async (values: InsertUnitMeasureNomenclator, accessToken: string) => {
  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/nomenclators/unitMeasure`,
    { ...values },
    { headers: { accessToken } }
  );
  return response.data;
};

const updateUnitMeasureNomenclatorAPI = async (id: number, values: UpdateUnitMeasureNomenclator, accessToken: string) => {
  const response = await axios.put(
    `${process.env.NEXT_PUBLIC_API_URL}/nomenclators/unitMeasure/${id}`,
    { ...values },
    { headers: { accessToken } }
  );
  return response.data;
};

const deleteUnitMeasureNomenclatorAPI = async (id: number, accessToken: string) => {
  const response = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/nomenclators/unitMeasure/${id}`, {
    headers: { accessToken }
  });
  return response.data;
};

const useGetUnitMeasureNomenclator = (page: number, limit: number, filters: MaterialNomenclatorsFilters) => {
  const { data: session, status } = useSession();
  const accessToken = (session?.user as any)?.accessToken;
  const query = useQuery({
    queryKey: ["GetUnitMeasureNomenclators", page, limit, filters],
    queryFn: () => getUnitMeasureNomenclatorsAPI(page, limit, filters, accessToken),
    enabled: status === "authenticated"
  });

  return query;
};

const useCreateUnitMeasureNomenclator = () => {
  const { data: session } = useSession();
  const accessToken = (session?.user as any)?.accessToken;
  const queryClient = useQueryClient();
  const query = useMutation({
    mutationKey: ["CreateUnitMeasureNomenclator"],
    mutationFn: (values: InsertUnitMeasureNomenclator) => createUnitMeasureNomenclatorAPI(values, accessToken),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["GetUnitMeasureNomenclators"] });
      notification.success({
        message: "Nomenclador de unidad de medida creado",
        showProgress: true,
        pauseOnHover: true
      });
    },
    onError: (error: AxiosError<{ ok: boolean; message: string }>) => {
      const errorMessage = error?.response?.data?.message || "Ha ocurrido un error al crear el nomenclador de unidad de medida";
      notification.error({
        message: "Error",
        description: errorMessage
      });
    }
  });

  return query;
};

const useUpdateUnitMeasureNomenclator = () => {
  const { data: session } = useSession();
  const accessToken = (session?.user as any)?.accessToken;
  const queryClient = useQueryClient();
  const query = useMutation({
    mutationKey: ["UpdateUnitMeasureNomenclator"],
    mutationFn: ({ id, values }: { id: number; values: UpdateUnitMeasureNomenclator; accessToken: string }) =>
      updateUnitMeasureNomenclatorAPI(id, values, accessToken),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["GetUnitMeasureNomenclators"] });
      notification.success({
        message: "Nomenclador de unidad de medida actualizado",
        showProgress: true,
        pauseOnHover: true
      });
    },
    onError: (error: AxiosError<{ ok: boolean; message: string }>) => {
      const errorMessage = error?.response?.data?.message || "Ha ocurrido un error al actualizar el nomenclador de unidad de medida";
      notification.error({
        message: "Error",
        description: errorMessage
      });
    }
  });

  return query;
};

const useDeleteUnitMeasureNomenclator = () => {
  const { data: session } = useSession();
  const accessToken = (session?.user as any)?.accessToken;
  const queryClient = useQueryClient();
  const query = useMutation({
    mutationKey: ["DeleteUnitMeasureNomenclator"],
    mutationFn: (id: number) => deleteUnitMeasureNomenclatorAPI(id, accessToken),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["GetUnitMeasureNomenclators"] });
      notification.success({
        message: "Nomenclador de unidad de medida eliminado",
        showProgress: true,
        pauseOnHover: true
      });
    },
    onError: (error: AxiosError<{ ok: boolean; message: string }>) => {
      const errorMessage = error?.response?.data?.message || "Ha ocurrido un error al eliminar el nomenclador de unidad de medida";
      notification.error({
        message: "Error",
        description: errorMessage
      });
    }
  });

  return query;
};

export const useUnitMeasureNomenclator = () => {
  return {
    useGetUnitMeasureNomenclator,
    useCreateUnitMeasureNomenclator,
    useUpdateUnitMeasureNomenclator,
    useDeleteUnitMeasureNomenclator
  };
};

import { Toast } from "@/helpers/customAlert";
import { InsertRepresentativeNomenclator, UpdateRepresentativeNomenclator } from "@/types/DTOs/nomenclators/representative";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import axios, { AxiosError } from "axios";
import Swal from "sweetalert2";

const getRepresentativesAPI = async (page: number = 1, limit: number = 10) => {
  const token = localStorage.getItem("accessToken");
  const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/nomenclators/Representative?page=${page}&limit=${limit}`, {
    headers: { accessToken: token }
  });
  return response.data;
};

const getRepresentativePerIdNumberAPI = async (idNumber: number) => {
  const token = localStorage.getItem("accessToken");
  const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/nomenclators/Representative/${idNumber}`, {
    headers: { accessToken: token }
  });
  return response.data;
};

const createRepresentativeAPI = async (values: InsertRepresentativeNomenclator) => {
  const token = localStorage.getItem("accessToken");
  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/nomenclators/Representative`,
    { ...values },
    { headers: { accessToken: token } }
  );
  return response.data;
};

const updateRepresentativeAPI = async (values: UpdateRepresentativeNomenclator) => {
  const token = localStorage.getItem("accessToken");
  const response = await axios.put(
    `${process.env.NEXT_PUBLIC_API_URL}/nomenclators/Representative/${values.idNumber}`,
    { ...values },
    { headers: { accessToken: token } }
  );
  return response.data;
};

const deleteRepresentativeAPI = async (idNumber: number) => {
  const token = localStorage.getItem("accessToken");
  const response = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/nomenclators/Representative/${idNumber}`, {
    headers: { accessToken: token }
  });
  return response.data;
};

const useGetRepresentatives = (page: number, limit: number) => {
  const query = useQuery({
    queryKey: ["GetRepresentatives"],
    queryFn: () => getRepresentativesAPI(page, limit)
  });

  return query;
};

const useGetRepresentativePerIdNumber = (idNumber: number) => {
  const query = useQuery({
    queryKey: ["GetRepresentativePerIdNumber"],
    queryFn: () => getRepresentativePerIdNumberAPI(idNumber)
  });

  return query;
};

const useCreateRepresentative = () => {
  const queryRepresentative = useQueryClient();
  const query = useMutation({
    mutationKey: ["CreateRepresentative"],
    mutationFn: (values: InsertRepresentativeNomenclator) => createRepresentativeAPI(values),
    onSuccess: () => {
      queryRepresentative.invalidateQueries({ queryKey: ["GetRepresentatives"] });
      Toast.fire({
        icon: "success",
        title: "Nuevo Representante creado"
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

const useUpdateRepresentative = () => {
  const queryRepresentative = useQueryClient();
  const query = useMutation({
    mutationKey: ["UpdateRepresentative"],
    mutationFn: (values: UpdateRepresentativeNomenclator) => updateRepresentativeAPI(values),
    onSuccess: () => {
      queryRepresentative.invalidateQueries({ queryKey: ["GetRepresentatives"] });
      Toast.fire({
        icon: "success",
        title: "Representante actualizado"
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

const useDeleteRepresentative = () => {
  const queryRepresentative = useQueryClient();
  const query = useMutation({
    mutationKey: ["DeleteRepresentative"],
    mutationFn: (idNumber: number) => deleteRepresentativeAPI(idNumber),
    onSuccess: () => {
      queryRepresentative.invalidateQueries({ queryKey: ["GetRepresentatives"] });
      Toast.fire({
        icon: "success",
        title: "Representante eliminado"
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

export const useRepresentative = () => {
  return {
    useGetRepresentatives,
    useGetRepresentativePerIdNumber,
    useCreateRepresentative,
    useUpdateRepresentative,
    useDeleteRepresentative
  };
};
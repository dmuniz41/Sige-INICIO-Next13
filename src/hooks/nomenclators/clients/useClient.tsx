import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import Swal from "sweetalert2";

import { InsertClientNomenclator, UpdateClientNomenclator } from "@/types/DTOs/nomenclators/clientNomenclator";
import { Toast } from "@/helpers/customAlert";

const getClientsAPI = async (page: number = 1, limit: number = 10) => {
  const token = localStorage.getItem("accessToken");
  const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/nomenclators/client?page=${page}&limit=${limit}`, {
    headers: { accessToken: token }
  });
  return response.data;
};

const getClientPerIdNumberAPI = async (idNumber: number) => {
  const token = localStorage.getItem("accessToken");
  const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/nomenclators/client/${idNumber}`, {
    headers: { accessToken: token }
  });
  return response.data;
};

const createClientAPI = async (values: InsertClientNomenclator) => {
  const token = localStorage.getItem("accessToken");
  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/nomenclators/client`,
    { ...values },
    { headers: { accessToken: token } }
  );
  return response.data;
};

const updateClientAPI = async (values: UpdateClientNomenclator) => {
  const token = localStorage.getItem("accessToken");
  const response = await axios.put(
    `${process.env.NEXT_PUBLIC_API_URL}/nomenclators/client/${values.idnumber}`,
    { ...values },
    { headers: { accessToken: token } }
  );
  return response.data;
};

const deleteClientAPI = async (idNumber: number) => {
  const token = localStorage.getItem("accessToken");
  const response = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/nomenclators/client/${idNumber}`, {
    headers: { accessToken: token }
  });
  return response.data;
};

const useGetClients = (page: number, limit: number) => {
  const query = useQuery({
    queryKey: ["GetClients"],
    queryFn: () => getClientsAPI(page, limit)
  });

  return query;
};

const useGetClientPerIdNumber = (idNumber: number) => {
  const query = useQuery({
    queryKey: ["GetClientPerIdNumber"],
    queryFn: () => getClientPerIdNumberAPI(idNumber)
  });

  return query;
};

const useCreateClient = () => {
  const queryClient = useQueryClient();
  const query = useMutation({
    mutationKey: ["CreateClient"],
    mutationFn: (values: InsertClientNomenclator) => createClientAPI(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["GetClients"] });
      Toast.fire({
        icon: "success",
        title: "Nuevo cliente creado"
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

const useUpdateClient = () => {
  const queryClient = useQueryClient();
  const query = useMutation({
    mutationKey: ["UpdateClient"],
    mutationFn: (values: UpdateClientNomenclator) => updateClientAPI(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["GetClients"] });
      Toast.fire({
        icon: "success",
        title: "Cliente actualizado"
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

const useDeleteClient = () => {
  const queryClient = useQueryClient();
  const query = useMutation({
    mutationKey: ["DeleteClient"],
    mutationFn: (idNumber: number) => deleteClientAPI(idNumber),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["GetClients"] });
      Toast.fire({
        icon: "success",
        title: "Cliente eliminado"
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

export const useClient = () => {
  return {
    useGetClients,
    useGetClientPerIdNumber,
    useCreateClient,
    useUpdateClient,
    useDeleteClient
  };
};

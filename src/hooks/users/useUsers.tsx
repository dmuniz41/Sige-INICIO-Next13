import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import Swal from "sweetalert2";

import { InsertUser, UpdateUser } from "@/types/DTOs/users/users";
import { Toast } from "@/helpers/customAlert";
import { useSession } from "next-auth/react";
import { notification } from "antd";

const getUsersAPI = async (page: number = 1, limit: number = 10, accessToken?: string) => {
  const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/user?page=${page}&limit=${limit}`, {
    headers: { accessToken }
  });

  return response.data.data;
};

const getUserByIdAPI = async (id: number, accessToken?: string) => {
  const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/user/${id}`, {
    headers: { accessToken }
  });
  return response.data.data;
};

const createUserAPI = async (values: InsertUser, accessToken?: string) => {
  const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/user`, { ...values }, { headers: { accessToken } });
  return response.data.data;
};

const updateUserAPI = async (id: number, values: UpdateUser, accessToken?: string) => {
  const response = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/user/${id}`, { ...values }, { headers: { accessToken } });
  return response.data.data;
};

const deleteUserAPI = async (id: number, accessToken?: string) => {
  console.log("🚀 ~ deleteUserAPI ~ accessToken:", accessToken)
  const response = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/user/${id}`, { headers: { accessToken } });
  return response.data.data;
};

const useGetUsers = (page: number, limit: number) => {
  const { data: session, status } = useSession();
  const accessToken = (session?.user as any)?.accessToken;
  const query = useQuery({
    queryKey: ["GetUsers", page, limit],
    queryFn: () => getUsersAPI(page, limit, accessToken),
    enabled: status === "authenticated"
  });

  return query;
};

const useGetUserById = (id: number) => {
  const query = useQuery({
    queryKey: ["GetUserById"],
    queryFn: () => getUserByIdAPI(id)
  });

  return query;
};

const useCreateUser = () => {
  const { data: session } = useSession();
  const accessToken = (session?.user as any)?.accessToken;
  const queryClient = useQueryClient();
  const query = useMutation({
    mutationKey: ["CreateUser"],
    mutationFn: (values: InsertUser) => createUserAPI(values, accessToken),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["GetUsers"] });
      notification.success({
        message: "Success",
        description: "Nuevo usuario creado"
      });
    },
    onError: (error: AxiosError<{ ok: boolean; message: string }>) => {
      const errorMessage = error?.response?.data?.message || "Ha ocurrido un error al crear el usuario";
      notification.error({
        message: "Error",
        description: errorMessage
      });
    }
  });

  return query;
};

const useUpdateUser = () => {
  const { data: session } = useSession();
  const accessToken = (session?.user as any)?.accessToken;
  const queryClient = useQueryClient();
  const query = useMutation({
    mutationKey: ["UpdateUser"],
    mutationFn: ({ id, values }: { id: number; values: UpdateUser; accessToken: string }) => updateUserAPI(id, values, accessToken),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["GetUsers"] });
      notification.success({
        message: "Success",
        description: "Usuario actualizado"
      });
    },
    onError: (error: AxiosError<{ ok: boolean; message: string }>) => {
      const errorMessage = error?.response?.data?.message || "Ha ocurrido un error al actualizar el usuario";
      notification.error({
        message: "Error",
        description: errorMessage
      });
    }
  });

  return query;
};

const useDeleteUser = () => {
  const { data: session } = useSession();
  const accessToken = (session?.user as any)?.accessToken;
  const queryClient = useQueryClient();
  const query = useMutation({
    mutationKey: ["DeleteClient"],
    mutationFn: (id: number) => deleteUserAPI(id, accessToken),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["GetUsers"] });
      notification.success({
        message: "Success",
        description: "Usuario eliminado"
      });
    },
    onError: (error: AxiosError<{ ok: boolean; message: string }>) => {
      const errorMessage = error?.response?.data?.message || "Ha ocurrido un error al eliminar el usuario";
      notification.error({
        message: "Error",
        description: errorMessage
      });
    }
  });

  return query;
};

export const useUser = () => {
  return {
    useGetUsers,
    useGetUserById,
    useCreateUser,
    useUpdateUser,
    useDeleteUser
  };
};

/**
 * @file This file contains React Query hooks for managing warehouse data.
 * It provides functionalities to fetch, create, update, and delete warehouse
 * information by interacting with the backend API.
 */

import {
  InsertWarehouse,
  UpdateWarehouse,
  WarehouseFilters,
} from '@/types/DTOs/warehouse/warehouse'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { notification } from 'antd'

import axios, { AxiosError } from 'axios'
import { useSession } from 'next-auth/react'

/**
 * Fetches a list of warehouses from the API.
 * @param page The page number for pagination.
 * @param limit The number of items per page.
 * @param filters An object containing filters to apply to the warehouse list.
 * @param accessToken The access token for authentication.
 * @returns A promise that resolves to the API response data containing warehouse information.
 */
const getWarehousesAPI = async (
  page: number = 1,
  limit: number = 10,
  filters: WarehouseFilters,
  accessToken?: string,
) => {
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/warehouse?page=${page}&limit=${limit}`,
    {
      params: { ...filters },
      headers: { accessToken },
    },
  )
  return response.data
}

/**
 * Fetches a single warehouse by its ID from the API.
 * @param id The ID of the warehouse to fetch.
 * @param accessToken The access token for authentication.
 * @returns A promise that resolves to the API response data containing the warehouse information.
 */
const getWarehousePerIdAPI = async (id: number, accessToken?: string) => {
  const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/warehouse/${id}`, {
    headers: { accessToken },
  })
  return response.data
}

/**
 * Creates a new warehouse in the API.
 * @param values An object containing the data for the new warehouse.
 * @param accessToken The access token for authentication.
 * @returns A promise that resolves to the API response data for the created warehouse.
 */
const createWarehouseAPI = async (values: InsertWarehouse, accessToken?: string) => {
  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/warehouse`,
    { ...values },
    { headers: { accessToken } },
  )
  return response.data
}

/**
 * Updates an existing warehouse in the API.
 * @param id The ID of the warehouse to update.
 * @param values An object containing the updated data for the warehouse.
 * @param accessToken The access token for authentication.
 * @returns A promise that resolves to the API response data for the updated warehouse.
 */
const updateWarehouseAPI = async (id: number, values: UpdateWarehouse, accessToken?: string) => {
  const response = await axios.put(
    `${process.env.NEXT_PUBLIC_API_URL}/warehouse/${id}`,
    { ...values },
    { headers: { accessToken } },
  )
  return response.data
}

/**
 * Deletes a warehouse by its ID from the API.
 * @param id The ID of the warehouse to delete.
 * @param accessToken The access token for authentication.
 * @returns A promise that resolves to the API response data for the deleted warehouse.
 */
const deleteWarehouseAPI = async (id: number, accessToken?: string) => {
  const response = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/warehouse/${id}`, {
    headers: { accessToken },
  })
  return response.data
}

/**
 * A React Query hook for fetching a paginated list of warehouses.
 * The query is enabled only when the user is authenticated.
 * @param page The current page number.
 * @param limit The number of items per page.
 * @param filters An object containing filters to apply to the warehouse list.
 * @returns The result of the `useQuery` hook.
 */
const useGetWarehouses = (page: number, limit: number, filters: WarehouseFilters) => {
  const { data: session, status } = useSession()
  const accessToken = session?.user?.accessToken
  const query = useQuery({
    queryKey: ['GetWarehouses'],
    queryFn: () => getWarehousesAPI(page, limit, filters, accessToken),
    enabled: status === 'authenticated',
  })

  return query
}

/**
 * A React Query hook for fetching a single warehouse by its ID.
 * The query is enabled only when the user is authenticated.
 * @param id The ID of the warehouse to fetch.
 * @returns The result of the `useQuery` hook.
 */
const useGetWarehousePerId = (id: number) => {
  const { data: session, status } = useSession()
  const accessToken = session?.user?.accessToken
  const query = useQuery({
    queryKey: ['GetWarehousePerId'],
    queryFn: () => getWarehousePerIdAPI(id, accessToken),
    enabled: status === 'authenticated',
  })

  return query
}

/**
 * A React Query hook for creating a new warehouse.
 * On successful creation, it invalidates the 'GetWarehouses' query to refetch the list
 * and displays a success notification.
 * On error, it displays an error notification with the appropriate message.
 * @returns The result of the `useMutation` hook.
 */
const useCreateWarehouse = () => {
  const { data: session } = useSession()
  const accessToken = session?.user?.accessToken
  const queryWarehouse = useQueryClient()
  const query = useMutation({
    mutationKey: ['CreateWarehouse'],
    mutationFn: (values: InsertWarehouse) => createWarehouseAPI(values, accessToken),
    onSuccess: () => {
      queryWarehouse.invalidateQueries({ queryKey: ['GetWarehouses'] })
      notification.success({
        message: 'Nuevo almacen creado',
        showProgress: true,
        pauseOnHover: true,
      })
    },
    onError: (error: AxiosError<{ ok: boolean; message: string }>) => {
      const errorMessage =
        error?.response?.data?.message || 'Ha ocurrido un error al crear el almacén'
      notification.error({
        message: 'Error',
        description: errorMessage,
      })
    },
  })

  return query
}

/**
 * A React Query hook for updating an existing warehouse.
 * On successful update, it invalidates the 'GetWarehouses' query to refetch the list
 * and displays a success notification.
 * On error, it displays an error notification with the appropriate message.
 * @returns The result of the `useMutation` hook.
 */
const useUpdateWarehouse = () => {
  const { data: session } = useSession()
  const accessToken = session?.user?.accessToken
  const queryClient = useQueryClient()
  const query = useMutation({
    mutationKey: ['UpdateWarehouse'],
    mutationFn: ({ id, values }: { id: number; values: UpdateWarehouse }) =>
      updateWarehouseAPI(id, values, accessToken),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['GetWarehouses'] })
      notification.success({
        message: 'Alamcen actualizado',
        showProgress: true,
        pauseOnHover: true,
      })
    },
    onError: (error: AxiosError<{ ok: boolean; message: string }>) => {
      const errorMessage =
        error?.response?.data?.message || 'Ha ocurrido un error al actualizar el almacén'
      notification.error({
        message: 'Error',
        description: errorMessage,
      })
    },
  })

  return query
}

/**
 * A React Query hook for deleting a warehouse.
 * On successful deletion, it invalidates the 'GetWarehouses' query to refetch the list
 * and displays a success notification.
 * On error, it displays an error notification with the appropriate message.
 * @returns The result of the `useMutation` hook.
 */
const useDeleteWarehouse = () => {
  const { data: session } = useSession()
  const accessToken = session?.user?.accessToken
  const queryClient = useQueryClient()
  const query = useMutation({
    mutationKey: ['DeleteWarehouse'],
    mutationFn: (id: number) => deleteWarehouseAPI(id, accessToken),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['GetWarehouses'] })
      notification.success({
        message: 'Alamcen eliminado',
        showProgress: true,
        pauseOnHover: true,
      })
    },
    onError: (error: AxiosError<{ ok: boolean; message: string }>) => {
      const errorMessage =
        error?.response?.data?.message || 'Ha ocurrido un error al eliminar el almacén'
      notification.error({
        message: 'Error',
        description: errorMessage,
      })
    },
  })

  return query
}

/**
 * A custom hook that consolidates all warehouse-related React Query hooks.
 * This provides a single export point for easily accessing warehouse data management functionalities.
 * @returns An object containing all warehouse-related hooks.
 */
export const useWarehouse = () => {
  return {
    useGetWarehouses,
    useGetWarehousePerId,
    useCreateWarehouse,
    useUpdateWarehouse,
    useDeleteWarehouse,
  }
}

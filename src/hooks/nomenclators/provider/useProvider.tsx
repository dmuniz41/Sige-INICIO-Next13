import {
  CreateProviderNomenclator,
  ProviderNomenclatorsFilters,
  UpdateProviderNomenclator,
} from '@/types/DTOs/nomenclators/provider'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { notification } from 'antd'
import axios, { AxiosError } from 'axios'
import { useSession } from 'next-auth/react'

const getProviderNomenclatorsAPI = async (
  page: number = 1,
  limit: number = 10,
  filters: ProviderNomenclatorsFilters,
  accessToken: string,
) => {
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/nomenclators/provider?page=${page}&limit=${limit}`,
    {
      params: { ...filters },
      headers: { accessToken },
    },
  )
  return response.data
}

const createProviderNomenclatorAPI = async (
  values: CreateProviderNomenclator,
  accessToken: string,
) => {
  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/nomenclators/provider`,
    { ...values },
    { headers: { accessToken } },
  )
  return response.data
}

const updateProviderNomenclatorAPI = async (
  id: number,
  values: UpdateProviderNomenclator,
  accessToken: string,
) => {
  const response = await axios.put(
    `${process.env.NEXT_PUBLIC_API_URL}/nomenclators/provider/${id}`,
    { ...values },
    { headers: { accessToken } },
  )
  return response.data
}

const deleteProviderNomenclatorAPI = async (id: number, accessToken: string) => {
  const response = await axios.delete(
    `${process.env.NEXT_PUBLIC_API_URL}/nomenclators/provider/${id}`,
    {
      headers: { accessToken },
    },
  )
  return response.data
}

const useGetProviderNomenclators = (
  page: number,
  limit: number,
  filters: ProviderNomenclatorsFilters,
) => {
  const { data: session, status } = useSession()
  const accessToken = (session?.user as any)?.accessToken
  const query = useQuery({
    queryKey: ['GetProviderNomenclators', page, limit, filters],
    queryFn: () => getProviderNomenclatorsAPI(page, limit, filters, accessToken),
    enabled: status === 'authenticated',
  })

  return query
}

const useCreateProviderNomenclator = () => {
  const { data: session } = useSession()
  const accessToken = (session?.user as any)?.accessToken
  const queryClient = useQueryClient()
  const query = useMutation({
    mutationKey: ['CreateProviderNomenclator'],
    mutationFn: (values: CreateProviderNomenclator) =>
      createProviderNomenclatorAPI(values, accessToken),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['GetProviderNomenclators'] })
      notification.success({
        message: 'Nomenclador de proveedor creado',
        showProgress: true,
        pauseOnHover: true,
      })
    },
    onError: (error: AxiosError<{ ok: boolean; message: string }>) => {
      const errorMessage =
        error?.response?.data?.message ||
        'Ha ocurrido un error al crear el nomenclador de proveedor'
      notification.error({
        message: 'Error',
        description: errorMessage,
      })
    },
  })

  return query
}

const useUpdateProviderNomenclator = () => {
  const { data: session } = useSession()
  const accessToken = (session?.user as any)?.accessToken
  const queryClient = useQueryClient()
  const query = useMutation({
    mutationKey: ['UpdateProviderNomenclator'],
    mutationFn: ({ id, values }: { id: number; values: UpdateProviderNomenclator }) =>
      updateProviderNomenclatorAPI(id, values, accessToken),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['GetProviderNomenclators'] })
      notification.success({
        message: 'Nomenclador de proveedor actualizado',
        showProgress: true,
        pauseOnHover: true,
      })
    },
    onError: (error: AxiosError<{ ok: boolean; message: string }>) => {
      const errorMessage =
        error?.response?.data?.message ||
        'Ha ocurrido un error al actualizar el nomenclador de proveedor'
      notification.error({
        message: 'Error',
        description: errorMessage,
      })
    },
  })

  return query
}

const useDeleteProviderNomenclator = () => {
  const { data: session } = useSession()
  const accessToken = (session?.user as any)?.accessToken
  const queryClient = useQueryClient()
  const query = useMutation({
    mutationKey: ['DeleteProviderNomenclator'],
    mutationFn: (id: number) => deleteProviderNomenclatorAPI(id, accessToken),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['GetProviderNomenclators'] })
      notification.success({
        message: 'Nomenclador de proveedor eliminado',
        showProgress: true,
        pauseOnHover: true,
      })
    },
    onError: (error: AxiosError<{ ok: boolean; message: string }>) => {
      const errorMessage =
        error?.response?.data?.message ||
        'Ha ocurrido un error al eliminar el nomenclador de proveedor'
      notification.error({
        message: 'Error',
        description: errorMessage,
      })
    },
  })

  return query
}

export const useUnitMeasureNomenclator = () => {
  return {
    useGetProviderNomenclators,
    useCreateProviderNomenclator,
    useUpdateProviderNomenclator,
    useDeleteProviderNomenclator,
  }
}

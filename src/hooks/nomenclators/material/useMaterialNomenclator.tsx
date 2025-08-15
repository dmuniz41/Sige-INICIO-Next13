import { notification } from 'antd'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import axios, { AxiosError } from 'axios'

import {
  InsertMaterialNomenclator,
  MaterialNomenclatorsFilters,
  UpdateMaterialNomenclator,
} from '@/types/DTOs/nomenclators/materials'

const getMaterialNomenclatorsAPI = async (
  page: number = 1,
  limit: number = 10,
  accessToken: string,
  filters?: MaterialNomenclatorsFilters,
) => {
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/nomenclators/material?page=${page}&limit=${limit}`,
    {
      params: { ...filters },
      headers: { accessToken },
    },
  )
  return response.data
}

const getMaterialNomenclatorsPerCodeAPI = async (code: number, accessToken: string) => {
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/nomenclators/material/${code}`,
    {
      headers: { accessToken },
    },
  )
  return response.data
}

const createMaterialNomenclatorsAPI = async (
  values: InsertMaterialNomenclator,
  accessToken: string,
) => {
  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/nomenclators/material`,
    { ...values },
    { headers: { accessToken } },
  )
  return response.data
}

const updateMaterialNomenclatorsAPI = async (
  id: number,
  values: UpdateMaterialNomenclator,
  accessToken: string,
) => {
  const response = await axios.put(
    `${process.env.NEXT_PUBLIC_API_URL}/nomenclators/material/${id}`,
    { ...values },
    { headers: { accessToken } },
  )
  return response.data
}

const deleteMaterialNomenclatorsAPI = async (code: number, accessToken: string) => {
  const response = await axios.delete(
    `${process.env.NEXT_PUBLIC_API_URL}/nomenclators/material/${code}`,
    {
      headers: { accessToken },
    },
  )
  return response.data
}

const useGetMaterialNomenclator = (
  page: number,
  limit: number,
  filters?: MaterialNomenclatorsFilters,
) => {
  const { data: session, status } = useSession()
  const accessToken = (session?.user as any)?.accessToken
  const query = useQuery({
    queryKey: ['GetMaterialNomenclators', page, limit, filters],
    queryFn: () => getMaterialNomenclatorsAPI(page, limit, accessToken,filters),
    enabled: status === 'authenticated',
  })

  return query
}

const useGetMaterialNomenclatorPerCode = (code: number) => {
  const { data: session, status } = useSession()
  const accessToken = (session?.user as any)?.accessToken
  const query = useQuery({
    queryKey: ['GetMaterialNomenclatorsPerCode'],
    queryFn: () => getMaterialNomenclatorsPerCodeAPI(code, accessToken),
    enabled: status === 'authenticated',
  })

  return query
}

const useCreateMaterialNomenclator = () => {
  const { data: session } = useSession()
  const accessToken = (session?.user as any)?.accessToken
  const queryClient = useQueryClient()
  const query = useMutation({
    mutationKey: ['CreateMaterialNomenclator'],
    mutationFn: (values: InsertMaterialNomenclator) =>
      createMaterialNomenclatorsAPI(values, accessToken),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['GetMaterialNomenclators'] })
      notification.success({
        message: 'Nomenclador de material creado',
        showProgress: true,
        pauseOnHover: true,
      })
    },
    onError: (error: AxiosError<{ ok: boolean; message: string }>) => {
      const errorMessage =
        error?.response?.data?.message || 'Ha ocurrido un error al crear el nomenclador de material'
      notification.error({
        message: 'Error',
        description: errorMessage,
      })
    },
  })

  return query
}

const useUpdateMaterialNomenclator = () => {
  const { data: session } = useSession()
  const accessToken = (session?.user as any)?.accessToken
  const queryClient = useQueryClient()
  const query = useMutation({
    mutationKey: ['UpdateMaterialNomenclator'],
    mutationFn: ({
      id,
      values,
    }: {
      id: number
      values: UpdateMaterialNomenclator
      accessToken: string
    }) => updateMaterialNomenclatorsAPI(id, values, accessToken),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['GetMaterialNomenclators'] })
      notification.success({
        message: 'Nomenclador de material actualizado',
        showProgress: true,
        pauseOnHover: true,
      })
    },
    onError: (error: AxiosError<{ ok: boolean; message: string }>) => {
      const errorMessage =
        error?.response?.data?.message ||
        'Ha ocurrido un error al actualizar el nomenclador de material'
      notification.error({
        message: 'Error',
        description: errorMessage,
      })
    },
  })

  return query
}

const useDeleteMaterialNomenclator = () => {
  const { data: session } = useSession()
  const accessToken = (session?.user as any)?.accessToken
  const queryClient = useQueryClient()
  const query = useMutation({
    mutationKey: ['DeleteMaterialNomenclator'],
    mutationFn: (code: number) => deleteMaterialNomenclatorsAPI(code, accessToken),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['GetMaterialNomenclators'] })
      notification.success({
        message: 'Nomenclador de material eliminado',
        showProgress: true,
        pauseOnHover: true,
      })
    },
    onError: (error: AxiosError<{ ok: boolean; message: string }>) => {
      const errorMessage =
        error?.response?.data?.message ||
        'Ha ocurrido un error al eliminar el nomenclador de material'
      notification.error({
        message: 'Error',
        description: errorMessage,
      })
    },
  })

  return query
}

export const useMaterialNomenclator = () => {
  return {
    useGetMaterialNomenclator,
    useGetMaterialNomenclatorPerCode,
    useCreateMaterialNomenclator,
    useUpdateMaterialNomenclator,
    useDeleteMaterialNomenclator,
  }
}

import { Toast } from '@/helpers/customAlert'
import {
  InsertMaterial,
  MaterialFilters,
  RemoveMaterial,
  UpdateMaterial,
} from '@/types/DTOs/materials/materials'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { notification } from 'antd'

import axios, { AxiosError } from 'axios'
import { useSession } from 'next-auth/react'
import Swal from 'sweetalert2'

const getMaterialsAPI = async (
  page: number = 1,
  limit: number = 10,
  filters: MaterialFilters,
  warehouseId: number,
  accessToken?: string,
) => {
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/material/${warehouseId}?page=${page}&limit=${limit}`,
    {
      params: { ...filters },
      headers: { accessToken },
    },
  )
  return response.data
}

const getMaterialByIdAPI = async (
  materialId: number,
  warehouseId: number,
  accessToken?: string,
) => {
  const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/material/${warehouseId}`, {
    params: { materialId },
    headers: { accessToken },
  })
  return response.data
}

const addMaterialAPI = async (values: InsertMaterial, accessToken?: string) => {
  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/material/addMaterial`,
    { ...values },
    { headers: { accessToken } },
  )
  return response.data
}

const removeMaterialAPI = async (values: RemoveMaterial, accessToken?: string) => {
  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/material/removeMaterial`,
    { ...values },
    { headers: { accessToken } },
  )
  return response.data
}

const updateMaterialAPI = async (
  warehouseId: number,
  materialId: number,
  values: UpdateMaterial,
  accessToken?: string,
) => {
  const response = await axios.put(
    `${process.env.NEXT_PUBLIC_API_URL}/material/${warehouseId}?materialId=${materialId}`,
    { ...values },
    { headers: { accessToken } },
  )
  return response.data
}

// TODO: PENDIENTE
// const deleteMaterialAPI = async (id: number) => {
//   const token = localStorage.getItem("accessToken");
//   const response = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/warehouse/${id}`, {
//     headers: { accessToken: token }
//   });
//   return response.data;
// };

const useGetMaterials = (
  page: number,
  limit: number,
  warehouseId: number,
  filters: MaterialFilters,
) => {
  const { data: session, status } = useSession()
  const accessToken = session?.user?.accessToken

  const query = useQuery({
    queryKey: ['GetMaterials', page, limit, warehouseId],
    queryFn: () => getMaterialsAPI(page, limit, filters, warehouseId, accessToken),
    enabled: status === 'authenticated',
    placeholderData: (previousData) => previousData,
  })

  return query
}
const useGetMaterialById = (materialId: number, warehouseId: number) => {
  const { data: session, status } = useSession()
  const accessToken = session?.user?.accessToken

  const query = useQuery({
    queryKey: ['GetMaterialById', materialId, warehouseId],
    queryFn: () => getMaterialByIdAPI(materialId, warehouseId, accessToken),
    enabled: status === 'authenticated',
    placeholderData: (previousData) => previousData,
  })

  return query
}

const useAddMaterial = () => {
  const queryClient = useQueryClient()
  const { data: session } = useSession()
  const accessToken = session?.user?.accessToken

  const query = useMutation({
    mutationKey: ['AddMaterial'],
    mutationFn: (values: InsertMaterial) => addMaterialAPI(values, accessToken),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['GetMaterials'] })
      notification.success({
        message: 'Nuevo material creado',
        showProgress: true,
        pauseOnHover: true,
      })
    },
    onError: (error: AxiosError<{ ok: boolean; message: string }>) => {
      const errorMessage =
        error?.response?.data?.message || 'Ha ocurrido un error al añadir el material'
      notification.error({
        message: 'Error',
        description: errorMessage,
      })
    },
  })

  return query
}

const useRemoveMaterial = () => {
  const queryClient = useQueryClient()
  const { data: session } = useSession()
  const accessToken = session?.user?.accessToken

  const query = useMutation({
    mutationKey: ['RemoveMaterial'],
    mutationFn: (values: RemoveMaterial) => removeMaterialAPI(values, accessToken),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['GetMaterials'] })
      notification.success({
        message: 'Material eliminado',
        showProgress: true,
        pauseOnHover: true,
      })
    },
    onError: (error: AxiosError<{ ok: boolean; message: string }>) => {
      const errorMessage =
        error?.response?.data?.message || 'Ha ocurrido un error al eliminar el material'
      notification.error({
        message: 'Error',
        description: errorMessage,
      })
    },
  })

  return query
}

const useUpdateMaterial = () => {
  const queryClient = useQueryClient()
  const { data: session } = useSession()
  const accessToken = session?.user?.accessToken

  const query = useMutation({
    mutationKey: ['UpdateMaterial'],
    mutationFn: ({
      warehouseId,
      materialId,
      values,
    }: {
      warehouseId: number
      materialId: number
      values: UpdateMaterial
    }) => updateMaterialAPI(warehouseId, materialId, values, accessToken),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['GetMaterials'] })
      notification.success({
        message: 'Material actualizado',
        showProgress: true,
        pauseOnHover: true,
      })
    },
    onError: (error: AxiosError<{ ok: boolean; message: string }>) => {
      const errorMessage =
        error?.response?.data?.message || 'Ha ocurrido un error al actualizar el material'
      notification.error({
        message: 'Error',
        description: errorMessage,
      })
    },
  })

  return query
}

export const useMaterials = () => {
  return {
    useGetMaterials,
    useAddMaterial,
    useRemoveMaterial,
    useUpdateMaterial,
    useGetMaterialById,
  }
}

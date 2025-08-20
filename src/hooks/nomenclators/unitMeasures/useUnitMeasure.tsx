import { notification } from 'antd'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import axios, { AxiosError } from 'axios'

import { MaterialNomenclatorsFilters } from '@/types/DTOs/nomenclators/materials'
import {
  InsertUnitMeasureNomenclator,
  UpdateUnitMeasureNomenclator,
} from '@/types/DTOs/nomenclators/unitMeasures'

/**
 * Realiza una solicitud GET a la API para obtener nomencladores de unidades de medida.
 * @param {number} [page=1] - El número de página a recuperar.
 * @param {number} [limit=10] - El número de elementos por página.
 * @param {MaterialNomenclatorsFilters} filters - Los filtros a aplicar a la consulta.
 * @param {string} accessToken - El token de acceso para la autenticación.
 * @returns {Promise<any>} Los datos de respuesta de la API.
 */
const getUnitMeasureNomenclatorsAPI = async (
  page: number = 1,
  limit: number = 10,
  filters: MaterialNomenclatorsFilters,
  accessToken: string,
) => {
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/nomenclators/unitMeasure?page=${page}&limit=${limit}`,
    {
      params: { ...filters },
      headers: { accessToken },
    },
  )
  return response.data
}

/**
 * Realiza una solicitud POST a la API para crear un nuevo nomenclador de unidad de medida.
 * @param {InsertUnitMeasureNomenclator} values - Los valores para crear el nomenclador.
 * @param {string} accessToken - El token de acceso para la autenticación.
 * @returns {Promise<any>} Los datos de respuesta de la API.
 */
const createUnitMeasureNomenclatorAPI = async (
  values: InsertUnitMeasureNomenclator,
  accessToken: string,
) => {
  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/nomenclators/unitMeasure`,
    { ...values },
    { headers: { accessToken } },
  )
  return response.data
}

/**
 * Realiza una solicitud PUT a la API para actualizar un nomenclador de unidad de medida existente.
 * @param {number} id - El ID del nomenclador a actualizar.
 * @param {UpdateUnitMeasureNomenclator} values - Los nuevos valores para el nomenclador.
 * @param {string} accessToken - El token de acceso para la autenticación.
 * @returns {Promise<any>} Los datos de respuesta de la API.
 */
const updateUnitMeasureNomenclatorAPI = async (
  id: number,
  values: UpdateUnitMeasureNomenclator,
  accessToken: string,
) => {
  console.log('🚀 ~ updateUnitMeasureNomenclatorAPI ~ values:', values)
  const response = await axios.put(
    `${process.env.NEXT_PUBLIC_API_URL}/nomenclators/unitMeasure/${id}`,
    { ...values },
    { headers: { accessToken } },
  )
  return response.data
}

/**
 * Realiza una solicitud DELETE a la API para eliminar un nomenclador de unidad de medida.
 * @param {number} id - El ID del nomenclador a eliminar.
 * @param {string} accessToken - El token de acceso para la autenticación.
 * @returns {Promise<any>} Los datos de respuesta de la API.
 */
const deleteUnitMeasureNomenclatorAPI = async (id: number, accessToken: string) => {
  const response = await axios.delete(
    `${process.env.NEXT_PUBLIC_API_URL}/nomenclators/unitMeasure/${id}`,
    {
      headers: { accessToken },
    },
  )
  return response.data
}

/**
 * Hook personalizado para obtener nomencladores de unidades de medida paginados y filtrados.
 * Utiliza `react-query` para la gestión de estados asíncronos.
 *
 * @param {number} page - El número de página actual.
 * @param {number} limit - El límite de elementos por página.
 * @param {MaterialNomenclatorsFilters} filters - Los filtros a aplicar a la consulta.
 * @returns {import('@tanstack/react-query').UseQueryResult} El resultado de la consulta.
 */
const useGetUnitMeasureNomenclator = (
  page: number,
  limit: number,
  filters: MaterialNomenclatorsFilters,
) => {
  const { data: session, status } = useSession()
  const accessToken = (session?.user as any)?.accessToken
  const query = useQuery({
    queryKey: ['GetUnitMeasureNomenclators', page, limit, filters],
    queryFn: () => getUnitMeasureNomenclatorsAPI(page, limit, filters, accessToken),
    enabled: status === 'authenticated',
  })

  return query
}

/**
 * Hook personalizado para crear un nomenclador de unidad de medida.
 * Invalida la caché de "GetUnitMeasureNomenclators" al éxito y muestra notificaciones.
 *
 * @returns {import('@tanstack/react-query').UseMutationResult} El resultado de la mutación.
 */
const useCreateUnitMeasureNomenclator = () => {
  const { data: session } = useSession()
  const accessToken = (session?.user as any)?.accessToken
  const queryClient = useQueryClient()
  const query = useMutation({
    mutationKey: ['CreateUnitMeasureNomenclator'],
    mutationFn: (values: InsertUnitMeasureNomenclator) =>
      createUnitMeasureNomenclatorAPI(values, accessToken),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['GetUnitMeasureNomenclators'] })
      notification.success({
        message: 'Nomenclador de unidad de medida creado',
        showProgress: true,
        pauseOnHover: true,
      })
    },
    onError: (error: AxiosError<{ ok: boolean; message: string }>) => {
      const errorMessage =
        error?.response?.data?.message ||
        'Ha ocurrido un error al crear el nomenclador de unidad de medida'
      notification.error({
        message: 'Error',
        description: errorMessage,
      })
    },
  })

  return query
}

/**
 * Hook personalizado para actualizar un nomenclador de unidad de medida.
 * Invalida la caché de "GetUnitMeasureNomenclators" al éxito y muestra notificaciones.
 *
 * @returns {import('@tanstack/react-query').UseMutationResult} El resultado de la mutación.
 */
const useUpdateUnitMeasureNomenclator = () => {
  const { data: session } = useSession()
  const accessToken = (session?.user as any)?.accessToken
  const queryClient = useQueryClient()
  const query = useMutation({
    mutationKey: ['UpdateUnitMeasureNomenclator'],
    mutationFn: ({ id, values }: { id: number; values: UpdateUnitMeasureNomenclator }) =>
      updateUnitMeasureNomenclatorAPI(id, values, accessToken),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['GetUnitMeasureNomenclators'] })
      notification.success({
        message: 'Nomenclador de unidad de medida actualizado',
        showProgress: true,
        pauseOnHover: true,
      })
    },
    onError: (error: AxiosError<{ ok: boolean; message: string }>) => {
      const errorMessage =
        error?.response?.data?.message ||
        'Ha ocurrido un error al actualizar el nomenclador de unidad de medida'
      notification.error({
        message: 'Error',
        description: errorMessage,
      })
    },
  })

  return query
}

/**
 * Hook personalizado para eliminar un nomenclador de unidad de medida.
 * Invalida la caché de "GetUnitMeasureNomenclators" al éxito y muestra notificaciones.
 *
 * @returns {import('@tanstack/react-query').UseMutationResult} El resultado de la mutación.
 */
const useDeleteUnitMeasureNomenclator = () => { 
  const { data: session } = useSession()
  const accessToken = (session?.user as any)?.accessToken
  const queryClient = useQueryClient()
  const query = useMutation({
    mutationKey: ['DeleteUnitMeasureNomenclator'],
    mutationFn: (id: number) => deleteUnitMeasureNomenclatorAPI(id, accessToken),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['GetUnitMeasureNomenclators'] })
      notification.success({
        message: 'Nomenclador de unidad de medida eliminado',
        showProgress: true,
        pauseOnHover: true,
      })
    },
    onError: (error: AxiosError<{ ok: boolean; message: string }>) => {
      const errorMessage =
        error?.response?.data?.message ||
        'Ha ocurrido un error al eliminar el nomenclador de unidad de medida'
      notification.error({
        message: 'Error',
        description: errorMessage,
      })
    },
  })

  return query
}

/**
 * Hook principal que agrupa los hooks de consulta y mutación para los nomencladores de unidades de medida.
 *
 * @returns {{
 *   useGetUnitMeasureNomenclator: typeof useGetUnitMeasureNomenclator,
 *   useCreateUnitMeasureNomenclator: typeof useCreateUnitMeasureNomenclator,
 *   useUpdateUnitMeasureNomenclator: typeof useUpdateUnitMeasureNomenclator,
 *   useDeleteUnitMeasureNomenclator: typeof useDeleteUnitMeasureNomenclator
 * }} Un objeto que contiene los hooks para obtener, crear, actualizar y eliminar nomencladores.
 */
export const useUnitMeasureNomenclator = () => {
  return {
    useGetUnitMeasureNomenclator,
    useCreateUnitMeasureNomenclator,
    useUpdateUnitMeasureNomenclator,
    useDeleteUnitMeasureNomenclator,
  }
}

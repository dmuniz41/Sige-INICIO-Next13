import {
  CreateProviderNomenclator,
  ProviderNomenclatorsFilters,
  UpdateProviderNomenclator,
} from '@/types/DTOs/nomenclators/provider'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { notification } from 'antd'
import axios, { AxiosError } from 'axios'
import { useSession } from 'next-auth/react'

/**
 * Función para obtener los nomencladores de proveedor desde la API.
 * @param {number} [page=1] - Número de página.
 * @param {number} [limit=10] - Límite de resultados por página.
 * @param {ProviderNomenclatorsFilters} filters - Filtros a aplicar.
 * @param {string} accessToken - Token de acceso para la autenticación.
 * @returns {Promise<any>} - Promesa que resuelve con los datos de los nomencladores de proveedor.
 */
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

/**
 * Función para crear un nomenclador de proveedor en la API.
 * @param {CreateProviderNomenclator} values - Valores para crear el nomenclador.
 * @param {string} accessToken - Token de acceso para la autenticación.
 * @returns {Promise<any>} - Promesa que resuelve con los datos del nomenclador creado.
 */
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

/**
 * Función para actualizar un nomenclador de proveedor en la API.
 * @param {number} id - ID del nomenclador a actualizar.
 * @param {UpdateProviderNomenclator} values - Valores para actualizar el nomenclador.
 * @param {string} accessToken - Token de acceso para la autenticación.
 * @returns {Promise<any>} - Promesa que resuelve con los datos del nomenclador actualizado.
 */
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

/**
 * Función para eliminar un nomenclador de proveedor en la API.
 * @param {number} id - ID del nomenclador a eliminar.
 * @param {string} accessToken - Token de acceso para la autenticación.
 * @returns {Promise<any>} - Promesa que resuelve con los datos de la operación de eliminación.
 */
const deleteProviderNomenclatorAPI = async (id: number, accessToken: string) => {
  const response = await axios.delete(
    `${process.env.NEXT_PUBLIC_API_URL}/nomenclators/provider/${id}`,
    {
      headers: { accessToken },
    },
  )
  return response.data
}

/**
 * Hook personalizado para obtener los nomencladores de proveedor.
 * Utiliza `react-query` para la gestión del estado de la petición.
 * @param {number} page - Número de página actual.
 * @param {number} limit - Límite de resultados por página.
 * @param {ProviderNomenclatorsFilters} filters - Filtros a aplicar en la consulta.
 * @returns {import('@tanstack/react-query').UseQueryResult} - Objeto con el estado y los datos de la consulta.
 */
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

/**
 * Hook personalizado para crear un nomenclador de proveedor.
 * Utiliza `react-query` para la gestión de mutaciones.
 * Invalida el caché de 'GetProviderNomenclators' al éxito y muestra notificaciones.
 * @returns {import('@tanstack/react-query').UseMutationResult} - Objeto con el estado y las funciones de la mutación.
 */
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

/**
 * Hook personalizado para actualizar un nomenclador de proveedor.
 * Utiliza `react-query` para la gestión de mutaciones.
 * Invalida el caché de 'GetProviderNomenclators' al éxito y muestra notificaciones.
 * @returns {import('@tanstack/react-query').UseMutationResult} - Objeto con el estado y las funciones de la mutación.
 */
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

/**
 * Hook personalizado para eliminar un nomenclador de proveedor.
 * Utiliza `react-query` para la gestión de mutaciones.
 * Invalida el caché de 'GetProviderNomenclators' al éxito y muestra notificaciones.
 * @returns {import('@tanstack/react-query').UseMutationResult} - Objeto con el estado y las funciones de la mutación.
 */
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

/**
 * Hook principal que agrupa todos los hooks relacionados con los nomencladores de proveedor.
 * Facilita la importación y uso de todas las funcionalidades en un solo lugar.
 * @returns {object} Un objeto que contiene los hooks para obtener, crear, actualizar y eliminar nomencladores de proveedor.
 */
export const useProvider = () => {
  return {
    useGetProviderNomenclators,
    useCreateProviderNomenclator,
    useUpdateProviderNomenclator,
    useDeleteProviderNomenclator,
  }
}

import { DeleteSvg } from '@/app/global/DeleteSvg'
import { EditSvg } from '@/app/global/EditSvg'
import { ProviderNomenclators } from '@/db/migrations/schema'
import { useProvider } from '@/hooks/nomenclators/provider/useProvider'
import { ProviderNomenclatorsFilters } from '@/types/DTOs/nomenclators/provider'
import { useQueryClient } from '@tanstack/react-query'
import { Spin, Tooltip } from 'antd'
import Table, { ColumnsType } from 'antd/es/table'
import { useState } from 'react'
import Swal from 'sweetalert2'
import FilterDrawer from './FiltersDrawer'
import { LoadingOutlined } from '@ant-design/icons'
import { RefreshSvg } from '@/app/global/RefreshSvg'
import { PlusSvg } from '@/app/global/PlusSvg'
import { FilterSvg } from '@/app/global/FilterSvg'

const ProvidersTable: React.FC = () => {
  const queryClient = useQueryClient()
  const [createNewModal, setCreateNewModal] = useState(false)
  const [editModal, setEditModal] = useState(false)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [limit, setLimit] = useState<number>(15)
  const [filters, setFilters] = useState<ProviderNomenclatorsFilters>({})
  const [showFilters, setShowFilters] = useState(false)
  const [selectedNomenclator, setSelectedNomenclator] = useState<ProviderNomenclators>()

  const {
    useCreateProviderNomenclator,
    useUpdateProviderNomenclator,
    useGetProviderNomenclators,
    useDeleteProviderNomenclator,
  } = useProvider()

  const {
    data: providerNomenclators,
    isLoading,
    isError,
  } = useGetProviderNomenclators(currentPage, limit, filters)
  const { mutateAsync: deleteProviderNomenclator } = useDeleteProviderNomenclator()
  const { mutateAsync: createProviderNomenclator, isPending: isCreatePending } =
    useCreateProviderNomenclator()
  const { mutateAsync: updateProviderNomenclator, isPending: isUpdatePending } =
    useUpdateProviderNomenclator()

  const handleFilterSubmit = (filters: any) => {
    setCurrentPage(1)
    setFilters(filters)
  }

  const handleFilterReset = () => {
    setCurrentPage(1)
    setFilters({})
  }
  const handleEdit = (record: ProviderNomenclators) => {
    setSelectedNomenclator(record)
    setEditModal(true)
  }

  const handleRefresh = () => {
    queryClient.invalidateQueries({
      queryKey: ['GetProviderNomenclators', currentPage, limit, filters],
    })
  }

  const handleNew = () => {
    setCreateNewModal(true)
  }

  const handleShowFilters = () => {
    setShowFilters(!showFilters)
  }

  const handleCreate = async (values: any) => {
    await createProviderNomenclator({ ...values })
  }

  const handleDelete = (code: number) => {
    Swal.fire({
      title: 'Eliminar Proveedor',
      text: 'El proveedor seleccionado se borrará de forma permanente',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Eliminar',
    }).then((result) => {
      if (result.isConfirmed) {
        deleteProviderNomenclator(code)
      }
    })
  }

  const columns: ColumnsType<ProviderNomenclators> = [
    {
      title: <span className="text-base font-bold">Nombre</span>,
      dataIndex: 'name',
      render(value) {
        return <span className="text-base">{value}</span>
      },
    },
    {
      title: <span className="text-base font-bold">Contacto</span>,
      dataIndex: 'contact',
      render(value) {
        return <span className="text-base">{value}</span>
      },
    },

    {
      title: <span className="text-base font-bold">Acciones</span>,
      width: '5%',
      align: 'center',
      render: (_, { ...record }) => (
        <div className="flex gap-1 justify-center">
          <Tooltip placement="top" title={'Editar'} arrow={{ pointAtCenter: true }}>
            <button onClick={() => handleEdit(record)} className="table-see-action-btn">
              <EditSvg width={20} height={20} />
            </button>
          </Tooltip>

          <Tooltip placement="top" title={'Eliminar'} arrow={{ pointAtCenter: true }}>
            <button onClick={() => handleDelete(record.id)} className="table-delete-action-btn">
              <DeleteSvg width={20} height={20} />
            </button>
          </Tooltip>
        </div>
      ),
    },
  ]

  if (isError) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Ocurrió un error al obtener los nomencladores de materiales',
    })
  }

  return (
    <>
      <section className="flex h-16 w-full bg-white-100 rounded-md shadow-md mb-4 items-center pl-4 gap-4">
        <Spin
          spinning={isCreatePending}
          indicator={<LoadingOutlined style={{ fontSize: 80 }} spin />}
          size="large"
          fullscreen
          tip={<span className="text-xl font-bold">Creando nuevo nomenclador ...</span>}
        />
        <Spin
          spinning={isUpdatePending}
          indicator={<LoadingOutlined style={{ fontSize: 80 }} spin />}
          size="large"
          fullscreen
          tip={<span className="text-xl font-bold">Actualizando nomenclador ...</span>}
        />
        <button className={'toolbar-primary-icon-btn'} onClick={handleNew}>
          <PlusSvg />
          Nuevo
        </button>
        <div className="flex">
          <Tooltip placement="top" title={'Filtrar'} arrow={{ pointAtCenter: true }}>
            <button
              className="cursor-pointer hover:bg-white-600 ease-in-out duration-300 p-2 flex justify-center items-center text-xl rounded-full"
              onClick={handleShowFilters}
            >
              <FilterSvg width={25} height={25} />
            </button>
          </Tooltip>
          <Tooltip placement="top" title={'Refrescar'} arrow={{ pointAtCenter: true }}>
            <button
              className="cursor-pointer hover:bg-white-600 ease-in-out duration-300 p-2 flex justify-center items-center text-xl rounded-full"
              onClick={handleRefresh}
            >
              <RefreshSvg width={25} height={25} />
            </button>
          </Tooltip>
        </div>
      </section>
      <Table
        size="small"
        columns={columns}
        dataSource={providerNomenclators?.data}
        loading={{
          spinning: isLoading,
          indicator: (
            <Spin indicator={<LoadingOutlined style={{ fontSize: 50, color: '#ff8533' }} spin />} />
          ),
        }}
        pagination={{
          position: ['bottomCenter'],
          defaultPageSize: 15,
          total: providerNomenclators?.total,
          onChange: (page, limit) => {
            setCurrentPage(page)
            setLimit(limit)
          },
        }}
        className="shadow-md"
        rowKey={(record) => record.id}
      />
      {/* <CreateUnitMeasureNomenclatorForm
        open={createNewModal}
        onCancel={() => setCreateNewModal(false)}
        onCreate={handleCreate}
      /> */}
      {/* <UpdateUnitMeasureNomenclatorForm
        open={editModal}
        onCancel={() => {
          setEditModal(false)
        }}
        onCreate={handleUpdate}
        defaultValues={selectedNomenclator!}
      /> */}
      <FilterDrawer
        open={showFilters}
        onCancel={() => setShowFilters(false)}
        onFilter={handleFilterSubmit}
        onReset={handleFilterReset}
      />
    </>
  )
}

export default ProvidersTable

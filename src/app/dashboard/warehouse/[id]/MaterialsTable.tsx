'use client'
import { LoadingOutlined } from '@ant-design/icons'
import { Spin, Table, Tooltip } from 'antd'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import Swal from 'sweetalert2'
import type { ColumnsType } from 'antd/es/table'

import { ArrowsTransferSvg } from '@/app/global/ArrowsTransferSvg'
import { EditSvg } from '../../../global/EditSvg'
import { formatDate } from '@/helpers/formatDate'
import { Material } from '@/db/migrations/schema'
import { PlusSvg } from '../../../global/PlusSvg'
import { RefreshSvg } from '../../../global/RefreshSvg'
import { useMaterials } from '@/hooks/materials/useMaterials'
import { useQueryClient } from '@tanstack/react-query'
import { MaterialFilters } from '@/types/DTOs/materials/materials'
import FilterDrawer from './FiltersDrawer'
import { FilterSvg } from '@/app/global/FilterSvg'

// const PDFDownloadLink = dynamic(() => import("@react-pdf/renderer").then((mod) => mod.PDFDownloadLink), {
//   ssr: false,
//   loading: () => <p>Loading...</p>
// });

const MaterialsTable = ({ warehouseId }: { warehouseId: string }) => {
  const queryClient = useQueryClient()
  const router = useRouter()

  const [currentPage, setCurrentPage] = useState<number>(1)
  const [limit, setLimit] = useState<number>(15)
  const [page, setPage] = useState<number>(1)
  const [filters, setFilters] = useState<MaterialFilters>({
    name: '',
    category: '',
    description: '',
    enterDateStart: '',
    enterDateEnd: '',
    unitMeasure: '',
    provider: '',
  })
  const [showFilters, setShowFilters] = useState(false)

  // // PARA REPORTE EN PDF
  // const fields = [
  //   {
  //     title: "Categoría",
  //     custom: true,
  //     component: (item: any) => `${item.category}`,
  //     width: "20"
  //   },
  //   {
  //     title: "Nombre",
  //     custom: true,
  //     component: (item: any) => `${item.materialName}`,
  //     width: "15"
  //   },
  //   {
  //     title: "Descripción",
  //     custom: true,
  //     component: (item: any) => `${item.description}`,
  //     width: "15"
  //   },
  //   {
  //     title: "Coste Unitario",
  //     custom: true,
  //     component: (item: any) =>
  //       `$ ${item.costPerUnit.toLocaleString("DE", {
  //         maximumFractionDigits: 2,
  //         minimumFractionDigits: 2
  //       })}`,
  //     width: "15"
  //   },
  //   {
  //     title: "Existencias",
  //     custom: true,
  //     component: (item: any) =>
  //       `${item.unitsTotal.toLocaleString("DE", {
  //         maximumFractionDigits: 2,
  //         minimumFractionDigits: 2
  //       })}`,
  //     width: "10"
  //   },
  //   {
  //     title: "U/M",
  //     custom: true,
  //     component: (item: any) => `${item.unitMeasure}`,
  //     width: "15"
  //   },
  //   {
  //     title: "Proveedor",
  //     custom: true,
  //     component: (item: any) => `${item.provider}`,
  //     width: "10"
  //   }
  // ];

  const { useGetMaterials } = useMaterials()
  const {
    data: materialsQuery,
    isLoading,
    isError,
  } = useGetMaterials(page, limit, Number(warehouseId), filters)

  // let PDFReportData: DataType[] = [];

  // if (filteredData) {
  //   PDFReportData = filteredData;
  // } else {
  //   PDFReportData = data;
  // }

  // const handleNew = (): void => {
  //   setCreateNewModal(true);
  // };

  const handleFilterSubmit = (filters: any) => {
    setCurrentPage(1)
    setFilters(filters)
  }

  const handleFilterReset = () => {
    setCurrentPage(1)
    setFilters({})
  }

  const handleShowFilters = () => {
    setShowFilters(!showFilters)
  }

  const handleAdd = (): void => {
    router.push(`/dashboard/warehouse/${warehouseId}/newMaterial`)
  }

  const handleEditMaterial = (materialId: number): void => {
    router.push(`/dashboard/warehouse/${warehouseId}/editMaterial?materialId=${materialId}`)
  }

  const handleRefresh = async () => {
    await queryClient.invalidateQueries({ queryKey: ['GetMaterials'] })
  }

  const handleStockMovement = (materialId: number) => {
    router.push(
      `/dashboard/warehouse/${warehouseId}/stockMovement/movementForm?materialId=${materialId}`,
    )
  }

  const columns: ColumnsType<Material> = [
    {
      title: <span className="font-bold">Código</span>,
      dataIndex: 'id',
      width: '80px',
    },
    {
      title: <span className="font-bold">Categoría</span>,
      dataIndex: 'category',
      width: '150px',
      ellipsis: {
        showTitle: false,
      },
      render: (category) => (
        <Tooltip placement="topLeft" title={category}>
          {category}
        </Tooltip>
      ),
    },
    {
      title: <span className="font-bold">Nombre</span>,
      dataIndex: 'name',
      width: '200px',
      ellipsis: {
        showTitle: false,
      },
      render: (name) => (
        <Tooltip placement="topLeft" title={name}>
          {name}
        </Tooltip>
      ),
    },
    {
      title: <span className="font-bold">Descripción</span>,
      dataIndex: 'description',
      width: '250px',
      ellipsis: {
        showTitle: false,
      },
      render: (description) => (
        <Tooltip placement="topLeft" title={description}>
          {description}
        </Tooltip>
      ),
    },
    {
      title: <span className="font-bold">Coste Unitario</span>,
      dataIndex: 'costPerUnit',
      width: '120px',
      sorter: {
        compare: (a, b) => a.costPerUnit - b.costPerUnit,
      },
      render: (value) => (
        <Tooltip
          placement="topLeft"
          title={`$ ${value.toLocaleString('DE', {
            maximumFractionDigits: 2,
            minimumFractionDigits: 2,
          })}`}
        >
          <span>
            ${' '}
            {value.toLocaleString('DE', {
              maximumFractionDigits: 2,
              minimumFractionDigits: 2,
            })}
          </span>
        </Tooltip>
      ),
    },
    {
      title: <span className="font-bold">Existencias</span>,
      dataIndex: 'stock',
      width: '100px',
      render: (value) => (
        <Tooltip
          placement="topLeft"
          title={value.toLocaleString('DE', {
            maximumFractionDigits: 2,
            minimumFractionDigits: 2,
          })}
        >
          <span>
            {value.toLocaleString('DE', {
              maximumFractionDigits: 2,
              minimumFractionDigits: 2,
            })}
          </span>
        </Tooltip>
      ),
      sorter: {
        compare: (a, b) => a.stock - b.stock,
      },
    },
    {
      title: <span className="font-bold">Unidad de Medida</span>,
      dataIndex: 'unitMeasure',
      width: '120px',
      ellipsis: {
        showTitle: false,
      },
      render: (unitMeasure) => (
        <Tooltip placement="topLeft" title={unitMeasure}>
          {unitMeasure}
        </Tooltip>
      ),
    },
    {
      title: <span className="font-bold">Existencias Mínimas</span>,
      dataIndex: 'minimumExistence',
      width: '150px',
      render: (value) => (
        <Tooltip
          placement="topLeft"
          title={value.toLocaleString('DE', {
            maximumFractionDigits: 2,
            minimumFractionDigits: 2,
          })}
        >
          <span>
            {value.toLocaleString('DE', {
              maximumFractionDigits: 2,
              minimumFractionDigits: 2,
            })}
          </span>
        </Tooltip>
      ),
    },
    {
      title: <span className="font-bold">Proveedor</span>,
      dataIndex: 'provider',
      width: '150px',
      sorter: (a: any, b: any) => a.provider.localeCompare(b.provider),
      ellipsis: {
        showTitle: false,
      },
      render: (provider) => (
        <Tooltip placement="topLeft" title={provider}>
          {provider}
        </Tooltip>
      ),
    },
    {
      title: <span className="font-bold">Fecha de Creación</span>,
      dataIndex: 'enterDate',
      width: '150px',
      render: (value: string) => (
        <Tooltip placement="topLeft" title={formatDate(value)}>
          {formatDate(value)}
        </Tooltip>
      ),
    },
    {
      title: <span className="font-bold">Fecha de Edición</span>,
      dataIndex: 'modifyDate',
      width: '150px',
      render: (value: string) => (
        <Tooltip placement="topLeft" title={formatDate(value)}>
          {formatDate(value)}
        </Tooltip>
      ),
    },
    {
      title: <span className="font-bold">Acciones</span>,
      width: '100px',
      fixed: 'right',
      render: (_, record) => (
        <div className="flex gap-1 justify-center">
          <>
            <Tooltip
              placement="top"
              title={'Movimiento de Inventario'}
              arrow={{ pointAtCenter: true }}
            >
              <button
                onClick={() => handleStockMovement(record?.id)}
                className="table-stock-movement-action-btn"
              >
                <ArrowsTransferSvg width={25} height={25} />
              </button>
            </Tooltip>
            <Tooltip placement="top" title={'Editar Material'} arrow={{ pointAtCenter: true }}>
              <button
                onClick={() => handleEditMaterial(record.id)}
                className="table-see-action-btn"
              >
                <EditSvg width={25} height={25} />
              </button>
            </Tooltip>
          </>
        </div>
      ),
    },
  ]

  if (isLoading)
    return (
      <section className="flex h-full w-full items-center justify-center">
        <Spin indicator={<LoadingOutlined style={{ fontSize: 70, color: '#ff8533' }} spin />} />
      </section>
    )

  if (isError) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Ocurrió un error al obtener los materiales',
    })
  }

  return (
    <>
      <div className="flex h-16 w-full bg-white-100 rounded-md shadow-md mb-4 items-center pl-4 gap-4">
        <div className="flex gap-2">
          <button onClick={handleAdd} className="toolbar-primary-icon-btn ">
            <PlusSvg />
            Nuevo
          </button>
        </div>
        <div className="flex">
          <Tooltip placement="top" title={'Refrescar'} arrow={{ pointAtCenter: true }}>
            <button
              className="flex justify-center items-center w-[2.5rem] h-[2.5rem] text-xl rounded-full"
              onClick={handleRefresh}
            >
              <RefreshSvg />
            </button>
          </Tooltip>
          <Tooltip placement="top" title={'Filtrar'} arrow={{ pointAtCenter: true }}>
            <button
              className="cursor-pointer hover:bg-white-600 ease-in-out duration-300 p-2 flex justify-center items-center text-xl rounded-full"
              onClick={handleShowFilters}
            >
              <FilterSvg width={25} height={25} />
            </button>
          </Tooltip>
          {/* <Tooltip placement="top" title={"Generar Reporte"} arrow={{ pointAtCenter: true }}>
            <PDFDownloadLink
              document={<PDFReport fields={fields} data={PDFReportData} title={"REPORTE DE ALMACÉN "} />}
              fileName={`Reporte de almacén (${currentDate})`}
            >
              {({ blob, url, loading, error }) =>
                !canList ? (
                  <button
                    disabled
                    className={`opacity-20 pt-2 pl-2" flex justify-center items-center w-[2.5rem] h-[2.5rem] text-xl rounded-full`}
                  >
                    <PDFSvg />
                  </button>
                ) : (
                  <button
                    disabled={!canList}
                    className={`${
                      canList ? "cursor-pointer hover:bg-white-600 ease-in-out duration-300" : "opacity-20 pt-2 pl-2"
                    } flex justify-center items-center w-[2.5rem] h-[2.5rem] text-xl rounded-full`}
                  >
                    <PDFSvg />
                  </button>
                )
              }
            </PDFDownloadLink>
          </Tooltip> */}
        </div>
      </div>

      <Table
        size="small"
        columns={columns}
        dataSource={materialsQuery?.data}
        pagination={{ position: ['bottomCenter'], defaultPageSize: 10 }}
        onChange={(pagination) => {
          setPage(pagination?.current ?? 1)
          setLimit(pagination?.pageSize ?? 10)
        }}
        sortDirections={['ascend']}
        rowKey={(record) => record.id}
        scroll={{ x: 1500 }}
      />

      <FilterDrawer
        open={showFilters}
        onCancel={() => setShowFilters(false)}
        onFilter={handleFilterSubmit}
        onReset={handleFilterReset}
      />
    </>
  )
}

export default MaterialsTable

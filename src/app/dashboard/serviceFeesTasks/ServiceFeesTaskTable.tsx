"use client";
import { Button, Input, Space, Table, Tooltip } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import dynamic from "next/dynamic";
import Highlighter from "react-highlight-words";
import React, { useEffect, useMemo, useRef, useState } from "react";
import Swal from "sweetalert2";
import type { ColumnType, ColumnsType, TableProps } from "antd/es/table";
import type { FilterConfirmProps, TableRowSelection } from "antd/es/table/interface";
import type { InputRef } from "antd";

import { DeleteSvg } from "@/app/global/DeleteSvg";
import { INomenclator } from "@/models/nomenclator";
import { IServiceFee } from "@/models/serviceFees";
import { IServiceFeeTask } from "@/models/serviceFeeTask";
import { loadSelectedServiceFee, serviceFeeStartLoading, startDeleteServiceFee } from "@/actions/serviceFee";
import { nomenclatorsStartLoading, startDeleteNomenclator } from "@/actions/nomenclator";
import { PDFSvg } from "@/app/global/PDFSvg";
import { PlusSvg } from "@/app/global/PlusSvg";
import { RefreshSvg } from "@/app/global/RefreshSvg";
import { RootState, useAppSelector } from "@/store/store";
import { SeeSvg } from "@/app/global/SeeSvg";
import { startAddServiceFeeTask, startDeleteServiceFeeTask, startLoadServiceFeesTasks, startUpdateServiceFeeTask } from "@/actions/serviceFeeTask";
import { startLoadServiceFeeAuxiliary } from "@/actions/serviceFeeAuxiliary";
import { Toast } from "@/helpers/customAlert";
import { useAppDispatch } from "@/hooks/hooks";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { CreateServiceFeeTaskForm } from "./CreateServiceFeeTask";
import { EditServiceFeeTaskForm } from "./EditServiceFeeTask";
import { EditSvg } from "@/app/global/EditSvg";
import { ServiceFeeTaskView } from "./ServiceFeeTaskView";

type DataIndex = keyof IServiceFeeTask;

const ServiceFeeTaskTable: React.FC = () => {
  const dispatch = useAppDispatch();
  const [createTaskModal, setCreateTaskModal] = useState(false);
  const [editTaskModal, setEditTaskModal] = useState(false);
  const [viewTaskModal, setViewTaskModal] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [selectedRow, setSelectedRow] = useState<IServiceFeeTask>();
  const [filteredData, setFilteredData] = useState<IServiceFeeTask[]>();
  const searchInput = useRef<InputRef>(null);
  const router = useRouter();
  const { data: sessionData } = useSession();

  const canList = sessionData?.user.role.includes("Listar Tarifas de Servicio");
  const canCreate = sessionData?.user.role.includes("Crear Tarifas de Servicio");
  const canEdit = sessionData?.user.role.includes("Editar Tarifas de Servicio");
  const canDelete = sessionData?.user.role.includes("Eliminar Tarifas de Servicio");

  // const fields = [
  //   {
  //     title: "Nomenclador",
  //     custom: true,
  //     component: (item: any) => `${item.nomenclatorId}`,
  //     width: "10",
  //   },
  //   {
  //     title: " Nombre de la tarea",
  //     custom: true,
  //     component: (item: any) => `${item.taskName}`,
  //     width: "50",
  //   },
  //   {
  //     title: " Categoría",
  //     custom: true,
  //     component: (item: any) => `${item.category}`,
  //     width: "20",
  //   },
  //   {
  //     title: " Precio",
  //     custom: true,
  //     component: (item: any) => `$ ${item.salePrice}`,
  //     width: "10",
  //   },
  //   {
  //     title: " Precio/UM",
  //     custom: true,
  //     component: (item: any) => `${item.valuePerUnitMeasure}`,
  //     width: "10",
  //   },
  // ];

  useEffect(() => {
    dispatch(startLoadServiceFeesTasks());
    dispatch(nomenclatorsStartLoading());
  }, [dispatch]);

  const { serviceFeeTasks }: { serviceFeeTasks: IServiceFeeTask[] } = useAppSelector((state: RootState) => state?.serviceFee);
  let data: IServiceFeeTask[] = useMemo(() => serviceFeeTasks, [serviceFeeTasks]);
  if (!canList) {
    data = [];
  }

  // let PDFReportData: ICostSheet[] = [];

  // if (filteredData) {
  //   PDFReportData = filteredData;
  // } else {
  //   PDFReportData = data;
  // }

  // const { nomenclators }: any = useAppSelector((state: RootState) => state?.nomenclator);

  // nomenclators.map((nomenclator: INomenclator) => {
  //   if (nomenclator.category === "Tarifa de Servicio") serviceFeeNomenclator.push(nomenclator.code);
  // });

  // const costSheetNomenclatorFilter: any[] = [];
  // serviceFeeNomenclator.map((nomenclator: string) => {
  //   costSheetNomenclatorFilter.push({
  //     text: `${nomenclator}`,
  //     value: `${nomenclator}`,
  //   });
  // });

  // const handleView = (): void => {
  //   if (selectedRow) {
  //     dispatch(loadSelectedServiceFee(selectedRow._id));
  //     router.push(`/dashboard/serviceFees/${selectedRow._id}`);
  //   } else {
  //     Toast.fire({
  //       icon: "error",
  //       title: "Seleccione una ficha de costo para ver",
  //     });
  //   }
  // };

  const handleSearch = (selectedKeys: string[], confirm: (param?: FilterConfirmProps) => void, dataIndex: DataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleDelete = () => {
    if (selectedRow) {
      Swal.fire({
        title: "Eliminar Tarifa de Servicio",
        text: "La tarea seleccionada se borrará de forma permanente",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        cancelButtonText: "Cancelar",
        confirmButtonText: "Eliminar",
      }).then((result) => {
        if (result.isConfirmed) {
          dispatch(startDeleteServiceFeeTask(selectedRow?._id));
        }
      });
    } else {
      Toast.fire({
        icon: "error",
        title: "Seleccione una tarea a eliminar",
      });
    }
  };

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setSearchText("");
  };

  const onCreate = (values: any): void => {
    dispatch(
      startAddServiceFeeTask({
        description: values.description,
        category: values.category,
        amount: values.amount,
        price: values.price,
        unitMeasure: values.unitMeasure,
        complexityLevels: values.complexityLevels,
      })
    );
    setCreateTaskModal(false);
  };

  const onEdit = (values: any): void => {
    dispatch(
      startUpdateServiceFeeTask({
        _id: selectedRow?._id,
        description: values.description,
        category: values.category,
        amount: values.amount,
        price: values.price,
        unitMeasure: values.unitMeasure,
        complexityLevels: values.complexityLevels,
      })
    );
    setEditTaskModal(false);
  };

  const handleEdit = (): void => {
    if (selectedRow) {
      setEditTaskModal(true);
    } else {
      Toast.fire({
        icon: "error",
        title: "Seleccione una tarea a editar",
      });
    }
  };

  // const onChange: TableProps<IServiceFeeTask>["onChange"] = (pagination, filters, sorter, extra) => {
  //   setFilteredData(extra.currentDataSource);
  //   console.log(filteredData);
  // };

  const rowSelection: TableRowSelection<IServiceFeeTask> = {
    onChange: async (selectedRowKeys: React.Key[], selectedRows: IServiceFeeTask[]) => {
      console.log("🚀 ~ onChange: ~ selectedRows:", selectedRows);
      setSelectedRow(selectedRows[0]);
    },
  };

  const getColumnSearchProps = (dataIndex: DataIndex): ColumnType<IServiceFeeTask> => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
            className="bg-blue-500 items-center flex"
          >
            Search
          </Button>
          <Button onClick={() => clearFilters && handleReset(clearFilters)} size="small" style={{ width: 90 }}>
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false });
              setSearchText((selectedKeys as string[])[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => <SearchOutlined style={{ color: filtered ? "#1677ff" : undefined }} />,
    onFilter: (value, record: any) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes((value as string).toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }} searchWords={[searchText]} autoEscape textToHighlight={text ? text.toString() : ""} />
      ) : (
        text
      ),
  });

  const columns: ColumnsType<IServiceFeeTask> = [
    {
      title: "Descripción",
      dataIndex: "description",
      key: "description",
      width: "45%",
    },
    {
      title: "Categoría",
      dataIndex: "category",
      key: "category",
      width: "20%",
      sorter: (a: any, b: any) => a.category.localeCompare(b.category),
      ...getColumnSearchProps("category"),
    },
    {
      title: "Cantidad",
      dataIndex: "amount",
      key: "amount",
      width: "10%",
      filterSearch: true,
    },
    {
      title: "Unidad de Medida",
      dataIndex: "unitMeasure",
      key: "unitMeasure",
      width: "20%",
      filterSearch: true,
    },

    {
      title: "Precio",
      dataIndex: "price",
      key: "price",
      width: "15%",
      render: (text) => <span>$ {parseFloat(text).toFixed(2)}</span>,
      sorter: {
        compare: (a, b) => a.price - b.price,
      },
    },
  ];

  return (
    <>
      <div className="flex h-16 w-full bg-white-100 rounded-md shadow-md mb-4 items-center pl-4 gap-4">
        <div className="flex gap-2">
          <button
            disabled={!canCreate}
            onClick={() => setCreateTaskModal(true)}
            className="toolbar-primary-icon-btn"
          >
            <PlusSvg />
            Nuevo
          </button>
          <button
              disabled={!canList}
              onClick={()=>{setViewTaskModal(true)}}
              className="toolbar-secondary-icon-btn"
            >
              <SeeSvg />
              Ver
            </button>
        </div>
        <div className="flex">
          {/* <PDFDownloadLink document={<CostSheetTablePDFReport fields={fields} data={PDFReportData} title={`Fichas de costo`} />} fileName={`Listado de fichas de costo `}>
            {({ blob, url, loading, error }) => (
              <button disabled={loading} className="cursor-pointer hover:bg-white-600 ease-in-out duration-300 rounded-full w-[2.5rem] h-[2.5rem] flex justify-center items-center">
                <PDFSvg />
              </button>
            )}
          </PDFDownloadLink> */}
          <Tooltip placement="top" title={"Editar"} arrow={{ pointAtCenter: true }}>
            <button
              disabled={!canEdit}
              className={`${
                canEdit ? "cursor-pointer hover:bg-white-600 ease-in-out duration-300" : "opacity-20 pt-2 pl-2"
              } flex justify-center items-center w-[2.5rem] h-[2.5rem] text-xl rounded-full`}
              onClick={handleEdit}
            >
              <EditSvg />
            </button>
          </Tooltip>
          <Tooltip placement="top" title={"Eliminar"} arrow={{ pointAtCenter: true }}>
            <button
              disabled={!canDelete}
              className={`${
                canDelete ? "cursor-pointer hover:bg-white-600 ease-in-out duration-300" : "opacity-20 pt-2 pl-2"
              } flex justify-center items-center w-[2.5rem] h-[2.5rem] text-xl rounded-full`}
              onClick={handleDelete}
            >
              <DeleteSvg />
            </button>
          </Tooltip>
          <Tooltip placement="top" title={"Refrescar"} arrow={{ pointAtCenter: true }}>
            <button
              disabled={!canList}
              className={`${
                canList ? "cursor-pointer hover:bg-white-600 ease-in-out duration-300" : "opacity-20 pt-2 pl-2"
              } flex justify-center items-center w-[2.5rem] h-[2.5rem] text-xl rounded-full`}
              onClick={() => dispatch(startLoadServiceFeesTasks())}
            >
              <RefreshSvg />
            </button>
          </Tooltip>
        </div>
      </div>

      <CreateServiceFeeTaskForm open={createTaskModal} onCancel={() => setCreateTaskModal(false)} onCreate={onCreate} />
      <EditServiceFeeTaskForm open={editTaskModal} onCancel={() => setEditTaskModal(false)} onCreate={onEdit} defaultValues={selectedRow!} />
      <ServiceFeeTaskView open={viewTaskModal} onCancel={() => setViewTaskModal(false)} defaultValues={selectedRow!} />

      <Table
        size="small"
        columns={columns}
        dataSource={data}
        // onChange={onChange}
        pagination={{ position: ["bottomCenter"], pageSize: 15 }}
        rowSelection={{
          type: "radio",
          ...rowSelection,
        }}
        className="shadow-md"
      />
    </>
  );
};

export default ServiceFeeTaskTable;

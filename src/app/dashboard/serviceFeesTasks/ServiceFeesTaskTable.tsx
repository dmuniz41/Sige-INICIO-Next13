"use client";
import { Button, Input, Space, Table, Tooltip } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import React, { useEffect, useMemo, useRef, useState } from "react";
import Swal from "sweetalert2";
import type { ColumnType, ColumnsType } from "antd/es/table";
import type { FilterConfirmProps } from "antd/es/table/interface";
import type { InputRef } from "antd";

import { CreateServiceFeeTaskForm } from "./CreateServiceFeeTask";
import { DeleteSvg } from "@/app/global/DeleteSvg";
import { EditServiceFeeTaskForm } from "./EditServiceFeeTask";
import { EditSvg } from "@/app/global/EditSvg";
import { INomenclator } from "@/models/nomenclator";
import { IServiceFeeTask } from "@/models/serviceFeeTask";
import { nomenclatorsStartLoading } from "@/actions/nomenclator";
import { PlusSvg } from "@/app/global/PlusSvg";
import { RefreshSvg } from "@/app/global/RefreshSvg";
import { RootState, useAppSelector } from "@/store/store";
import {
  startAddServiceFeeTask,
  startDeleteServiceFeeTask,
  startLoadServiceFeesTasks,
  startUpdateServiceFeeTask
} from "@/actions/serviceFeeTask";
import { Toast } from "@/helpers/customAlert";
import { useAppDispatch } from "@/hooks/hooks";
import { useSession } from "next-auth/react";

type DataIndex = keyof IServiceFeeTask;

const ServiceFeeTaskTable: React.FC = () => {
  const [createTaskModal, setCreateTaskModal] = useState(false);
  const [editTaskModal, setEditTaskModal] = useState(false);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [selectedRow, setSelectedRow] = useState<IServiceFeeTask>();
  const { data: sessionData } = useSession();
  const dispatch = useAppDispatch();
  const searchInput = useRef<InputRef>(null);

  const canList = sessionData?.user.role.includes("Listar Tarifas de Servicio");
  const canCreate = sessionData?.user.role.includes("Crear Tarifas de Servicio");
  const canEdit = sessionData?.user.role.includes("Editar Tarifas de Servicio");
  const canDelete = sessionData?.user.role.includes("Eliminar Tarifas de Servicio");

  useEffect(() => {
    dispatch(startLoadServiceFeesTasks());
    dispatch(nomenclatorsStartLoading());
  }, [dispatch]);

  const { serviceFeeTasks }: { serviceFeeTasks: IServiceFeeTask[] } = useAppSelector(
    (state: RootState) => state?.serviceFee
  );
  const { nomenclators }: any = useAppSelector((state: RootState) => state?.nomenclator);

  let data: IServiceFeeTask[] = useMemo(() => serviceFeeTasks, [serviceFeeTasks]);
  if (!canList) {
    data = [];
  }

  const taskCategoryFilter: any[] = [];
  nomenclators.map((nomenclator: INomenclator) => {
    if (nomenclator.category === "Categoría de tareas") {
      taskCategoryFilter.push({
        text: `${nomenclator.code}`,
        value: `${nomenclator.code}`
      });
    }
  });

  const unitMeasureFilter: any[] = [];
  nomenclators.map((nomenclator: INomenclator) => {
    if (nomenclator.category === "Unidad de medida") {
      unitMeasureFilter.push({
        text: `${nomenclator.code}`,
        value: `${nomenclator.code}`
      });
    }
  });

  const handleSearch = (
    selectedKeys: string[],
    confirm: (param?: FilterConfirmProps) => void,
    dataIndex: DataIndex
  ) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleDelete = (record: IServiceFeeTask) => {
    Swal.fire({
      title: "Eliminar Tarea ",
      text: "La tarea seleccionada se borrará de forma permanente",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      cancelButtonText: "Cancelar",
      confirmButtonText: "Eliminar"
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(startDeleteServiceFeeTask(record._id));
      }
    });
  };

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setSearchText("");
  };

  const onCreate = (values: any): void => {
    console.log("🚀 ~ onCreate ~ values:", values);
    dispatch(
      startAddServiceFeeTask({
        description: values.description,
        category: values.category,
        amount: values.amount,
        // price: values.price,
        unitMeasure: values.unitMeasure,
        complexity: values.complexity
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
        complexity: values.complexity
      })
    );
    setEditTaskModal(false);
  };

  const handleEdit = (record: IServiceFeeTask): void => {
    if (record) {
      setSelectedRow(record);
      setEditTaskModal(true);
    } else {
      Toast.fire({
        icon: "error",
        title: "Seleccione una tarea a editar"
      });
    }
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
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
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
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? "#1677ff" : undefined }} />
    ),
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
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      )
  });

  const columns: ColumnsType<IServiceFeeTask> = [
    {
      title: <span className="font-semibold">Descripción</span>,
      dataIndex: "description",
      key: "description",
      width: "50%",
      sorter: (a: any, b: any) => a.description.localeCompare(b.description),
      ...getColumnSearchProps("description")
    },
    {
      title: <span className="font-semibold">Categoría</span>,
      dataIndex: "category",
      key: "category",
      width: "13%",
      filters: taskCategoryFilter,
      onFilter: (value: any, record: any) => record.category.startsWith(value),
      filterSearch: true
    },
    {
      title: <span className="font-semibold">Cantidad</span>,
      dataIndex: "amount",
      key: "amount",
      width: "8%",
      filterSearch: true,
      render: (value) => (
        <span>
          {value.toLocaleString("DE", {
            maximumFractionDigits: 2,
            minimumFractionDigits: 2
          })}
        </span>
      )
    },
    {
      title: <span className="font-semibold">Unidad de Medida</span>,
      dataIndex: "unitMeasure",
      key: "unitMeasure",
      width: "15%",
      filters: unitMeasureFilter,
      onFilter: (value: any, record: any) => record.unitMeasure.startsWith(value),
      filterSearch: true
    },
    // {
    //   title: <span className="font-semibold">Precio</span>,
    //   dataIndex: "price",
    //   key: "price",
    //   width: "10%",
    //   render: (value) => (
    //     <span>
    //       ${" "}
    //       {value.toLocaleString("DE", {
    //         maximumFractionDigits: 2,
    //         minimumFractionDigits: 2
    //       })}
    //     </span>
    //   ),
    //   sorter: {
    //     compare: (a, b) => a.price - b.price
    //   }
    // },
    {
      title: <span className="font-semibold">Acciones</span>,
      key: "actions",
      width: "5%",
      render: (_, record) => (
        <div className="flex gap-1">
          <Tooltip placement="top" title={"Editar"} arrow={{ pointAtCenter: true }}>
            <button
              disabled={!canEdit}
              className={`${
                canDelete
                  ? "cursor-pointer hover:bg-secondary-400-400 ease-in-out duration-300"
                  : "opacity-20 pt-2 pl-2"
              } flex justify-center items-center p-2 text-xl rounded-md bg-secondary-600 text-white-100`}
              onClick={() => handleEdit(record)}
            >
              <EditSvg width={20} height={20} />
            </button>
          </Tooltip>
          <Tooltip placement="top" title={"Eliminar"} arrow={{ pointAtCenter: true }}>
            <button
              disabled={!canDelete}
              className={`${
                canDelete
                  ? "cursor-pointer hover:bg-danger-400 ease-in-out duration-300"
                  : "opacity-20 pt-2 pl-2"
              } flex justify-center items-center p-2 text-xl rounded-md bg-danger-600 text-white-100`}
              onClick={() => handleDelete(record)}
            >
              <DeleteSvg width={20} height={20} />
            </button>
          </Tooltip>
        </div>
      )
    }
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
        </div>
        <div className="flex">
          <Tooltip placement="top" title={"Refrescar"} arrow={{ pointAtCenter: true }}>
            <button
              disabled={!canList}
              className={`${
                canList
                  ? "cursor-pointer hover:bg-white-600 ease-in-out duration-300"
                  : "opacity-20 pt-2 pl-2"
              } flex justify-center items-center w-[2.5rem] h-[2.5rem] text-xl rounded-full`}
              onClick={() => dispatch(startLoadServiceFeesTasks())}
            >
              <RefreshSvg />
            </button>
          </Tooltip>
        </div>
      </div>

      <CreateServiceFeeTaskForm
        open={createTaskModal}
        onCancel={() => setCreateTaskModal(false)}
        onCreate={onCreate}
      />
      <EditServiceFeeTaskForm
        open={editTaskModal}
        onCancel={() => setEditTaskModal(false)}
        onCreate={onEdit}
        defaultValues={selectedRow!}
      />

      <Table
        size="small"
        columns={columns}
        dataSource={data}
        pagination={{ position: ["bottomCenter"], defaultPageSize: 20 }}
        className="shadow-md"
      />
    </>
  );
};

export default ServiceFeeTaskTable;

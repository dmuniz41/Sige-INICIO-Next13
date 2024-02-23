"use client";
import { Button, Input, Space, Table, Tag, Tooltip } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import Highlighter from "react-highlight-words";
import React, { Suspense, useEffect, useMemo, useRef, useState } from "react";
import Swal from "sweetalert2";
import type { ColumnType, ColumnsType, TableProps } from "antd/es/table";
import type { FilterConfirmProps, TableRowSelection } from "antd/es/table/interface";
import type { InputRef } from "antd";

import { DeleteSvg } from "@/app/global/DeleteSvg";
import { IProject } from "@/models/project";
import { loadSelectedProject } from "../../../actions/project";
import { nomenclatorsStartLoading } from "@/actions/nomenclator";
import { PDFSvg } from "@/app/global/PDFSvg";
import { PlusSvg } from "@/app/global/PlusSvg";
import { projectsStartLoading, startDeleteProject } from "@/actions/project";
import { RefreshSvg } from "@/app/global/RefreshSvg";
import { RootState, useAppSelector } from "@/store/store";
import { Toast } from "@/helpers/customAlert";
import { useAppDispatch } from "@/hooks/hooks";
import { SeeSvg } from "@/app/global/SeeSvg";

// const PDFDownloadLink = dynamic(() => import("@react-pdf/renderer").then((mod) => mod.PDFDownloadLink), {
//   ssr: false,
//   loading: () => <p>Loading...</p>,
// });

type DataIndex = keyof IProject;

const ProjectTable: React.FC = () => {
  const dispatch = useAppDispatch();
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [selectedRow, setSelectedRow] = useState<IProject>();
  const [filteredData, setFilteredData] = useState<IProject[]>();
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
    dispatch(projectsStartLoading());
    dispatch(nomenclatorsStartLoading());
  }, [dispatch]);

  const { projects }: any = useAppSelector((state: RootState) => state?.project);
  let data: IProject[] = useMemo(() => projects, [projects]);
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

  const handleView = (id: string): void => {
    if (id) {
      dispatch(loadSelectedProject(id));
      router.push(`/dashboard/project/${id}`);
    } else {
      Toast.fire({
        icon: "error",
        title: "Seleccione un proyecto para ver",
      });
    }
  };

  const handleRowClick = async (record: any) => {
    console.log("🚀 ~ handleRowClick ~ record:", record._id);
    await dispatch(loadSelectedProject(record?._id!));
    router.push(`/dashboard/project/${record?._id}`);
  };

  const handleSearch = (selectedKeys: string[], confirm: (param?: FilterConfirmProps) => void, dataIndex: DataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleDelete = (id: string) => {
    if (id) {
      Swal.fire({
        title: "Eliminar Proyecto",
        text: "El proyecto seleccionado se borrará de forma permanente",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        cancelButtonText: "Cancelar",
        confirmButtonText: "Eliminar",
      }).then((result) => {
        if (result.isConfirmed) {
          // const nomenclatorToDelete = nomenclators.find((nomenclator: INomenclator) => nomenclator?.code === selectedRow?.nomenclatorId);
          dispatch(startDeleteProject(id));
          // dispatch(startDeleteNomenclator(nomenclatorToDelete?._id));
        }
      });
    } else {
      Toast.fire({
        icon: "error",
        title: "Seleccione un proyecto a eliminar",
      });
    }
  };

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setSearchText("");
  };

  const onChange: TableProps<IProject>["onChange"] = (pagination, filters, sorter, extra) => {
    setFilteredData(extra.currentDataSource);
    console.log(filteredData);
  };

  const rowSelection: TableRowSelection<IProject> = {
    onChange: async (selectedRowKeys: React.Key[], selectedRows: IProject[]) => {
      setSelectedRow(selectedRows[0]);
      dispatch(loadSelectedProject(selectedRows[0]._id));
      console.log(`selectedRowKeys: ${selectedRowKeys}`, "selectedRow: ", selectedRows);
    },
  };

  const getColumnSearchProps = (dataIndex: DataIndex): ColumnType<IProject> => ({
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
    onFilter: (value, record) =>
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

  let color = "green";

  const columns: ColumnsType<IProject> = [
    {
      title: "Nombre del Proyecto",
      dataIndex: "projectName",
      key: "projectName",
      width: "30%",
      sorter: (a: any, b: any) => a.projectName.localeCompare(b.projectName),
      ...getColumnSearchProps("projectName"),
    },
    {
      title: "Cliente",
      dataIndex: "clientName",
      key: "clientName",
      width: "15%",
      // filters: costSheetNomenclatorFilter,
      // onFilter: (value: any, record: any) => record.nomenclatorId.startsWith(value),
      // filterSearch: true,
      sorter: (a: any, b: any) => a.clientName.localeCompare(b.clientName),
    },
    {
      title: "Precio",
      dataIndex: "totalValue",
      key: "totalValue",
      width: "10%",
      render: (text) => <span>$ {parseFloat(text).toFixed(2)}</span>,
      sorter: {
        compare: (a, b) => a.totalValue - b.totalValue,
      },
    },
    {
      title: "Moneda",
      dataIndex: "currency",
      key: "currency",
      width: "5%",
    },
    {
      title: "Estado",
      dataIndex: "status",
      key: "status",
      width: "5%",
      render: (_, { status }) => (
        <>
          {status === "Terminado" && (
            <Tag className="font-bold" color="#34b042" key={status}>
              {status.toUpperCase()}
            </Tag>
          )}
          {status === "Cobrado" && (
            <Tag className="font-bold" color="#34395e" key={status}>
              {status.toUpperCase()}
            </Tag>
          )}
          {status === "Cerrado" && (
            <Tag className="font-bold" color="#ff6600" key={status}>
              {status.toUpperCase()}
            </Tag>
          )}
          {status === "Solicitud" && (
            <Tag className="font-bold" color="#1677ff" key={status}>
              {status.toUpperCase()}
            </Tag>
          )}
        </>
      ),
    },
    {
      title: "Gastos",
      dataIndex: "expenses",
      key: "expenses",
      width: "5%",
      render: (text) => <span>$ {parseFloat(text).toFixed(2)}</span>,
      sorter: {
        compare: (a, b) => a.expenses - b.expenses,
      },
    },
    {
      title: "Ganancia",
      dataIndex: "profits",
      key: "profits",
      width: "5%",
      render: (text) => <span>$ {parseFloat(text).toFixed(2)}</span>,
      sorter: {
        compare: (a, b) => a.profits - b.profits,
      },
    },
    {
      title: "Fecha de creación",
      dataIndex: "initDate",
      key: "initDate",
      width: "10%",
    },
    {
      title: "Acciones",
      key: "actions",
      width: "5%",
      render: (_, { _id }) => (
        <div className="flex gap-1">
          <Tooltip placement="top" title={"Ver"} arrow={{ pointAtCenter: true }}>
            <button
              disabled={!canList}
              onClick={() => handleView(_id)}
              className={`${
                canList ? "cursor-pointer hover:bg-secondary-400 ease-in-out duration-300" : "opacity-20 pt-2 pl-2"
              } flex justify-center items-center w-[2rem] h-[2rem] text-xl rounded-md bg-secondary-500 text-white-100`}
            >
              <SeeSvg width={20} height={20} />
            </button>
          </Tooltip>
          <Tooltip placement="top" title={"Eliminar"} arrow={{ pointAtCenter: true }}>
            <button
              disabled={!canDelete}
              className={`${
                canDelete ? "cursor-pointer hover:bg-danger-400 ease-in-out duration-300" : "opacity-20 pt-2 pl-2"
              } flex justify-center items-center w-[2rem] h-[2rem] text-xl rounded-md bg-danger-600 text-white-100`}
              onClick={() => handleDelete(_id)}
            >
              <DeleteSvg width={20} height={20} />
            </button>
          </Tooltip>
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="flex h-16 w-full bg-white-100 rounded-md shadow-md mb-4 items-center pl-4 gap-4">
        <div className="flex gap-2">
          <button disabled={!canCreate} onClick={() => router.push("/dashboard/project/createProject")} className={`${canCreate ? "toolbar-primary-icon-btn" : "bg-success-200"} `}>
            <PlusSvg />
            Nuevo
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
          {/* <Tooltip placement="top" title={"Eliminar"} arrow={{ pointAtCenter: true }}>
            <button
              disabled={!canDelete}
              className={`${
                canDelete ? "cursor-pointer hover:bg-white-600 ease-in-out duration-300" : "opacity-20 pt-2 pl-2"
              } flex justify-center items-center w-[2.5rem] h-[2.5rem] text-xl rounded-full`}
              onClick={handleDelete}
            >
              <DeleteSvg />
            </button>
          </Tooltip> */}
          <Tooltip placement="top" title={"Refrescar"} arrow={{ pointAtCenter: true }}>
            <button
              disabled={!canList}
              className={`${
                canList ? "cursor-pointer hover:bg-white-600 ease-in-out duration-300" : "opacity-20 pt-2 pl-2"
              } flex justify-center items-center w-[2.5rem] h-[2.5rem] text-xl rounded-full`}
              onClick={() => dispatch(projectsStartLoading())}
            >
              <RefreshSvg />
            </button>
          </Tooltip>
        </div>
      </div>
      <Table
        size="small"
        columns={columns}
        dataSource={data}
        onChange={onChange}
        pagination={{ position: ["bottomCenter"], defaultPageSize: 20 }}
        // onRow={(record) => ({
        //   onClick: () => handleRowClick(record),
        // })}
        className="shadow-md"
      />
    </>
  );
};

export default ProjectTable;

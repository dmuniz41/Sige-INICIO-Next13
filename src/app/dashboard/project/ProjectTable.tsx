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
import type { FilterConfirmProps } from "antd/es/table/interface";
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
import { IServiceFeeAuxiliary } from "@/models/serviceFeeAuxiliary";
import { INomenclator } from "@/models/nomenclator";

// const PDFDownloadLink = dynamic(() => import("@react-pdf/renderer").then((mod) => mod.PDFDownloadLink), {
//   ssr: false,
//   loading: () => <p>Loading...</p>,
// });

type DataIndex = keyof IProject;

const ProjectTable: React.FC = () => {
  const dispatch = useAppDispatch();
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [filteredData, setFilteredData] = useState<IProject[]>();
  const searchInput = useRef<InputRef>(null);
  const router = useRouter();
  const { data: sessionData } = useSession();
  const payMethodNomenclator: string[] | undefined = [];
  const clientNamesNomenclators: string[] | undefined = [];
  const currencyNomenclators: string[] | undefined = [];

  const canList = sessionData?.user.role.includes("Listar Proyectos");
  const canCreate = sessionData?.user.role.includes("Crear Proyectos");
  const canEdit = sessionData?.user.role.includes("Editar Proyectos");
  const canDelete = sessionData?.user.role.includes("Eliminar Proyectos");

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

  const { serviceFeeAuxiliary }: { serviceFeeAuxiliary: IServiceFeeAuxiliary } = useAppSelector((state: RootState) => state?.serviceFee);
  const { nomenclators }: { nomenclators: INomenclator[] } = useAppSelector((state: RootState) => state?.nomenclator);
  const { projects }: any = useAppSelector((state: RootState) => state?.project);

  let data: IProject[] = useMemo(() => projects, [projects]);
  if (!canList) {
    data = [];
  }

  serviceFeeAuxiliary?.payMethod?.map((payMethod) => payMethodNomenclator.push(payMethod.representative));
  nomenclators.map((nomenclator: INomenclator) => {
    if (nomenclator.category === "Nombre de Cliente") clientNamesNomenclators.push(nomenclator.code);
    if (nomenclator.category === "Moneda") currencyNomenclators.push(nomenclator.code);
  });

  const payMethodFilter: any[] = [];
  payMethodNomenclator.map((payMethod: string) => {
    payMethodFilter.push({
      text: `${payMethod}`,
      value: `${payMethod}`,
    });
  });
  const clientNameFilter: any[] = [];
  clientNamesNomenclators.map((clientName: string) => {
    clientNameFilter.push({
      text: `${clientName}`,
      value: `${clientName}`,
    });
  });
  const currencyFilter: any[] = [];
  currencyNomenclators.map((currency: string) => {
    currencyFilter.push({
      text: `${currency}`,
      value: `${currency}`,
    });
  });
  const statusFilter: any[] = [
    {
      text: "Terminado",
      value: "Terminado",
    },
    {
      text: "Cerrado",
      value: "Cerrado",
    },
    {
      text: "Solicitud",
      value: "Solicitud",
    },
    {
      text: "Cobrado",
      value: "Cobrado",
    },
  ];

  // let PDFReportData: ICostSheet[] = [];

  // if (filteredData) {
  //   PDFReportData = filteredData;
  // } else {
  //   PDFReportData = data;
  // }

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
          dispatch(startDeleteProject(id));
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
      filters: clientNameFilter,
      onFilter: (value: any, record: any) => record.clientName.startsWith(value),
      filterSearch: true,
    },
    {
      title: "Cobrado por",
      dataIndex: "payMethod",
      key: "payMethod",
      width: "10%",
      filters: payMethodFilter,
      onFilter: (value: any, record: any) => record.payMethod.startsWith(value),
      filterSearch: true,
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
      filters: currencyFilter,
      onFilter: (value: any, record: any) => record.currency.startsWith(value),
      filterSearch: true,
    },
    {
      title: "Estado",
      dataIndex: "status",
      key: "status",
      width: "5%",
      filters: statusFilter,
      onFilter: (value: any, record: any) => record.status.startsWith(value),
      filterSearch: true,
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
      title: "Fecha",
      dataIndex: "initDate",
      key: "initDate",
      width: "10%",
      sorter: (a: any, b: any) => a.initDate.localeCompare(b.initDate),
      ...getColumnSearchProps("initDate"),
    },
    {
      title: "Acciones",
      key: "actions",
      width: "5%",
      render: (_, { _id }) => (
        <div className="flex gap-1">
          {!canList ? (
            <></>
          ) : (
            <Tooltip placement="top" title={"Ver"} arrow={{ pointAtCenter: true }}>
              <button disabled={!canList} onClick={() => handleView(_id)} className="table-see-action-btn">
                <SeeSvg width={20} height={20} />
              </button>
            </Tooltip>
          )}
          {!canDelete ? (
            <></>
          ) : (
            <Tooltip placement="top" title={"Eliminar"} arrow={{ pointAtCenter: true }}>
              <button disabled={!canDelete} onClick={() => handleDelete(_id)} className="table-delete-action-btn">
                <DeleteSvg width={20} height={20} />
              </button>
            </Tooltip>
          )}
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
      <Table size="small" columns={columns} dataSource={data} onChange={onChange} pagination={{ position: ["bottomCenter"], defaultPageSize: 20 }} className="shadow-md" />
    </>
  );
};

export default ProjectTable;

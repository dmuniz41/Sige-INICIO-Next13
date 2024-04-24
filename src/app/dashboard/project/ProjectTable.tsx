"use client";
import { Button, Input, Space, Table, Tag, Tooltip } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import Highlighter from "react-highlight-words";
import React, { useEffect, useMemo, useRef, useState } from "react";
import Swal from "sweetalert2";
import type { ColumnType, ColumnsType, TableProps } from "antd/es/table";
import type { FilterConfirmProps } from "antd/es/table/interface";
import type { InputRef } from "antd";

import { DeleteSvg } from "@/app/global/DeleteSvg";
import { INomenclator } from "@/models/nomenclator";
import { IProject } from "@/models/project";
import { nomenclatorsStartLoading } from "@/actions/nomenclator";
import { PlusSvg } from "@/app/global/PlusSvg";
import { projectsStartLoading, startDeleteProject, startLoadSelectedProject } from "@/actions/project";
import { RefreshSvg } from "@/app/global/RefreshSvg";
import { ReportMoneySvg } from "@/app/global/ReportMoneySvg";
import { RootState, useAppSelector } from "@/store/store";
import { SeeSvg } from "@/app/global/SeeSvg";
import { Toast } from "@/helpers/customAlert";
import { useAppDispatch } from "@/hooks/hooks";
import { representativeNomenclatorsStartLoading } from "@/actions/nomenclators/representative";
import { clientNomenclatorsStartLoading } from "@/actions/nomenclators/client";
import { IRepresentativeNomenclator } from "@/models/nomenclators/representative";
import { IClientNomenclator } from "@/models/nomenclators/client";
import moment from "moment";
import PDFReport from "@/helpers/PDFReport";
import { PDFSvg } from "@/app/global/PDFSvg";

const PDFDownloadLink = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFDownloadLink),
  {
    ssr: false,
    loading: () => <p>Loading...</p>
  }
);

type DataIndex = keyof IProject;

let date = moment();
let currentDate = date.format("L");

const ProjectTable: React.FC = () => {
  const [filteredData, setFilteredData] = useState<IProject[]>();
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const { data: sessionData } = useSession();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const searchInput = useRef<InputRef>(null);

  const canList = sessionData?.user.role.includes("Listar Proyectos");
  const canCreate = sessionData?.user.role.includes("Crear Proyectos");
  const canEdit = sessionData?.user.role.includes("Editar Proyectos");
  const canDelete = sessionData?.user.role.includes("Eliminar Proyectos");

  useEffect(() => {
    // dispatch(nomenclatorsStartLoading());
    // dispatch(representativeNomenclatorsStartLoading());
    // dispatch(clientNomenclatorsStartLoading());
    dispatch(projectsStartLoading());
  }, [dispatch]);

  const fields = [
    {
      title: "Nombre de Proyecto",
      custom: true,
      component: (item: any) => `${item.projectName}`,
      width: "33"
    },
    {
      title: "Cliente",
      custom: true,
      component: (item: any) => `${item.clientName}`,
      width: "11"
    },
    {
      title: "Cobrado por",
      custom: true,
      component: (item: any) => `${item.payMethod}`,
      width: "10"
    },
    {
      title: "Moneda",
      custom: true,
      component: (item: any) => `${item.currency}`,
      width: "6"
    },
    {
      title: "Precio",
      custom: true,
      component: (item: any) =>
        `$ ${item.totalValue?.toLocaleString("DE", {
          maximumFractionDigits: 2,
          minimumFractionDigits: 2
        })}`,
      width: "12"
    },
    {
      title: "Gastos",
      custom: true,
      component: (item: any) =>
        `$ ${item.expenses?.toLocaleString("DE", {
          maximumFractionDigits: 2,
          minimumFractionDigits: 2
        })}`,
      width: "10"
    },
    {
      title: "Ganancia",
      custom: true,
      component: (item: any) =>
        `$ ${item.profits?.toLocaleString("DE", {
          maximumFractionDigits: 2,
          minimumFractionDigits: 2
        })}`,
      width: "10"
    },
    {
      title: "Fecha",
      custom: true,
      component: (item: any) => `${item.initDate}`,
      width: "8"
    }
  ];

  const {
    nomenclators,
    representativeNomenclators,
    clientNomenclators
  }: {
    nomenclators: INomenclator[];
    representativeNomenclators: IRepresentativeNomenclator[];
    clientNomenclators: IClientNomenclator[];
  } = useAppSelector((state: RootState) => state?.nomenclator);

  const { projects }: any = useAppSelector((state: RootState) => state?.project);

  let data: IProject[] = useMemo(() => projects, [projects]);
  if (!canList) {
    data = [];
  }

  const currencyFilter: any[] = [];
  nomenclators.map((nomenclator: INomenclator) => {
    if (nomenclator.category === "Moneda") {
      currencyFilter.push({
        text: `${nomenclator.code}`,
        value: `${nomenclator.code}`
      });
    }
  });

  const representativeFilter: any[] = [];
  representativeNomenclators.map((representative: IRepresentativeNomenclator) => {
    representativeFilter.push({
      text: `${representative.name}`,
      value: `${representative.name}`
    });
  });

  const clientFilter: any[] = [];
  clientNomenclators.map((client: IClientNomenclator) => {
    clientFilter.push({
      text: `${client.name}`,
      value: `${client.name}`
    });
  });

  const statusFilter: any[] = [
    {
      text: "Terminado",
      value: "Terminado"
    },
    {
      text: "Cerrado",
      value: "Cerrado"
    },
    {
      text: "Solicitud",
      value: "Solicitud"
    },
    {
      text: "Cobrado",
      value: "Cobrado"
    }
  ];

  let PDFReportData: IProject[] = [];

  if (filteredData) {
    PDFReportData = filteredData;
  } else {
    PDFReportData = data;
  }

  const handleView = (id: string): void => {
    dispatch(startLoadSelectedProject(id))
    router.push(`/dashboard/project/${id}`);
  };

  const handleViewOffer = (projectId: string): void => {
      dispatch(startLoadSelectedProject(projectId));
      router.push(`/dashboard/project/${projectId}/offer`);
  };

  const handleSearch = (
    selectedKeys: string[],
    confirm: (param?: FilterConfirmProps) => void,
    dataIndex: DataIndex
  ) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleDelete = (id: string) => {
    Swal.fire({
      title: "Eliminar Proyecto",
      text: "El proyecto seleccionado se borrará de forma permanente",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      cancelButtonText: "Cancelar",
      confirmButtonText: "Eliminar"
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(startDeleteProject(id));
      }
    });
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
    onFilter: (value, record) =>
      record[dataIndex]!.toString()
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

  const columns: ColumnsType<IProject> = [
    {
      title: <span className="font-bold">Nombre del Proyecto</span>,
      dataIndex: "projectName",
      key: "projectName",
      width: "30%",
      sorter: (a: any, b: any) => a.projectName.localeCompare(b.projectName),
      ...getColumnSearchProps("projectName")
    },
    {
      title: <span className="font-bold">Cliente</span>,
      dataIndex: "clientName",
      key: "clientName",
      width: "10%",
      filters: clientFilter,
      onFilter: (value: any, record: any) => record.clientName.startsWith(value),
      filterSearch: true
    },
    {
      title: <span className="font-bold">Cobrado por</span>,
      dataIndex: "payMethod",
      key: "payMethod",
      width: "8%",
      filters: representativeFilter,
      onFilter: (value: any, record: any) => record.payMethod.startsWith(value),
      filterSearch: true
    },
    {
      title: <span className="font-bold">Moneda</span>,
      dataIndex: "currency",
      key: "currency",
      width: "5%",
      filters: currencyFilter,
      onFilter: (value: any, record: any) => record.currency.startsWith(value),
      filterSearch: true
    },
    {
      title: <span className="font-bold">Estado</span>,
      dataIndex: "status",
      key: "status",
      width: "5%",
      filters: statusFilter,
      onFilter: (value: any, record: any) => record.status.startsWith(value),
      filterSearch: true,
      render: (_, { status }) => (
        <>
          {status === "Cerrado" && (
            <Tag className="font-bold" color="#34b042" key={status}>
              {status.toUpperCase()}
            </Tag>
          )}
          {status === "Cobrado" && (
            <Tag className="font-bold" color="#34b042" key={status}>
              {status.toUpperCase()}
            </Tag>
          )}
          {status === "Terminado" && (
            <Tag className="font-bold" color="#34395e" key={status}>
              {status.toUpperCase()}
            </Tag>
          )}
          {status === "Contratado" && (
            <Tag className="font-bold" color="#ff6600" key={status}>
              {status.toUpperCase()}
            </Tag>
          )}
          {status === "Calculado" && (
            <Tag className="font-bold" color="#ff6600" key={status}>
              {status.toUpperCase()}
            </Tag>
          )}
          {status === "Pendiente de Oferta" && (
            <Tag className="font-bold" color="#ffa426" key={status}>
              {status.toUpperCase()}
            </Tag>
          )}
        </>
      )
    },
    {
      title: <span className="font-bold">Precio</span>,
      dataIndex: "totalValue",
      key: "totalValue",
      width: "10%",
      render: (value) => (
        <span>
          $ {value?.toLocaleString("DE", { maximumFractionDigits: 2, minimumFractionDigits: 2 })}
        </span>
      ),
      sorter: {
        compare: (a, b) => a.totalValue - b.totalValue
      }
    },
    {
      title: <span className="font-bold">Gastos</span>,
      dataIndex: "expenses",
      key: "expenses",
      width: "10%",
      render: (value) => (
        <span>
          $ {value?.toLocaleString("DE", { maximumFractionDigits: 2, minimumFractionDigits: 2 })}
        </span>
      ),
      sorter: {
        compare: (a, b) => a.expenses - b.expenses
      }
    },
    {
      title: <span className="font-bold">Ganancia</span>,
      dataIndex: "profits",
      key: "profits",
      width: "10%",
      render: (value) => (
        <span>
          $ {value?.toLocaleString("DE", { maximumFractionDigits: 2, minimumFractionDigits: 2 })}
        </span>
      ),
      sorter: {
        compare: (a, b) => a.profits - b.profits
      }
    },
    {
      title: <span className="font-bold">Fecha</span>,
      dataIndex: "initDate",
      key: "initDate",
      width: "5%",
      sorter: (a: any, b: any) => a.initDate.localeCompare(b.initDate),
      ...getColumnSearchProps("initDate")
    },
    {
      title: <span className="font-bold">Acciones</span>,
      key: "actions",
      width: "5%",
      render: (_, { ...record }) => (
        <div className="flex gap-1">
          {record.status === "Pendiente de Oferta" ? (
            <></>
          ) : (
            <Tooltip placement="top" title={"Ver Ofertas"} arrow={{ pointAtCenter: true }}>
              <button
                disabled={!canList}
                onClick={() => handleViewOffer(record._id)}
                className="table-see-offer-action-btn"
              >
                <ReportMoneySvg width={20} height={20} />
              </button>
            </Tooltip>
          )}
          {!canList ? (
            <></>
          ) : (
            <Tooltip placement="top" title={"Detalles"} arrow={{ pointAtCenter: true }}>
              <button
                disabled={!canList}
                onClick={() => handleView(record?._id)}
                className="table-see-action-btn"
              >
                <SeeSvg width={20} height={20} />
              </button>
            </Tooltip>
          )}
          {!canDelete ? (
            <></>
          ) : (
            <Tooltip placement="top" title={"Eliminar"} arrow={{ pointAtCenter: true }}>
              <button
                disabled={!canDelete}
                onClick={() => handleDelete(record._id)}
                className="table-delete-action-btn"
              >
                <DeleteSvg width={20} height={20} />
              </button>
            </Tooltip>
          )}
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
            onClick={() => router.push("/dashboard/project/createProject")}
            className={`${canCreate ? "toolbar-primary-icon-btn" : "bg-success-200"} `}
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
              onClick={() => dispatch(projectsStartLoading())}
            >
              <RefreshSvg />
            </button>
          </Tooltip>
          <PDFDownloadLink
            document={
              <PDFReport fields={fields} data={PDFReportData} title={"REPORTE DE PROYECTOS"} />
            }
            fileName={`Reporte de proyectos (${currentDate})`}
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
                    canList
                      ? "cursor-pointer hover:bg-white-600 ease-in-out duration-300"
                      : "opacity-20 pt-2 pl-2"
                  } flex justify-center items-center w-[2.5rem] h-[2.5rem] text-xl rounded-full`}
                >
                  <PDFSvg />
                </button>
              )
            }
          </PDFDownloadLink>
        </div>
      </div>
      <Table
        size="small"
        columns={columns}
        dataSource={data}
        onChange={onChange}
        pagination={{ position: ["bottomCenter"], defaultPageSize: 20 }}
        className="shadow-md"
      />
    </>
  );
};

export default ProjectTable;

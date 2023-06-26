"use client";

import { SearchOutlined } from "@ant-design/icons";
import type { InputRef } from "antd";
import { Button, Input, Space, Table, Tag } from "antd";
import type { ColumnType, ColumnsType } from "antd/es/table";
import type { FilterConfirmProps } from "antd/es/table/interface";
import React, { useRef, useState } from "react";
import Highlighter from "react-highlight-words";

interface DataType {
  key: string;
  user: string;
  userName: string;
  lastName: string;
  privileges: string[];
  area: string;
}

type DataIndex = keyof DataType;

const data: DataType[] = [
  {
    key: "1",
    user: "dmuniz",
    userName: "Daniel",
    lastName: "Muniz Turtos",
    privileges: ["ADMIN", "USER", "COMERCIAL", "HR", "OFFICE", "PROJECT", "WAREHOUSE"],
    area: "INICIO",
  },
  {
    key: "2",
    user: "dmuniz2",
    userName: "Daniel",
    lastName: "Muniz Turtos",
    privileges: ["ADMIN", "USER", "COMERCIAL", "HR", "OFFICE", "PROJECT", "WAREHOUSE"],
    area: "INICIO",
  },
  {
    key: "3",
    user: "dmuniz3",
    userName: "Daniel",
    lastName: "Muniz Turtos",
    privileges: ["ADMIN", "USER", "COMERCIAL", "HR", "OFFICE", "PROJECT", "WAREHOUSE"],
    area: "INICIO",
  },
  {
    key: "4",
    user: "dmuniz4",
    userName: "Daniel",
    lastName: "Muniz Turtos",
    privileges: ["ADMIN", "USER", "COMERCIAL", "HR", "OFFICE", "PROJECT", "WAREHOUSE"],
    area: "INICIO",
  },
  {
    key: "5",
    user: "dmuniz4",
    userName: "Daniel",
    lastName: "Muniz Turtos",
    privileges: ["ADMIN", "USER", "COMERCIAL", "HR", "OFFICE", "PROJECT", "WAREHOUSE"],
    area: "INICIO",
  },
  {
    key: "6",
    user: "dmuniz4",
    userName: "Daniel",
    lastName: "Muniz Turtos",
    privileges: ["ADMIN", "USER", "COMERCIAL", "HR", "OFFICE", "PROJECT", "WAREHOUSE"],
    area: "INICIO",
  },
  {
    key: "7",
    user: "dmuniz4",
    userName: "Daniel",
    lastName: "Muniz Turtos",
    privileges: ["ADMIN", "USER", "COMERCIAL", "HR", "OFFICE", "PROJECT", "WAREHOUSE"],
    area: "INICIO",
  },
  {
    key: "8",
    user: "dmuniz4",
    userName: "Daniel",
    lastName: "Muniz Turtos",
    privileges: ["ADMIN", "USER", "COMERCIAL", "HR", "OFFICE", "PROJECT", "WAREHOUSE"],
    area: "INICIO",
  },
  {
    key: "9",
    user: "dmuniz4",
    userName: "Daniel",
    lastName: "Muniz Turtos",
    privileges: ["ADMIN", "USER", "COMERCIAL", "HR", "OFFICE", "PROJECT", "WAREHOUSE"],
    area: "INICIO",
  },
  {
    key: "10",
    user: "dmuniz4",
    userName: "Daniel",
    lastName: "Muniz Turtos",
    privileges: ["ADMIN", "USER", "COMERCIAL", "HR", "OFFICE", "PROJECT", "WAREHOUSE"],
    area: "INICIO",
  },
  {
    key: "11",
    user: "juan",
    userName: "Daniel",
    lastName: "Muniz Turtos",
    privileges: ["ADMIN", "USER", "COMERCIAL", "HR", "OFFICE", "PROJECT", "WAREHOUSE"],
    area: "INICIO",
  },
];

const UserTable: React.FC = () => {
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef<InputRef>(null);

  const handleSearch = (selectedKeys: string[], confirm: (param?: FilterConfirmProps) => void, dataIndex: DataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setSearchText("");
  };

  const getColumnSearchProps = (dataIndex: DataIndex): ColumnType<DataType> => ({
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
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  const columns: ColumnsType<DataType> = [
    {
      title: "Usuario",
      dataIndex: "user",
      key: "user",
      width: "10%",
      ...getColumnSearchProps("user"),
    },
    {
      title: "Nombre",
      dataIndex: "userName",
      key: "userName",
      width: "20%",
      ...getColumnSearchProps("lastName"),
    },
    {
      title: "Apellidos",
      dataIndex: "lastName",
      key: "lastName",
      width: "30%",
      ...getColumnSearchProps("lastName"),
    },
    {
      title: "Privilegios",
      dataIndex: "privileges",
      key: "privileges",
      width: "30%",
      ...getColumnSearchProps("privileges"),
      render: (_, { privileges }) => (
        <>
          {privileges.map((privilege) => {
            let color = "#3abaf4";
            switch (privilege) {
              case "ADMIN":
                color = "#ff6600";
                break;
              case "COMMERCIAL":
                color = "#34395e";
                break;
              case "USER":
                color = "#34b042";
                break;
              case "HR":
                color = "#ffa426";
                break;
              case "PROJECT":
                color = "#0d4799";
                break;
              case "WAREHOUSE":
                color = "#fc544b";
                break;
              case "OFFICE":
                color = "#662900";
                break;

              default:
                break;
            }
            return (
              <Tag color={color} key={privilege}>
                {privilege}
              </Tag>
            );
          })}
        </>
      ),
    },
    {
      title: "Area",
      dataIndex: "area",
      key: "area",
      width: "30%",
      ...getColumnSearchProps("area"),
    },
    {
      title: 'Acciones',
      key: 'action',
      render: (_) => (
        <Space size="large">
          <div className=" duration-300 transition-all ease-in-out cursor-pointer bg-blue-400 w-[3.5rem] h-[2rem] font-bold text-white text-center items-center pt-1 rounded-lg hover:bg-blue-600">Editar</div>
          <div className=" duration-300 transition-all ease-in-out cursor-pointer bg-danger-500 w-[3.5rem] h-[2rem] font-bold text-white text-center items-center pt-1 rounded-lg hover:bg-danger-700">Borrar</div>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Table columns={columns} dataSource={data} pagination={{ position: ["bottomCenter"], pageSize: 20 }} />
    </>
  );
};

export default UserTable;

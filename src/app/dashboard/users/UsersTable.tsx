"use client";

import { DeleteOutlined, EditOutlined, PlusOutlined, ReloadOutlined, SearchOutlined } from "@ant-design/icons";
import type { InputRef } from "antd";
import { Button, Input, Space, Table, Tag, Modal } from "antd";
import type { ColumnType, ColumnsType } from "antd/es/table";
import type { FilterConfirmProps } from "antd/es/table/interface";
import React, { useRef, useState } from "react";
import Highlighter from "react-highlight-words";
import { CreateUserForm } from "./CreateUserForm";

interface DataType {
  key: string;
  user: string;
  userName: string;
  lastName: string;
  privileges: string[];
  area: string;
}
interface Values {
  title: string;
  description: string;
  modifier: string;
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
  {
    key: "12",
    user: "juan",
    userName: "Daniel",
    lastName: "Muniz Turtos",
    privileges: ["ADMIN", "USER", "COMERCIAL", "HR", "OFFICE", "PROJECT", "WAREHOUSE"],
    area: "INICIO",
  },
  {
    key: "13",
    user: "juan",
    userName: "Daniel",
    lastName: "Muniz Turtos",
    privileges: ["ADMIN", "USER", "COMERCIAL", "HR", "OFFICE", "PROJECT", "WAREHOUSE"],
    area: "INICIO",
  },
  {
    key: "14",
    user: "juan",
    userName: "Daniel",
    lastName: "Muniz Turtos",
    privileges: ["ADMIN", "USER", "COMERCIAL", "HR", "OFFICE", "PROJECT", "WAREHOUSE"],
    area: "INICIO",
  },
  {
    key: "15",
    user: "juan",
    userName: "Daniel",
    lastName: "Muniz Turtos",
    privileges: ["ADMIN", "USER", "COMERCIAL", "HR", "OFFICE", "PROJECT", "WAREHOUSE"],
    area: "INICIO",
  },
  {
    key: "16",
    user: "juan",
    userName: "Daniel",
    lastName: "Muniz Turtos",
    privileges: ["ADMIN", "USER", "COMERCIAL", "HR", "OFFICE", "PROJECT", "WAREHOUSE"],
    area: "INICIO",
  },
  {
    key: "17",
    user: "juan",
    userName: "Daniel",
    lastName: "Muniz Turtos",
    privileges: ["ADMIN", "USER", "COMERCIAL", "HR", "OFFICE", "PROJECT", "WAREHOUSE"],
    area: "INICIO",
  },
  {
    key: "18",
    user: "juan",
    userName: "Daniel",
    lastName: "Gonzales",
    privileges: ["ADMIN", "USER", "COMERCIAL", "HR", "OFFICE", "PROJECT", "WAREHOUSE"],
    area: "INICIO",
  },
  {
    key: "19",
    user: "juan",
    userName: "Daniel",
    lastName: "Muniz Turtos",
    privileges: ["ADMIN", "USER", "COMERCIAL", "HR", "OFFICE", "PROJECT", "WAREHOUSE"],
    area: "INICIO",
  },
  {
    key: "20",
    user: "miguel",
    userName: "Daniel",
    lastName: "Muniz Turtos",
    privileges: ["ADMIN", "USER", "COMERCIAL", "HR", "OFFICE", "PROJECT", "WAREHOUSE"],
    area: "INICIO",
  },
  {
    key: "21",
    user: "pedro",
    userName: "Daniel",
    lastName: "Muniz Turtos",
    privileges: ["ADMIN", "USER", "COMERCIAL", "HR", "OFFICE", "PROJECT", "WAREHOUSE"],
    area: "INICIO",
  },
];

const UserTable: React.FC = () => {
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [createNewModal, setCreateNewModal] = useState(false);
  const [editModal, setEditModal] = useState(false);

  const searchInput = useRef<InputRef>(null);

  const handleNew = (): void => {
    setCreateNewModal(true);
  };

  const onCreate = (values: any) => {
    console.log('Received values of form: ', values);
    setCreateNewModal(false);
  };

  const handleSearch = (selectedKeys: string[], confirm: (param?: FilterConfirmProps) => void, dataIndex: DataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setSearchText("");
  };

  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: DataType[]) => {
      console.log(`selectedRowKeys: ${selectedRowKeys}`, "selectedRows: ", selectedRows);
    },
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
    // {
    //   title: 'Acciones',
    //   key: 'action',
    //   render: (_) => (
    //     <Space size="large">
    //       <div className=" duration-300 transition-all ease-in-out cursor-pointer bg-blue-400 w-[3.5rem] h-[2rem] font-bold text-white text-center items-center pt-1 rounded-lg hover:bg-blue-600">Editar</div>
    //       <div className=" duration-300 transition-all ease-in-out cursor-pointer bg-danger-500 w-[3.5rem] h-[2rem] font-bold text-white text-center items-center pt-1 rounded-lg hover:bg-danger-700">Borrar</div>
    //     </Space>
    //   ),
    // },
  ];

  return (
    <>
      <div className="flex h-14 w-full bg-white rounded-md shadow-md mb-4 items-center pl-4 gap-2">
        <div
          onClick={handleNew}
          className="bg-success-500 w-[6rem] h-[2.5rem] flex items-center p-1 text-base font-bold text-white cursor-pointer justify-center gap-2 rounded-md hover:bg-success-600 ease-in-out duration-300"
        >
          <PlusOutlined />
          Nuevo
        </div>
        <EditOutlined
          onClick={() => alert("Editar usuario")}
          className="w-[2rem] h-[2rem] text-xl rounded-full hover:bg-background_light ease-in-out duration-300"
        />
        <DeleteOutlined
          onClick={() => alert("Eliminar usuario")}
          className="w-[2rem] h-[2rem] text-xl rounded-full hover:bg-background_light ease-in-out duration-300"
        />
        <ReloadOutlined
          onClick={() => alert("Refrescar pagina")}
          className="w-[2rem] h-[2rem] text-xl rounded-full hover:bg-background_light ease-in-out duration-300"
        />
      </div>
      
        <CreateUserForm open={createNewModal} onCancel={() => setCreateNewModal(false)} onCreate={onCreate} />
      <Table
        columns={columns}
        dataSource={data}
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

export default UserTable;

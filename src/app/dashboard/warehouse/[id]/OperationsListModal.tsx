"use client";

import { IOperation } from "@/models/operation";
import { Form, List, InputNumber, Modal, Select, SelectProps } from "antd";
import Highlighter from "react-highlight-words";
import React, {useMemo, useRef, useState } from "react";
import { Button, Input, Space, Table } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import type { InputRef } from "antd";
import type { ColumnType, ColumnsType } from "antd/es/table";
import type { FilterConfirmProps } from "antd/es/table/interface";

interface Values {
  operations: [IOperation]
}

interface DataType{
  _id: string;
  tipo: string;
  date: string;
  amount: number;
}

type DataIndex = keyof DataType;

interface CollectionCreateFormProps {
  open: boolean;
  onCreate: (values: Values) => void;
  onCancel: () => void;
  defaultValues?: Values;
}

export const OperationsList: React.FC<CollectionCreateFormProps> = ({ open, onCancel, defaultValues }) => {
  const data = defaultValues?.operations 
  return (
    <Modal
      className="flex flex-col"
      title={
        <div className="flex w-full justify-center">
          <span className="font-black text-lg">Operaciones</span>
        </div>
      }
      centered
      open={open}
      style={{ textAlign: "left" }}
      destroyOnClose
      onCancel={onCancel}
      width={'80rem'}
      footer={null}
    >
      <OperationsTable operations={data}/>
    </Modal>
  );
};

interface Props {
  operations: [IOperation] | undefined
}

const OperationsTable: React.FC<Props> = (props) => {

  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");

  const searchInput = useRef<InputRef>(null);
  const operations = props.operations

  const data: DataType[] = useMemo(() => operations, [operations]);


  const handleSearch = (selectedKeys: string[], confirm: (param?: FilterConfirmProps) => void, dataIndex: DataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
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
      title: "Tipo",
      dataIndex: "tipo",
      key: "tipo",
      width: "20%",
      ...getColumnSearchProps("tipo"),
    },
    {
      title: "Fecha",
      dataIndex: "date",
      key: "date",
      width: "15%",
      ...getColumnSearchProps("date"),
    },
    {
      title: "Cantidad",
      dataIndex: "amount",
      key: "amount",
      width: "15%",
      ...getColumnSearchProps("amount"),
    }
  ];

  return (
    <>
      <Table
        size="middle"
        columns={columns}
        dataSource={data}
        pagination={{ position: ["bottomCenter"], pageSize: 14 }}
      />
    </>
  );
};
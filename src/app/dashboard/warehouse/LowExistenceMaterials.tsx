"use client";

import Highlighter from "react-highlight-words";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { SearchOutlined, WarningTwoTone } from "@ant-design/icons";
import { Button, Input, Space, Table, Tag } from "antd";
import type { InputRef } from "antd";
import type { ColumnType, ColumnsType } from "antd/es/table";
import type { FilterConfirmProps } from "antd/es/table/interface";

import { useAppDispatch } from "@/hooks/hooks";
import { RootState, useAppSelector } from "@/store/store";
import { lowExistenceMaterialsStartLoading, warehousesStartLoading } from "@/actions/warehouse";
import { IOperation } from "@/models/operation";

interface DataType {
  _id: string;
  code: string;
  key: string;
  materialName: string;
  enterDate: string;
  category: string;
  costPerUnit: number;
  unitsTotal: number;
  minimumExistence: number;
  unitMeasure: string;
  operations: [IOperation];
}

type DataIndex = keyof DataType;

const LowExistenceMaterials: React.FC = () => {
  const dispatch = useAppDispatch();
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");

  const searchInput = useRef<InputRef>(null);

  useEffect(() => {
    dispatch(lowExistenceMaterialsStartLoading());
  }, [dispatch]);

  const { lowExistenceMaterials } = useAppSelector((state: RootState) => state?.material);
  const data: DataType[] = useMemo(() => lowExistenceMaterials, [lowExistenceMaterials]);

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
      title: "Código",
      dataIndex: "code",
      key: "code",
      width: "20%",
      ...getColumnSearchProps("code"),
    },
    {
      title: "En almacén",
      dataIndex: "unitsTotal",
      key: "unitsTotal",
      width: "10%",
      sorter: {
        compare: (a, b) => a.unitsTotal - b.unitsTotal,
      },
      ...getColumnSearchProps("unitsTotal"),
    },
    {
      title: "Existencias Mínimas",
      dataIndex: "minimumExistence",
      key: "minimumExistence",
      width: "10%",
      ...getColumnSearchProps("minimumExistence"),
    },
  ];

  return (
    <>
      <div className="flex h-14 w-full bg-white-100 rounded-md shadow-md mb-4 items-center pl-4 gap-2 justify-center">
        <span className="items-center flex gap-2 font-black text-xl">
          Materiales con pocas existencias <WarningTwoTone className="text-2xl pb-2" twoToneColor={'#ff0000'}/>
        </span>
      </div>
      <Table size="middle" columns={columns} dataSource={data} pagination={{ position: ["bottomCenter"], pageSize: 10 }} className="shadow-md" />
    </>
  );
};

export default LowExistenceMaterials;

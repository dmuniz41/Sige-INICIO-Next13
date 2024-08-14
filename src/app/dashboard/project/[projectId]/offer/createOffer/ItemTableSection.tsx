"use client";
import { Tooltip } from "antd";
import { useMemo } from "react";
import Table, { ColumnsType } from "antd/es/table";

import { DeleteSvg } from "@/app/global/DeleteSvg";
import { EditSvg } from "@/app/global/EditSvg";
import { IActivity } from "@/models/offer";
import { PlusSvg } from "@/app/global/PlusSvg";
import { useAppDispatch } from "@/hooks/hooks";

export const ItemTableSection = (props: any) => {
  // const dispatch = useAppDispatch();
  const { sectionName, values, valuesSetter, addModalSetter, editModalSetter, valueToEditSetter, buttonText, actionToDispatch } =
    props;

  const subtotal = useMemo(() => values?.map((value: IActivity) => value.value), [values]);

  const handleDelete = (record: IActivity) => {
    valuesSetter(values.filter((value: IActivity) => JSON.stringify(value) !== JSON.stringify(record)));
  };

  // const handleEdit = (record: IActivity) => {
  //   const selectedActivity = values.find((value: IActivity) => value.description === record.description);
  //   dispatch(actionToDispatch(selectedActivity));
  //   valueToEditSetter(record);
  //   editModalSetter(true);
  // };

  const columns: ColumnsType<IActivity> = [
    {
      title: <span className="font-bold">Descripción</span>,
      dataIndex: "description",
      key: "description",
      width: "50%",
      render: (_, { ...record }) => (
        <span className="flex gap-1">{`${record.description}${record.listOfMeasures.map((e) => e.description)}`}</span>
      )
    },
    {
      title: <span className="font-bold">Cantidad</span>,
      dataIndex: "amount",
      key: "amount",
      width: "15%",
      render: (value) => <span>{value?.toLocaleString("DE", { maximumFractionDigits: 2, minimumFractionDigits: 2 })}</span>
    },
    {
      title: <span className="font-bold">Unidad de Medida</span>,
      dataIndex: "unitMeasure",
      key: "unitMeasure",
      width: "10%"
    },
    {
      title: <span className="font-bold">Precio</span>,
      dataIndex: "price",
      key: "price",
      width: "15%",
      render: (value) => <span>$ {value?.toLocaleString("DE", { maximumFractionDigits: 2, minimumFractionDigits: 2 })}</span>
    },
    {
      title: <span className="font-bold">Importe</span>,
      dataIndex: "value",
      key: "value",
      width: "15%",
      render: (value) => <span>$ {value?.toLocaleString("DE", { maximumFractionDigits: 2, minimumFractionDigits: 2 })}</span>
    },
    {
      title: <span className="font-bold">Acciones</span>,
      key: "actions",
      width: "5%",
      render: (_, { ...record }) => (
        <div className="flex gap-1 justify-center">
          {/* <Tooltip placement="top" title={"Editar"} arrow={{ pointAtCenter: true }}>
            <button onClick={() => handleEdit(record)} className="table-see-action-btn">
              <EditSvg width={18} height={18} />
            </button>
          </Tooltip> */}
          <Tooltip placement="top" title={"Eliminar"} arrow={{ pointAtCenter: true }}>
            <button onClick={() => handleDelete(record)} className="table-delete-action-btn">
              <DeleteSvg width={17} height={17} />
            </button>
          </Tooltip>
        </div>
      )
    }
  ];

  return (
    <section className=" flex w-full  rounded-md p-2 border border-border_light shadow-md">
      <div className="flex w-[15%] h-full p-2 text-center items-center justify-center bg-[#fafafa] rounded-l-md">
        <span className="text-base font-bold">{sectionName?.toUpperCase()}</span>
      </div>
      <div className="grid pl-2 w-full gap-2">
        <Table
          size="small"
          columns={columns}
          dataSource={values}
          className="shadow-sm"
          sortDirections={["ascend"]}
          pagination={false}
          bordered
          footer={() => (
            <footer className="flex w-full justify-between pr-1">
              <div className="font-bold flex">
                <span>Valor: </span>
              </div>
              <div className="flex pl-1 font-bold">
                <span>
                  ${" "}
                  {subtotal
                    ?.reduce((total: number, current: number) => total + current, 0)
                    ?.toLocaleString("DE", {
                      maximumFractionDigits: 2,
                      minimumFractionDigits: 2
                    })}
                </span>
              </div>
            </footer>
          )}
        />
        <button
          className="add-item-form-btn"
          onClick={() => {
            addModalSetter(true);
          }}
        >
          <PlusSvg width={20} height={20} />
          {buttonText}
        </button>
      </div>
    </section>
  );
};

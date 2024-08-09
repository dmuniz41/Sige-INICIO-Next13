"use client";
import { Tooltip } from "antd";
import { useMemo } from "react";
import Swal from "sweetalert2";
import Table, { ColumnsType } from "antd/es/table";

import { DeleteSvg } from "@/app/global/DeleteSvg";
import { IServiceFeeSubItem } from "@/models/serviceFees";
import { PlusSvg } from "@/app/global/PlusSvg";

export const AdministrativeExpensesFormSection = (props: any) => {
  const { sectionName, values, valuesSetter, addModalSetter, buttonText, estimatedTime } = props;

  const subtotal = useMemo(() => values?.map((value: IServiceFeeSubItem) => value.value), [values]);

  const handleDelete = (record: IServiceFeeSubItem) => {
    Swal.fire({
      title: "Eliminar",
      text: "Está seguro que desea eliminar este elemento",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      cancelButtonText: "Cancelar",
      confirmButtonText: "Eliminar"
    }).then((result) => {
      if (result.isConfirmed) {
        valuesSetter(
          values.filter((value: IServiceFeeSubItem) => value.description !== record.description)
        );
      }
    });
  };

  const columns: ColumnsType<IServiceFeeSubItem> = [
    {
      title: <span className="font-semibold">Descripción</span>,
      dataIndex: "description",
      key: "description",
      width: "50%"
    },
    {
      title: <span className="font-semibold">Unidad de Medida</span>,
      dataIndex: "unitMeasure",
      key: "unitMeasure",
      width: "15%"
    },
    {
      title: <span className="font-semibold">Cantidad</span>,
      dataIndex: "amount",
      key: "amount",
      width: "10%",
      render: (value) => (
        <span>
          {estimatedTime?.toLocaleString("DE", {
            maximumFractionDigits: 2,
            minimumFractionDigits: 2
          })}
        </span>
      )
    },
    {
      title: <span className="font-semibold">Precio/UM</span>,
      dataIndex: "price",
      key: "price",
      width: "15%",
      render: (value) => (
        <span>
          $ {value?.toLocaleString("DE", { maximumFractionDigits: 2, minimumFractionDigits: 2 })}
        </span>
      )
    },
    {
      title: <span className="font-semibold">Importe</span>,
      dataIndex: "value",
      key: "value",
      width: "15%",
      render: (_, { ...record }) => (
        <span>
          ${" "}
          {(estimatedTime * record?.price)?.toLocaleString("DE", {
            maximumFractionDigits: 2,
            minimumFractionDigits: 2
          })}
        </span>
      )
    },
    {
      title: <span className="font-semibold">Acciones</span>,
      key: "actions",
      width: "5%",
      render: (_, { ...record }) => (
        <div className="flex gap-1 justify-center">
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
    <section className=" flex w-full mb-4 rounded-md p-2 border border-border_light shadow-sm">
      <div className="flex w-[15%] h-full p-2 text-center items-center justify-center bg-[#fafafa] rounded-l-md">
        <span className="text-base font-semibold">{sectionName?.toUpperCase()}</span>
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
            <footer className="flex w-full">
              <div className="font-semibold flex w-[86.2%]">
                <span>Subtotal: </span>
              </div>
              <div className="flex justify-start font-semibold">
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

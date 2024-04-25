"use client";
import { Table, Tooltip } from "antd";
import React, { useEffect } from "react";
import type { ColumnsType } from "antd/es/table";

import { CircleCheckSvg } from "@/app/global/CircleCheckSvg";
import { IOffer } from "@/models/offer";
import { loadSelectedOffer, offersStartLoading } from "@/actions/offer";
import { RootState, useAppSelector } from "@/store/store";
import { SeeSvg } from "@/app/global/SeeSvg";
import { useAppDispatch } from "@/hooks/hooks";
import { useRouter } from "next/navigation";

const OfferTable = (props: { projectId: string }) => {
  const { projectId } = props;
  const dispatch = useAppDispatch();
  const router = useRouter();

  useEffect(() => {
    dispatch(offersStartLoading(projectId));
  }, [dispatch, projectId]);

  const { offers }: { offers: IOffer[]; finalOfferId: string } = useAppSelector(
    (state: RootState) => state?.offer
  );

  const handleView = (offerId: string): void => {
    dispatch(loadSelectedOffer(projectId));
    router.push(`/dashboard/project/${projectId}/offer/${offerId}`);
  };

  const columns: ColumnsType<IOffer> = [
    {
      title: <span className="font-bold">Nombre</span>,
      dataIndex: "projectName",
      key: "projectName",
      width: "60%",
      render: (_, record) => (
        <div className="flex gap-4">
          <span>{record.projectName}</span>
          {record.isFinalOffer ? (
            <div className=" text-success-500">
              <CircleCheckSvg />
            </div>
          ) : (
            <></>
          )}
        </div>
      ),
      sorter: (a: any, b: any) => a.projectName.localeCompare(b.projectName)
    },
    {
      title: <span className="font-bold">Valor</span>,
      dataIndex: "value",
      key: "value",
      width: "10%",
      render: (value) => (
        <span>
          ${" "}
          {value.toLocaleString("DE", {
            maximumFractionDigits: 2,
            minimumFractionDigits: 2
          })}
        </span>
      )
    },
    {
      title: <span className="font-bold">Representación</span>,
      dataIndex: "representativeName",
      key: "representativeName",
      width: "10%",
      render: (representativeName) => <span>{representativeName}</span>
    },
    {
      title: <span className="font-bold">Acciones</span>,
      key: "actions",
      width: "5%",
      render: (_, record) => (
        <div className="flex gap-1 justify-center">
          <Tooltip placement="top" title={"Ver"} arrow={{ pointAtCenter: true }}>
            <button onClick={() => handleView(record._id)} className="table-see-action-btn">
              <SeeSvg width={20} height={20} />
            </button>
          </Tooltip>
        </div>
      )
    }
  ];

  const isFinalOfferRow = (rowObject: IOffer) => {
    return rowObject.isFinalOffer ? "bg-success-100" : "";
  };

  return (
    <>
      <Table
        size="small"
        columns={columns}
        dataSource={offers}
        pagination={{ position: ["bottomCenter"], defaultPageSize: 20 }}
        className="shadow-md"
        rowClassName={(record) => isFinalOfferRow(record)}
      />
    </>
  );
};

export default OfferTable;
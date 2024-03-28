"use client";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";

import { EditAuxiliary } from "./EditAuxiliary";
import { EditSvg } from "@/app/global/EditSvg";
import { IServiceFeeAuxiliary } from "../../../models/serviceFeeAuxiliary";
import { RootState, useAppSelector } from "@/store/store";
import { startLoadServiceFeeAuxiliary, startUpdateServiceFeeAuxiliary } from "@/actions/serviceFeeAuxiliary";
import { useAppDispatch } from "@/hooks/hooks";
import { AuxiliarySection } from "./AuxiliarySection";
import { serviceFeeStartLoading } from "@/actions/serviceFee";

export const AuxiliaryView = () => {
  const dispatch = useAppDispatch();
  const [editing, setEditing] = useState(false);
  const { data: sessionData } = useSession();

  const canEdit = sessionData?.user.role.includes("Editar Tarifas de Servicio");

  useEffect(() => {
    dispatch(startLoadServiceFeeAuxiliary());
    dispatch(serviceFeeStartLoading())
  }, [dispatch]);

  const { serviceFeeAuxiliary }: { serviceFeeAuxiliary: IServiceFeeAuxiliary } = useAppSelector((state: RootState) => state?.serviceFee);

  const handleEdit = () => {
    setEditing(true);
  };

  const onCreate = async (values: any) => {
    dispatch(
      startUpdateServiceFeeAuxiliary({
        _id: serviceFeeAuxiliary?._id,
        administrativeExpensesCoefficients: values.administrativeExpenses,
        calculationCoefficient: values.calculationCoefficient,
        currency: serviceFeeAuxiliary?.currency,
        currencyChange: values?.currencyChange,
        equipmentDepreciationCoefficients: values.equipmentDepreciation,
        equipmentMaintenanceCoefficients: values.equipmentMaintenance,
        informalCurrencyChange: values.informalCurrencyChange,
        key: serviceFeeAuxiliary?.key,
        mermaCoefficient: values.mermaCoefficient,
        officialCurrencyChangeCoefficient: values.officialCurrencyChangeCoefficient,
        payMethod: values.payMethod,
        transportationExpensesCoefficients: values.transportationExpenses,
      })
    );
    setEditing(false);
  };

  const payMethodColumns = [
    {
      title: "Representante",
      dataIndex: "representative",
      key: "representative",
      width: "300px"
    },
    {
      title: "Porcentaje",
      dataIndex: "coefficientValue",
      key: "coefficientValue",
      width: "150px",
      render: (value: number) => (
        <span>
          $ {value?.toLocaleString("DE", { maximumFractionDigits: 2, minimumFractionDigits: 2 })}
        </span>
      )
    }
  ];
  const columns = [
    {
      title: "Nombre",
      dataIndex: "name",
      key: "name",
      width: "300px"
    },
    {
      title: "Valor",
      dataIndex: "value",
      key: "value",
      width: "150px",
      render: (value: number) => (
        <span>
          $ {value?.toLocaleString("DE", { maximumFractionDigits: 2, minimumFractionDigits: 2 })}
        </span>
      )
    }
  ];

  return (
    <>
      {!editing ? (
        <section className="grid w-full gap-4">
          <article className="flex h-16 w-full bg-white-100 rounded-md shadow-md  items-center pl-4 gap-3 animate-fade animate-once animate-duration-200">
            <button disabled={!canEdit} onClick={handleEdit} className="toolbar-primary-icon-btn">
              <EditSvg />
              Editar
            </button>
          </article>
          <article className=" flex flex-col items-start gap-3 p-4 rounded-md shadow-lg animate-fade animate-once animate-duration-200">
            <AuxiliarySection data={serviceFeeAuxiliary?.payMethod} columns={payMethodColumns} sectionName="Métodos de pago" />
            <AuxiliarySection data={serviceFeeAuxiliary?.administrativeExpensesCoefficients} columns={columns} sectionName="Gastos Administrativos" />
            <AuxiliarySection data={serviceFeeAuxiliary?.equipmentDepreciationCoefficients} columns={columns} sectionName="Depreciación de Equipos" />
            <AuxiliarySection data={serviceFeeAuxiliary?.equipmentMaintenanceCoefficients} columns={columns} sectionName="Mantenimiento de Equipos" />
            <AuxiliarySection
              data={serviceFeeAuxiliary?.transportationExpensesCoefficients}
              columns={columns}
              sectionName="Gastos de Transportación"
            />
            <AuxiliarySection
              data={[
                {
                  name: "Coeficiente de Cálculo",
                  value: serviceFeeAuxiliary?.calculationCoefficient,
                },
                {
                  name: "Coeficiente de Cambio Monetario Oficial",
                  value: serviceFeeAuxiliary?.officialCurrencyChangeCoefficient,
                },
                {
                  name: "Cambio Informal",
                  value: serviceFeeAuxiliary?.informalCurrencyChange,
                },
                {
                  name: "Coeficiente de Merma",
                  value: serviceFeeAuxiliary?.mermaCoefficient,
                },
                {
                  name: "Cambio de Moneda",
                  value: serviceFeeAuxiliary?.currencyChange,
                },
              ]}
              columns={columns}
              sectionName="Otros"
            />
          </article>
        </section>
      ) : (
        <article className="flex flex-col max-w-[50%] bg-white-100 rounded-md shadow-md mb-4 items-center pl-4 pr-4 pt-4 gap-4 animate-fade animate-once animate-duration-200">
          <EditAuxiliary defaultValues={serviceFeeAuxiliary} onCreate={onCreate} />
        </article>
      )}
    </>
  );
};

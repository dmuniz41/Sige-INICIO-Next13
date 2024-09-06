"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

import { AuxiliarySection } from "./AuxiliarySection";
import { EditAuxiliary } from "./EditAuxiliary";
import { EditSvg } from "@/app/global/EditSvg";
import { IServiceFeeAuxiliary } from "../../../models/serviceFeeAuxiliary";
import { RootState, useAppSelector } from "@/store/store";
import { serviceFeeStartLoading } from "@/actions/serviceFee";
import { startLoadServiceFeeAuxiliary, startUpdateServiceFeeAuxiliary } from "@/actions/serviceFeeAuxiliary";
import { useAppDispatch } from "@/hooks/hooks";

export const AuxiliaryView = () => {
  const dispatch = useAppDispatch();
  const [editing, setEditing] = useState(false);
  const { data: sessionData } = useSession();

  const canEdit = sessionData?.user.role.includes("Editar Tarifas de Servicio");

  useEffect(() => {
    dispatch(startLoadServiceFeeAuxiliary());
    dispatch(serviceFeeStartLoading());
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
        indirectSalariesCoefficient: values.indirectSalariesCoefficient,
        artisticTalentPercentage: values.artisticTalentPercentage,
        currency: serviceFeeAuxiliary?.currency,
        currencyChange: values?.currencyChange,
        equipmentDepreciationCoefficients: values.equipmentDepreciation,
        equipmentMaintenanceCoefficients: values.equipmentMaintenance,
        informalCurrencyChange: values.informalCurrencyChange,
        key: serviceFeeAuxiliary?.key,
        mermaCoefficient: values.mermaCoefficient,
        ONATTaxPercentage: values.ONATTaxPercentage,
        payMethod: values.payMethod,
        transportationExpensesCoefficients: values.transportationExpenses
      })
    );
    setEditing(false);
  };

  const columns = [
    {
      title: <span className="font-bold">Nombre</span>,
      dataIndex: "name",
      key: "name",
      width: "300px"
    },
    {
      title: <span className="font-bold">Valor</span>,
      dataIndex: "value",
      key: "value",
      width: "150px",
      render: (value: number) => <span>{value}</span>
    }
  ];

  return (
    <>
      {!editing ? (
        <section className="grid w-full gap-4">
          <article className="flex items-center w-full h-16 gap-3 pl-4 rounded-md shadow-md bg-white-100 animate-fade animate-once animate-duration-200">
            <button disabled={!canEdit} onClick={handleEdit} className="toolbar-primary-icon-btn">
              <EditSvg />
              Editar
            </button>
          </article>
          <article className="flex flex-col items-start gap-3 p-4 animate-fade animate-once animate-duration-200">
            <AuxiliarySection
              data={serviceFeeAuxiliary?.administrativeExpensesCoefficients}
              columns={columns}
              sectionName="Coeficientes  Gastos Administrativos"
            />
            <AuxiliarySection
              data={serviceFeeAuxiliary?.equipmentDepreciationCoefficients}
              columns={columns}
              sectionName="Coeficientes  Depreciación de Equipos"
            />
            <AuxiliarySection
              data={serviceFeeAuxiliary?.equipmentMaintenanceCoefficients}
              columns={columns}
              sectionName="Coeficientes  Mantenimiento de Equipos"
            />
            <AuxiliarySection
              data={serviceFeeAuxiliary?.transportationExpensesCoefficients}
              columns={columns}
              sectionName="Coeficientes  Gastos de Transportación"
            />
            <AuxiliarySection
              data={[
                {
                  name: "Impuesto ONAT (%)",
                  value: serviceFeeAuxiliary?.ONATTaxPercentage
                },
                {
                  name: "Talento Artístico (%)",
                  value: serviceFeeAuxiliary?.artisticTalentPercentage
                },
                {
                  name: "Coeficiente de Merma",
                  value: serviceFeeAuxiliary?.mermaCoefficient
                },
                {
                  name: "Cambio de Moneda",
                  value: serviceFeeAuxiliary?.currencyChange
                },
                {
                  name: "Coeficiente de Salarios Indirectos",
                  value: serviceFeeAuxiliary?.indirectSalariesCoefficient
                }
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

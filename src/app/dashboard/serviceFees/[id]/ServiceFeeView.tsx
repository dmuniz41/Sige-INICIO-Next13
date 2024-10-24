"use client";

import { Divider } from "antd";
import { RootState, useAppSelector } from "@/store/store";
import { useAppDispatch } from "@/hooks/hooks";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import React, { useEffect, useMemo } from "react";

import { EditSvg } from "@/app/global/EditSvg";
import { IServiceFee, IServiceFeeSubItem } from "@/models/serviceFees";
import { loadSelectedServiceFee } from "@/actions/serviceFee";
import { ServiceFeeViewTableSection } from "./ServiceFeeViewSection";
import { ServiceFeeViewTaskListSection } from "./ServiceFeeViewTaskListSection";
import { IServiceFeeTask } from "@/models/serviceFeeTask";

export const ServiceFeeView = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const url = usePathname().split("/");
  const selectedServiceFeeId: string = url[3];

  useEffect(() => {
    dispatch(loadSelectedServiceFee(selectedServiceFeeId));
  }, [dispatch, selectedServiceFeeId]);

  const { selectedServiceFee }: { selectedServiceFee: IServiceFee } = useAppSelector((state: RootState) => state?.serviceFee);
  let rawMaterials: IServiceFeeSubItem[] = useMemo(() => selectedServiceFee.rawMaterials, [selectedServiceFee]);
  let taskList: IServiceFeeTask[] = useMemo(() => selectedServiceFee.taskList, [selectedServiceFee]);
  let equipmentDepreciation: IServiceFeeSubItem[] = useMemo(() => selectedServiceFee.equipmentDepreciation, [selectedServiceFee]);
  let equipmentMaintenance: IServiceFeeSubItem[] = useMemo(() => selectedServiceFee.equipmentMaintenance, [selectedServiceFee]);
  let administrativeExpenses: IServiceFeeSubItem[] = selectedServiceFee.administrativeExpenses;
  let transportationExpenses: IServiceFeeSubItem[] = selectedServiceFee.transportationExpenses;
  let hiredPersonalExpenses: IServiceFeeSubItem[] = selectedServiceFee.hiredPersonalExpenses;

  const handleEdit = (): void => {
    router.push(`/dashboard/serviceFees/editServiceFee`);
  };

  return (
    <>
      <article>
        <div className="flex items-center w-full h-16 gap-4 pl-4 mb-4 rounded-md shadow-md">
          <div className="flex gap-2">
            <button className="toolbar-primary-icon-btn" onClick={handleEdit}>
              <EditSvg />
              Editar
            </button>
          </div>
        </div>
      </article>

      <section className="flex flex-col w-full gap-1 p-2 rounded-md overflow-none">
        <article className="flex flex-row w-full p-4 ">
          <label className="mr-3 font-semibold text-md">Descripción del servicio:</label>
          <p className="w-[25%]">{selectedServiceFee.taskName}</p>
          <div className="w-[20%] flex flex-col pl-10">
            <label className="font-semibold">
              Creador: <span className="font-normal">INICIO</span>
            </label>
            <label className="font-semibold">
              Cantidad de trabajadores:
              <span className="font-normal"> {selectedServiceFee?.workersAmount}</span>
            </label>
          </div>
          <div className="flex w-[20%] flex-col">
            <label className="font-semibold">
              Nomenclador: <span className="font-normal">{selectedServiceFee?.nomenclatorId}</span>
            </label>
            <label className="font-semibold">
              Categoría: <span className="font-normal">{selectedServiceFee?.category}</span>
            </label>
          </div>
          <div className="flex flex-col flex-1">
            <label className="font-semibold">
              Unidad de Medida: <span className="font-normal">{selectedServiceFee?.unitMeasure}</span>
            </label>
          </div>
        </article>

        <article className="flex flex-col flex-1 ">
          <ServiceFeeViewTableSection name="Materias Primas" data={rawMaterials} subtotal={selectedServiceFee?.rawMaterialsSubtotal} />
          <ServiceFeeViewTaskListSection name="Actividades a Ejecutar" data={taskList} subtotal={selectedServiceFee?.taskListSubtotal} />
          <ServiceFeeViewTableSection
            name="Depreciación de Equipos"
            data={equipmentDepreciation}
            subtotal={selectedServiceFee?.equipmentDepreciationSubtotal}
          />
          <ServiceFeeViewTableSection
            name="Mantenimiento de Equipos"
            data={equipmentMaintenance}
            subtotal={selectedServiceFee?.equipmentMaintenanceSubtotal}
          />
          <ServiceFeeViewTableSection
            name="Gastos Administrativos"
            data={administrativeExpenses}
            subtotal={selectedServiceFee?.administrativeExpensesSubtotal}
          />
          <ServiceFeeViewTableSection
            name="Gastos Transporte"
            data={transportationExpenses}
            subtotal={selectedServiceFee?.transportationExpensesSubtotal}
          />
          <ServiceFeeViewTableSection
            name="Gastos Personal Contratado"
            data={hiredPersonalExpenses}
            subtotal={selectedServiceFee?.hiredPersonalExpensesSubtotal}
          />
        </article>

        <ServiceFeeViewSeccion name="IMPORTE TOTAL DE GASTOS" value={selectedServiceFee?.expensesTotalValue} />
        <EstimateTimeViewSeccion name="TIEMPO ESTIMADO" value={selectedServiceFee?.estimatedTime} />

        <article className="flex justify-end pl-4 pr-4 items-center h-[39px] flex-grow bg-[#fafafa] border-solid border-[1px] border-white-600 rounded-lg">
          <div className="flex w-[150px] font-semibold pl-2">MN</div>
          <Divider type="vertical" />
          <div className="flex w-[150px] font-semibold pl-2">USD</div>
        </article>

        {selectedServiceFee?.pricePerRepresentative?.map((representative: any, index: number) => {
          return (
            <article
              key={index}
              className="flex pl-4 pr-4 items-center h-[39px] flex-grow bg-[#fafafa] border-solid border-[1px] border-white-600 rounded-lg"
            >
              <div className="flex justify-end flex-grow pr-4 font-semibold">
                <h2>PRECIO DE VENTA {representative.representativeName}: </h2>
              </div>
              <div className="flex w-[150px] pl-2">
                ${" "}
                {representative?.price?.toLocaleString("DE", {
                  maximumFractionDigits: 2,
                  minimumFractionDigits: 2
                })}
              </div>
              <Divider type="vertical" />
              <div className="flex w-[150px] pl-2">
                ${" "}
                {representative?.priceUSD?.toLocaleString("DE", {
                  maximumFractionDigits: 2,
                  minimumFractionDigits: 2
                })}
              </div>
            </article>
          );
        })}
      </section>
    </>
  );
};

export const ServiceFeeViewSeccion = (props: any) => {
  const { name, value } = props;
  return (
    <article className="flex items-center pr-4 h-[39px] bg-[#fafafa] border-solid border-[1px] border-white-600 rounded-lg">
      <div className="flex justify-end flex-1 pr-4 font-semibold">
        <h2>{name}: </h2>
      </div>
      <div className="flex w-[150px] pl-2">$ {value?.toLocaleString("DE", { maximumFractionDigits: 2, minimumFractionDigits: 2 })}</div>
    </article>
  );
};

export const EstimateTimeViewSeccion = (props: any) => {
  const { name, value } = props;
  return (
    <article className="flex items-center pr-4 h-[39px] bg-[#fafafa] border-solid border-[1px] border-white-600 rounded-lg">
      <div className="flex justify-end flex-1 pr-4 font-semibold">
        <h2>{name}: </h2>
      </div>
      <div className="flex w-[150px] pl-2">{value?.toLocaleString("DE", { maximumFractionDigits: 2, minimumFractionDigits: 2 })} h</div>
    </article>
  );
};

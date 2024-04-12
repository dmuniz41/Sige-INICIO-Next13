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

export const ServiceFeeView = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const url = usePathname().split("/");
  const selectedServiceFeeId: string = url[3];

  useEffect(() => {
    dispatch(loadSelectedServiceFee(selectedServiceFeeId));
  }, [dispatch, selectedServiceFeeId]);

  const { selectedServiceFee }: { selectedServiceFee: IServiceFee } = useAppSelector(
    (state: RootState) => state?.serviceFee
  );
  let rawMaterials: IServiceFeeSubItem[] = useMemo(
    () => selectedServiceFee.rawMaterials,
    [selectedServiceFee]
  );
  let taskList: IServiceFeeSubItem[] = useMemo(
    () => selectedServiceFee.taskList,
    [selectedServiceFee]
  );
  let equipmentDepreciation: IServiceFeeSubItem[] = useMemo(
    () => selectedServiceFee.equipmentDepreciation,
    [selectedServiceFee]
  );
  let equipmentMaintenance: IServiceFeeSubItem[] = useMemo(
    () => selectedServiceFee.equipmentMaintenance,
    [selectedServiceFee]
  );
  let administrativeExpenses: IServiceFeeSubItem[] = selectedServiceFee.administrativeExpenses;
  let transportationExpenses: IServiceFeeSubItem[] = selectedServiceFee.transportationExpenses;
  let hiredPersonalExpenses: IServiceFeeSubItem[] = selectedServiceFee.hiredPersonalExpenses;

  const handleEdit = (): void => {
    router.push(`/dashboard/serviceFees/editServiceFee`);
  };

  return (
    <>
      <article>
        <div className="flex h-16 w-full  rounded-md shadow-md mb-4 items-center pl-4 gap-4">
          <div className="flex gap-2">
            <button className="toolbar-primary-icon-btn" onClick={handleEdit}>
              <EditSvg />
              Editar
            </button>
          </div>
        </div>
      </article>

      <section className="flex gap-1 flex-col w-full overflow-none rounded-md shadow-md p-2">
        <article className="w-full flex flex-row p-4 ">
          <label className="font-bold mr-3 ">Descripción del servicio:</label>
          <p className="w-[25%]">{selectedServiceFee.taskName}</p>
          <div className="w-[20%] flex flex-col pl-10">
            <label className="font-bold">
              Creador: <span className="font-normal">INICIO</span>
            </label>
            <label className="font-bold">
              Cantidad de trabajadores:{" "}
              <span className="font-normal">{selectedServiceFee?.workersAmount}</span>
            </label>
          </div>
          <div className="flex w-[20%] flex-col">
            <label className="font-bold">
              Nomenclador: <span className="font-normal">{selectedServiceFee?.nomenclatorId}</span>
            </label>
            <label className="font-bold">
              Categoría: <span className="font-normal">{selectedServiceFee?.category}</span>
            </label>
          </div>
          <div className="flex flex-1 flex-col">
            <label className="font-bold">
              Unidad de Medida:{" "}
              <span className="font-normal">{selectedServiceFee?.unitMeasure}</span>
            </label>
          </div>
        </article>

        <article className=" flex flex-1 flex-col">
          <ServiceFeeViewTableSection
            name="Materias Primas"
            data={rawMaterials}
            subtotal={selectedServiceFee?.rawMaterialsSubtotal}
          />
          <ServiceFeeViewTableSection
            name="Actividades a Ejecutar"
            data={taskList}
            subtotal={selectedServiceFee?.taskListSubtotal}
          />
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

        <ServiceFeeViewSeccion
          name="IMPORTE TOTAL DE GASTOS"
          value={selectedServiceFee?.expensesTotalValue}
        />
        <ServiceFeeViewSeccion
          name="TALENTO ARTISTICO (UTILIDAD)"
          value={selectedServiceFee?.artisticTalentValue}
        />
        <ServiceFeeViewSeccion
          name={`PRECIO ARTISTICO(${selectedServiceFee?.artisticTalent}%)`}
          value={selectedServiceFee?.artisticTalentValue}
        />
        <ServiceFeeViewSeccion
          name={`ONAT(${selectedServiceFee.ONAT}%)`}
          value={selectedServiceFee?.ONATValue}
        />
        <ServiceFeeViewSeccion
          name={`MARGEN COMERCIAL APLICADO (${selectedServiceFee?.commercialMargin}%)`}
          value={selectedServiceFee?.commercialMarginValue}
        />

        <article className="flex justify-end pl-4 pr-4 items-center h-[39px] flex-grow bg-[#fafafa] border-solid border-[1px] border-border_light rounded-lg">
          <div className="flex w-[150px] font-bold pl-2">MN</div>
          <Divider type="vertical" />
          <div className="flex w-[150px] font-bold pl-2">USD</div>
        </article>
        <article className="flex pl-4 pr-4 items-center h-[39px] flex-grow bg-[#fafafa] border-solid border-[1px] border-border_light rounded-lg">
          <div className="flex flex-grow justify-end pr-4 font-bold">
            <h2>PRECIO DE VENTA </h2>
          </div>
          <div className="flex w-[150px] pl-2">
            ${" "}
            {selectedServiceFee?.salePrice?.toLocaleString("DE", {
              maximumFractionDigits: 2,
              minimumFractionDigits: 2
            })}
          </div>
          <Divider type="vertical" />
          <div className="flex w-[150px] pl-2">
            ${" "}
            {selectedServiceFee?.salePriceUSD?.toLocaleString("DE", {
              maximumFractionDigits: 2,
              minimumFractionDigits: 2
            })}
          </div>
        </article>
        <SalePriceViewSeccion
          name="PRECIO DE VENTA COMPLEJIDAD ALTA "
          value={selectedServiceFee?.complexity?.find((complexity) => complexity.name === "Alta")}
        />
        <SalePriceViewSeccion
          name="PRECIO DE VENTA COMPLEJIDAD MEDIA"
          value={selectedServiceFee?.complexity?.find((complexity) => complexity.name === "Media")}
        />
        <SalePriceViewSeccion
          name="PRECIO DE VENTA COMPLEJIDAD BAJA "
          value={selectedServiceFee?.complexity?.find((complexity) => complexity.name === "Baja")}
        />
      </section>
    </>
  );
};

export const ServiceFeeViewSeccion = (props: any) => {
  const { name, value } = props;
  return (
    <article className="flex items-center pr-4 h-[39px] bg-[#fafafa] border-solid border-[1px] border-border_light rounded-lg">
      <div className="flex flex-1 justify-end pr-4 font-bold">
        <h2>{name}: </h2>
      </div>
      <div className="flex w-[150px] pl-2">
        $ {value?.toLocaleString("DE", { maximumFractionDigits: 2, minimumFractionDigits: 2 })}
      </div>
    </article>
  );
};

export const SalePriceViewSeccion = (props: any) => {
  const { name, value } = props;
  return (
    <article className="flex pl-4 pr-4 items-center h-[39px] flex-grow bg-[#fafafa] border-solid border-[1px] border-border_light rounded-lg">
      <div className="flex flex-grow justify-end pr-4 font-bold">
        <h2>{name}: </h2>
      </div>
      <div className="flex w-[150px] pl-2">
        ${" "}
        {value?.value?.toLocaleString("DE", { maximumFractionDigits: 2, minimumFractionDigits: 2 })}
      </div>
      <Divider type="vertical" />
      <div className="flex w-[150px] pl-2">
        ${" "}
        {value?.USDValue?.toLocaleString("DE", {
          maximumFractionDigits: 2,
          minimumFractionDigits: 2
        })}
      </div>
    </article>
  );
};

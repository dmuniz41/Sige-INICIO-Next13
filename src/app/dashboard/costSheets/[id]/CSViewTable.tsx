import { ICostSheetSubitem } from "@/models/costSheet";
import React, { useMemo } from "react";

export const CSViewTable = (props: any) => {

  const { data, label }: { data: ICostSheetSubitem[]; label: string } = props;
  let row: ICostSheetSubitem[] = useMemo(() => data, [data]);
  console.log("🚀 ~ file: CSViewTable.tsx:5 ~ CSViewTable ~ data:", data);
  return (
    <article className="flex flex-row w-full ">
      <div className=" flex items-center justify-center w-[30%]">
        <label className="font-bold">{label}</label>
      </div>
      <div className="w-full">
        <table className=" flex flex-col w-full">
          <tr className="flex w-full">
            <th className="w-[50%]">Descripción</th>
            <th className="w-[30%]">Unidad de Medida</th>
            <th className="w-[30%]">Cantidad</th>
            <th className="w-[30%]">Precio CUP</th>
            <th className="w-[30%]">Importe CUP</th>
          </tr>
          {row ? (
            row.map((row: any) => (
              <tr className="flex w-full" key={row.description}>
                <td className="w-[50%]">{row.description}</td>
                <td className="w-[30%] text-center">{row.unitMeasure}</td>
                <td className="w-[30%] text-center">{row.amount}</td>
                <td className="w-[30%] text-center">{row.price}</td>
                <td className="w-[30%] text-center">{row.value}</td>
              </tr>
            ))
          ) : (
            <tr className="flex w-full" key={'1'}>
                <td className="w-[50%]"></td>
                <td className="w-[30%] text-center"></td>
                <td className="w-[30%] text-center"></td>
                <td className="w-[30%] text-center"></td>
                <td className="w-[30%] text-center"></td>
              </tr>
          )}
        </table>
      </div>
    </article>
  );
};

import { ICostSheetSubitem } from "@/models/costSheet";
import React, { useMemo } from "react";

export const CSViewTable = (props: any) => {

  const { data, label }: { data: ICostSheetSubitem[]; label: string } = props;
  let row: ICostSheetSubitem[] = useMemo(() => data, [data]);
  console.log("🚀 ~ file: CSViewTable.tsx:5 ~ CSViewTable ~ data:", data);
  return (
    <article className="flex flex-row w-full mt-2 ">
      <div className=" flex items-center justify-center w-[30%] ">
        <label className="font-bold">{label}</label>
      </div>
      <div className="p-2 w-full">
        <table className=" flex flex-col w-full border">
          <tr className="flex w-full ">
            <th className="w-[50%] bg-background_light border-r">Descripción</th>
            <th className="w-[30%] bg-background_light border-r">Unidad de Medida</th>
            <th className="w-[30%] bg-background_light border-r">Cantidad</th>
            <th className="w-[30%] bg-background_light border-r">Precio CUP</th>
            <th className="w-[30%] bg-background_light">Importe CUP</th>
          </tr>
          {row ? (
            row.map((row: any) => (
              <tr className="flex w-full" key={row.description}>
                <td className="w-[50%] pl-1 border-t border-r">{row.description}</td>
                <td className="w-[30%] border-t border-r text-center">{row.unitMeasure}</td>
                <td className="w-[30%] border-t border-r text-center">{row.amount}</td>
                <td className="w-[30%] border-t border-r text-center">{row.price}</td>
                <td className="w-[30%] border-t text-center">{row.value}</td>
              </tr>
            ))
          ) : (
            <tr className="flex w-full" key={'1'}>
                <td className="w-[50%] border-r"></td>
                <td className="w-[30%] border-r text-center"></td>
                <td className="w-[30%] border-r text-center"></td>
                <td className="w-[30%] border-r text-center"></td>
                <td className="w-[30%] border-r text-center"></td>
              </tr>
          )}
        </table>
      </div>
    </article>
  );
};

import { ICostSheetSubitem } from "@/models/costSheet";
import React, { useMemo } from "react";

export const CSViewTable = (props: any) => {
  const { data, label, subtotal }: { data: ICostSheetSubitem[]; label: string; subtotal: number } = props;
  let row: ICostSheetSubitem[] = useMemo(() => data, [data]);
  return (
    <article className="flex flex-row w-full mt-1">
      <div className="p-2 w-full">
        <table className=" flex flex-row w-full border rounded-sm">
          <th className="w-[15%] flex justify-center items-center bg-background_light border-r">{label}</th>
          <div className="flex flex-col w-full ">
            <tr className="flex w-full ">
              <th className="w-[50%] bg-background_light border-r">Descripción</th>
              <th className="w-[20%] bg-background_light border-r">Unidad de Medida</th>
              <th className="w-[10%] bg-background_light border-r">Cantidad</th>
              <th className="w-[10%] bg-background_light border-r">Precio CUP</th>
              <th className="w-[10%] bg-background_light">Importe CUP</th>
            </tr>
            {row ? (
              row.map((row: any) => (
                <tr className="flex w-full" key={row.description}>
                  <article className="w-[50%] break-words pl-1 border-t border-r">{row.description}</article>
                  <td className="w-[20%] break-words border-t border-r text-center">{row.unitMeasure}</td>
                  <td className="w-[10%] border-t border-r text-center">{row.amount}</td>
                  <td className="w-[10%] border-t border-r text-center">${(row.price*1).toFixed(2)}</td>
                  <td className="w-[10%] border-t text-center">${(row.value*1).toFixed(2)}</td>
                </tr>
              ))
            ) : (
              <tr className="flex w-full" key={"1"}>
                <td className="w-[50%] border-r"></td>
                <td className="w-[20%] border-r text-center"></td>
                <td className="w-[10%] border-r text-center"></td>
                <td className="w-[10%] border-r text-center"></td>
                <td className="w-[10%] border-r text-center"></td>
              </tr>
            )}
            <tr className="flex justify-start bg-background_light pl-2 gap-2 w-full border-t" key={"2"}>
              <div className="flex justify-between w-full">
              <strong className="flex-1">Subtotal:</strong>
              <span className="w-[10%] justify-center flex font-bold">${(subtotal*1).toFixed(2)}</span>
              </div>
            </tr>
          </div>
        </table>
      </div>
    </article>
  );
};

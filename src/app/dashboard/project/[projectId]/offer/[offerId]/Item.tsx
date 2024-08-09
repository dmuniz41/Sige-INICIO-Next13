import { IOfferItem } from "@/models/offer";
import React from "react";
import { ActivitiesTable } from "./ActivitiesTable";

export const Item = (props: any) => {
  const { number, item }: { number: number; item: IOfferItem } = props;
  return (
    <article className="flex w-full border-solid border rounded border-border_light">
      <div className=" flex text-md font-semibold items-center justify-center w-[50px] border-r bg-background_light border-border_light">
        <span>{number}</span>
      </div>
      <div className="grid w-full">
        <div className="flex border-b pl-2 w-full bg-background_light border-border_light">
          <div className="p-2 grow border-border_light font-semibold">{item?.description}</div>
          <div className="font-semibold items-center p-2 w-[160px] justify-center flex">
            ${" "}
            {item?.value?.toLocaleString("DE", {
              maximumFractionDigits: 2,
              minimumFractionDigits: 2
            })}
          </div>
        </div>
        <div className="rounded-none bg-background_light">
          <ActivitiesTable activities={item?.activities} />
        </div>
      </div>
    </article>
  );
};

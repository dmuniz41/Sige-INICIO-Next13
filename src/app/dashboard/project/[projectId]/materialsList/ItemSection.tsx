import Title from "antd/es/typography/Title";
import { ActivitiesSection } from "./ActivitiesSection";

interface IItemsListProps {
  itemId: string;
  itemDescription: string;
  activities: {
    description: string;
    amount: number;
    materials: any[];
  }[];
}

export const ItemSection = ({
  item,
  index
}: {
  item: IItemsListProps;
  index: number;
}) => {
  return (
    <section className="mb-2 border border-solid p-4 border-background_light rounded-md shadow-md">
      <div className="">
        <div className="text-2xl mb-2 font-bold">
          <span>
            No.{index + 1}: {item.itemDescription}
          </span>
        </div>
        <div className="bg-dark h-[1px] mb-1"></div>
      </div>
      <ActivitiesSection activities={item.activities} />
    </section>
  );
};

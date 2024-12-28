import Title from "antd/es/typography/Title";
import { ActivitiesSection } from "./ActivitiesSection";

export const ItemSection = ({
  item
}: {
  item: {
    itemId: string;
    itemDescription: string;
    activities: { description: string; amount: number; materials: any[] }[];
  };
}) => {
  return (
    <section className=" mb-2 rounded-md p-4">
      <Title level={3}>{item.itemDescription}</Title>
      <div className="bg-dark h-[1px] mb-2"></div>
      <ActivitiesSection activities={item.activities} />
    </section>
  );
};

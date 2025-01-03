import Title from "antd/es/typography/Title";
import { MaterialsSection } from "./MaterialsSection";

export const ActivitiesSection = ({
  activities
}: {
  activities: { description: string; amount: number; materials: any[] }[];
}) => {
  return (
    <section className="mb-4">
      {activities.map((activity, index) => (
        <div key={index}>
          <Title level={4} className="mt-4">
            <span className="font-bold">Actividad:</span> {activity.description}
          </Title>
          <MaterialsSection key={index} materials={activity.materials} />
        </div>
      ))}
    </section>
  );
};

import { Schema, Model, model, models } from "mongoose";

export interface IServiceFeeTask {
  amount: number;
  category: string;
  description: string;
  price: number;
  unitMeasure: string;
  value: number;

  complexity: {
    levels: [
      {
        name: "Alta";
        coefficient: number;
      },
      {
        name: "Media";
        coefficient: number;
      },
      {
        name: "Baja";
        coefficient: number;
      }
    ];
  };
}

export const ServiceFeeTaskSchema = new Schema<IServiceFeeTask, Model<IServiceFeeTask>>({
  amount: {
    type: Number,
  },
  category: {
    type: String,
  },
  description: {
    type: String,
  },
  price: {
    type: Number,
  },
  unitMeasure: {
    type: String,
  },
  value: {
    type: Number,
  },
});

const ServiceFeeTask = models.ServiceFeeTask || model("ServiceFeeTask", ServiceFeeTaskSchema);

export default ServiceFeeTask;

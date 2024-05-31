import { Schema, Model, model, models } from "mongoose";

export interface IServiceFeeTask {
  _id: string;
  amount: number;
  category: string;
  description: string;
  // price: number;
  unitMeasure: string;
  key?: string;
  complexity: IServiceFeeTaskComplexity[];
}

export interface IServiceFeeTaskComplexity {
  name: "Alta" | "Media" | "Baja";
  value: number;
  time: number;
}

export const ServiceFeeTaskSchema = new Schema<IServiceFeeTask, Model<IServiceFeeTask>>({
  amount: {
    type: Number
  },
  key: {
    type: String
  },
  category: {
    type: String
  },
  description: {
    type: String,
    required: true,
    unique: true
  },
  // price: {
  //   type: Number,
  // },
  complexity: [
    {
      name: String,
      value: Number,
      time: Number
    }
  ],
  unitMeasure: {
    type: String
  }
});

const ServiceFeeTask = models.ServiceFeeTask || model("ServiceFeeTask", ServiceFeeTaskSchema);

export default ServiceFeeTask;

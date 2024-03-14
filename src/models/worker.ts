import { Model, Schema, Types, model, models } from "mongoose";

export interface IWorker {
  _id: string;
  key: string;
  name: string;
  CI: number;
  role: string[];
  address?: string;
  phoneNumber: number;
  bankAccount?: number;
  taxes?: number;
}

const WorkerSchema = new Schema<IWorker, Model<IWorker>>({
  key: {
    type: String
  },
  name: {
    type: String,
    required: true,
    unique: true
  },
  CI: {
    type: Number,
    required: true,
    unique: true
  },
  role: {
    type: [String],
    required: true
  },
  address: {
    type: String
  },
  phoneNumber: {
    type: Number,
    required: true
  },
  bankAccount: {
    type: Number
  }
});

const Worker = models.Worker || model("Worker", WorkerSchema);
export default Worker;

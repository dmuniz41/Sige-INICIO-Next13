import { Schema, Model ,model, models, Types } from "mongoose";

export interface IOperation {
  date: string;
  type: string;
  amount: number;
}

const OperationSchema = new Schema<IOperation, Model<IOperation>>({
  date: { type: String },
  type: { type: String },
  amount: { type: Number },
});

const Operation = models. Operation|| model("Operation", OperationSchema);

export default Operation
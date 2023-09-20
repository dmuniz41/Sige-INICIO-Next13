import { Schema, Model, model, models } from "mongoose";

export interface IOperation {
  date: string;
  tipo: string;
  amount: number;
}

const OperationSchema = new Schema<IOperation, Model<IOperation>>({
  date: { type: String },
  tipo: { type: String },
  amount: { type: Number },
});

const Operation = models.Operation || model("Operation", OperationSchema);

export default Operation;

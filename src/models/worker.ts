import { Model, Schema, Types, model, models } from "mongoose";

interface IWorker {
  key         : string,
  name        : string,
  CI          : number,
  role        : string[],
  address?    : string,
  phoneNumber : number,
  bankAccount?: number,
  // salary?     : number,
  taxes?      : number
}

const WorkerSchema = new Schema<IWorker, Model<IWorker>>({
  key: {
    type: String,
  },
  name: {
    type: String,
    required: [true, "El nombre es requerido"],
    unique: true,
  },
  CI: {
    type: Number,
    required: [true, "El carnet de identidad es requerido"],
    unique: true,
  },
  role: {
    type: [String],
    required: [true, "El cargo es requerido"],
  },
  address: {
    type: String,
  },
  phoneNumber: {
    type: Number,
    required: [true, "El número de teléfono es requerido"],
  },
  bankAccount: {
    type: Number,
  },
  // salary: {
  //   type: Number,
  // },
  // taxes: {
  //   type: Number,
  // },
});

const Worker = models.Worker || model("Worker", WorkerSchema);
export default Worker;

import { Model, Schema, Types, model, models } from "mongoose";
import { IOperation } from "./operation";

export interface IMaterial {
  code: string;
  key: string;
  materialName: string;
  enterDate: string;
  category: string;
  costPerUnit: number;
  unitsTotal: number;
  minimumExistence: number;
  unitMeasure?: string;
  operations?: Types.DocumentArray<IOperation>;
}

const MaterialSchema = new Schema<IMaterial, Model<IMaterial>>({
  code: {
    type: String,
    unique: true,
  },
  key: {
    type: String,
  },
  materialName: {
    type: String,
    required: [true, "El nombre del material es requerido"],
  },
  category: {
    type: String,
    required: [true, "La categoría del material es requerida"],
  },
  enterDate: {
    type: String,
  },
  unitMeasure: {
    type: String,
  },
  costPerUnit: {
    type: Number,
    required: [true, "El costo del material es requerido"],
  },
  unitsTotal: {
    type: Number,
    required: [true, "El total de unidades del material es requerido"],
  },
  minimumExistence: {
    type: Number,
    required: [true, "La existencia mínima es requerida"],
  },
  operations: [
    {
      date: String,
      tipo: String,
      amount: Number,
    },
  ],
});

const Material = models.Material || model("Material", MaterialSchema);

export default Material;

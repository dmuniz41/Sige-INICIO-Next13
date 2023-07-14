import { Model, Schema, Types, model, models } from "mongoose";

// export interface IOperation {
//   date: string;
//   type: string;
//   amount: number;
// }
export interface IMaterial {
  code: string;
  key: string;
  materialName: string;
  enterDate: string;
  category: string;
  unitMeasure?: string;
  unitsTotal: number;
  costPerUnit: number;
  minimumExistence: number;
  operations?: [];
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
  operations: {
    type: [
      // {
      //   date: String,
      //   type: String,
      //   amount: Number,
      // },
    ],
  },
});

const Material = models.Material || model("Material", MaterialSchema);
export default Material;

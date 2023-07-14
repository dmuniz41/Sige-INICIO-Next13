import { Model, Schema, Types, model, models } from "mongoose";
import { IMaterial } from "./material";

interface IWarehouse {
  key: string;
  name: string;
  totalValue?: number;
  materials?: Types.DocumentArray<IMaterial>;
}

const WarehouseSchema = new Schema<IWarehouse, Model<IWarehouse>>({
  key: {
    type: String,
  },
  name: {
    type: String,
    required: [true, "El nombre del almacén es requerido"],
    unique: true,
  },
  totalValue: {
    type: Number,
  },
  materials: [
    {
      key: String,
      name: String,
      category: String,
      unitMeasure: Number,
      costPrice: Number,
      minimumExistence: Number,
    },
  ],
});

const Warehouse = models.Warehouse || model("Warehouse", WarehouseSchema);
export default Warehouse;

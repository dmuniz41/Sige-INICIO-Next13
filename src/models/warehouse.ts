import { Model, Schema, Types, model, models } from "mongoose";

export interface IWarehouse {
  _id: string;
  key: string;
  name: string;
  totalValue?: number;
}

const WarehouseSchema = new Schema<IWarehouse, Model<IWarehouse>>({
  key: {
    type: String
  },
  name: {
    type: String,
    required: [true, "El nombre del almacén es requerido"],
    unique: true
  },
  totalValue: {
    type: Number
  }
});

const Warehouse = models.Warehouse || model("Warehouse", WarehouseSchema);
export default Warehouse;

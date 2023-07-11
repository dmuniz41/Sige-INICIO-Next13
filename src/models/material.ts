import { Model, Schema, Types, model, models } from "mongoose";

export interface IMaterial {
  _id              : Types.ObjectId;
  key              : string,
  name             : string,
  category?        : string,
  unitMeasure?     : string,
  costPrice?       : number,
  minimumExistence?: number
}

const MaterialSchema = new Schema<IMaterial, Model<IMaterial>>({
  key: {
    type: String,
  },
  name: {
    type: String,
    required: [true, "El nombre del material es requerido"],
    unique: true,
  },
  category:{
    type: String,
  },
  unitMeasure:{
    type: String,
  },
  costPrice:{
    type: Number
  },
  minimumExistence:{
    type:Number
  }
});

const Material = models.Material || model("Material", MaterialSchema);
export default Material;
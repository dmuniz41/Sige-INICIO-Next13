import { Schema, model, models, Model } from "mongoose";

export interface INomenclator {
  key  : string;
  tipo : string;
  name : string;
}

const NomenclatorSchema = new Schema<INomenclator, Model<INomenclator>>({
  key: {
    type: String,
    unique: true
  },
  tipo: {
    type: String,
    required: [true, "El tipo es requerido"],
  },
  name: {
    type: String,
    required: [true, "El nombre es requerido"],
  },
});

const Nomenclator = models.Nomenclator || model("Nomenclator", NomenclatorSchema);
export default Nomenclator;

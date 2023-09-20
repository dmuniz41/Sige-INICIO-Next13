import { Schema, model, models, Model } from "mongoose";

export interface INomenclator {
  key      : string;
  category : string;
  code     : string;
}

const NomenclatorSchema = new Schema<INomenclator, Model<INomenclator>>({
  key: {
    type: String,
    unique: true
  },
  category: {
    type: String,
    required: [true, "El tipo es requerido"],
  },
  code: {
    type: String,
    required: [true, "El nombre es requerido"],
  },
});

const Nomenclator = models.Nomenclator || model("Nomenclator", NomenclatorSchema);
export default Nomenclator;

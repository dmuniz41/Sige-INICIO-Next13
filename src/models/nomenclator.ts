import { Schema, model, models, Model } from "mongoose";

export interface INomenclator {
  _id: string;
  key: string;
  category: string;
  code: string;
  value?: number;
}

const NomenclatorSchema = new Schema<INomenclator, Model<INomenclator>>({
  key: {
    type: String,
    unique: true
  },
  category: {
    type: String,
    required: [true, "El tipo es requerido"]
  },
  code: {
    type: String,
    required: [true, "El nombre es requerido"]
  },
  value: {
    type: Number,
    required: false
  }
});

const Nomenclator = models.Nomenclator || model("Nomenclator", NomenclatorSchema);
export default Nomenclator;

import { Schema, model, models, Types, Model } from "mongoose";

interface INomenclator {
  key         : string;
  code        : string;
  name        : string;
  description?: string;
}

const NomenclatorSchema = new Schema<INomenclator, Model<INomenclator>>({
  key: {
    type: String,
  },
  code: {
    type: String,
    required: [true, "El código es requerido"],
    unique: true,
  },
  name: {
    type: String,
    required: [true, "El nombre es requerido"],
    unique: true,
  },
  description: {
    type: String,
    required: [true, "La descripción es requerida"],
  },
});

const Nomenclator = models.Nomenclator || model("Nomenclator", NomenclatorSchema);
export default Nomenclator;

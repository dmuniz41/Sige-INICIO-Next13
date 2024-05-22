import { Schema, model, models, Model } from "mongoose";

export interface IMaterialNomenclator {
  _id: string;
  key: string;
  name: string;
  // ?TRUE SI EL MATERIAL ES CONSIDERADO GASTABLE POR LO QUE SE MUTIPLICA SU PRECIO POR EL COEFICIENTE DE MERMA EN LA FICHA DE COSTO ?//
  isDecrease: boolean;
}

const MaterialNomenclatorSchema = new Schema<IMaterialNomenclator, Model<IMaterialNomenclator>>({
  key: {
    type: String,
    unique: true
  },
  name: {
    type: String,
    required: [true, "La categoría es requerida"]
  },
  isDecrease: {
    type: Boolean,
    required:[true, "Es necesario indicar si es gastable o no"]
  }
});

const MaterialNomenclator =
  models.MaterialNomenclator || model("MaterialNomenclator", MaterialNomenclatorSchema);
export default MaterialNomenclator;

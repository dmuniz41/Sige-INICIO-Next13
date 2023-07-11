import { Schema, model, models } from "mongoose";

const NomenclatorSchema = new Schema({
  key: {
    type: String
  },
  code: {
    type: String,
    required: [true, 'El código es requerido'],
    unique: true,
  },
  name: {
    type: String,
    required: [true, 'El nombre es requerido'],
    unique: true,
  },
  description: {
    type: String,
    required: [true, 'La descripción es requerida'],
  }
});

const Nomenclator = models.Nomenclator || model('Nomenclator', NomenclatorSchema)
export default Nomenclator
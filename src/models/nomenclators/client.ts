import { Schema, model, models, Model } from "mongoose";

export interface IClientNomenclator {
  _id: string;
  address?: string;
  email?: string;
  idNumber: number;
  key: string;
  name: string;
  phoneNumber?: number;
  contactPerson?: string
}

const ClientNomenclatorSchema = new Schema<IClientNomenclator, Model<IClientNomenclator>>({
  key: {
    type: String,
    unique: true
  },
  name: {
    type: String,
    required: true,
    unique: true
  },
  address: {
    type: String,
    required: false
  },
  email: {
    type: String,
    required: false
  },
  phoneNumber: {
    type: Number,
    required: false
  },
  idNumber: {
    type: Number,
    required: true,
    unique: true
  },
  contactPerson: {
    type: String,
    required: true,
    unique: false
  }
});

const ClientNomenclator = models.ClientNomenclator || model("ClientNomenclator", ClientNomenclatorSchema);
export default ClientNomenclator;

import { message } from "antd";
import { Schema, model, models, Model } from "mongoose";

export interface IClientNomenclator {
  _id: string;
  address?: string;
  email?: string;
  idNumber: number
  key: string;
  name: string;
  phoneNumber?: number;
}

const ClientNomenclatorSchema = new Schema<IClientNomenclator, Model<IClientNomenclator>>({
  key: {
    type: String,
    unique: true
  },
  name: {
    type: String,
    required: true,
    unique: true,
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
  }
});

const ClientNomenclator = models.ClientNomenclator || model("ClientNomenclator", ClientNomenclatorSchema);
export default ClientNomenclator;

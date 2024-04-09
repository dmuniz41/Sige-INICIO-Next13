import { Schema, model, models, Model } from "mongoose";

export interface IRepresentativeNomenclator {
  _id: string;
  address?: string;
  email?: string;
  idNumber: number
  key: string;
  name: string;
  phoneNumber?: number[];
  contactPerson: string;
  percentage: number
} 

const RepresentativeNomenclatorSchema = new Schema<IRepresentativeNomenclator, Model<IRepresentativeNomenclator>>({
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
    type: [Number],
    required: false
  },
  idNumber: {
    type: Number,
    required: true,
    unique: true
  },
  percentage: {
    type: Number,
    required: true,
    unique: false
  },
  contactPerson: {
    type: String,
    required: true,
    unique: false
  },
  
});

const RepresentativeNomenclator = models.ClientNomenclator || model("RepresentativeNomenclator", RepresentativeNomenclatorSchema);
export default RepresentativeNomenclator;

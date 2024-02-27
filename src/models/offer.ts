import { Schema, model, models, Model } from "mongoose";

export interface IActivity {
  amount: number;
  description: string;
  price: number;
  unitMeasure: string;
  value: number;
}

export interface IItem {
  description: string;
  activities: IActivity[];
  value: number;
}

export interface IOffer {
  _id: string;
  itemsList: IItem[];
  key: string;
  name: string;
  projectName: string;
  projectId: string;
  value?: number;
}

const OfferSchema = new Schema<IOffer, Model<IOffer>>({
  key: {
    type: String,
    unique: true,
  },
  itemsList: {
    type: [
      {
        description: String,
        activities: [
          {
            amount: Number,
            description: String,
            unitMeasure: String,
            price: Number,
            value: Number,
          },
        ],
        value: Number,
      },
    ],
    required: false,
  },
  projectName: {
    type: String,
    required: true,
    unique: true,
  },
  projectId: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
    unique: true,
  },
  value: {
    type: Number,
    required: false,
  },
});

const Offer = models.Offer || model("Offer", OfferSchema);
export default Offer;

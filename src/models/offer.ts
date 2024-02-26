import { Schema, model, models, Model } from "mongoose";

export interface IActivity {
  description: string;
  unitMeasure: string;
  price: number;
  value: number;
}

export interface IItem {
  description: string;
  activities: IActivity[];
}

export interface IOffer {
  _id: string;
  itemsList: IItem[];
  key: string;
  name: string;
  projectName: string;
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
            description: String,
            unitMeasure: String,
            price: Number,
            value: Number,
          },
        ],
      },
    ],
    required: false
  },
  projectName: {
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

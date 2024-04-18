import { Schema, model, models, Model } from "mongoose";

export interface IActivity {
  _id: string
  amount: number;
  description: string;
  price: number;
  unitMeasure: string;
  value: number;
}
export interface IOfferItem {
  _id: string;
  description: string;
  activities: IActivity[];
  value: number;
}
export interface IOffer {
  _id: string;
  itemsList: IOfferItem[];
  key: string;
  materialsList?: { description: string; amount: number; unitMeasure: string }[];
  projectId: string;
  projectName: string;
  value?: number;
  isFinalOffer?: boolean;
  representationPercentage: number;
  representativeName: string;
}

const OfferSchema = new Schema<IOffer, Model<IOffer>>({
  key: {
    type: String,
    unique: true
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
            value: Number
          }
        ],
        value: Number
      }
    ],
    required: false
  },
  materialsList: {
    type: [
      {
        description: String,
        amount: Number,
        unitMeasure: String
      }
    ],
    required: false
  },
  projectName: {
    type: String,
    required: true
  },
  projectId: {
    type: String,
    required: true
  },
  representativeName: {
    type: String,
    required: true
  },
  value: {
    type: Number,
    required: false
  },
  isFinalOffer: {
    type: Boolean,
    required: false
  },
  representationPercentage: {
    type: Number,
    required: true
  }
});

const Offer = models.Offer || model("Offer", OfferSchema);
export default Offer;

import { Schema, model, models, Model } from "mongoose";
import { IRepresentationCoefficients } from "./serviceFeeAuxiliary";

export interface IActivity {
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
  materialsList?: { description: string; amount: number }[];
  projectId: string;
  projectName: string;
  value?: number;
  isFinalOffer?: boolean;
  representationCoef: IRepresentationCoefficients;
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
        amount: Number
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
  value: {
    type: Number,
    required: false
  },
  isFinalOffer: {
    type: Boolean,
    required: false
  },
  representationCoef: {
    type: {
      representative: String,
      coefficientValue: Number
    },
    required: true
  }
});

const Offer = models.Offer || model("Offer", OfferSchema);
export default Offer;

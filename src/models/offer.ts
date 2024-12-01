import { Schema, model, models, Model } from "mongoose";

export interface IActivity {
  itemId: string;
  amount: number;
  description: string;
  price: number;
  unitMeasure: string;
  pricePerRepresentative: [
    {
      representativeName: string;
      price: number;
      priceUSD: number;
    }
  ];
  value: number;
  size?: number;
  width?: number;
  height?: number;
  listOfMeasures: {
    amount: number;
    description: string;
    height: number;
    unitMeasure: string;
    width: number;
  }[];
}
export interface IOfferItem {
  offerId: string;
  idNumber?: number;
  key: string;
  description: string;
  activities: IActivity[];
  value: number;
}
export interface IOffer {
  _id: string;
  itemsList: IOfferItem[];
  key: string;
  materialsList?: { itemId: string; description: string; amount: number; unitMeasure: string }[];
  projectId: string;
  projectName: string;
  value?: number;
  isFinalOffer?: boolean;
  representativeName: string;
  version: string;
}

const OfferSchema = new Schema<IOffer, Model<IOffer>>({
  key: {
    type: String,
    unique: true
  },
  itemsList: {
    type: [
      {
        offerId: String,
        idNumber: Number,
        key: String,
        description: String,
        activities: [
          {
            itemId: String,
            amount: Number,
            pricePerRepresentative: [
              {
                representativeName: String,
                price: Number,
                priceUSD: Number
              }
            ],
            description: String,
            unitMeasure: String,
            price: Number,
            value: Number,
            size: Number,
            width: Number,
            height: Number,
            listOfMeasures: [
              {
                amount: Number,
                description: String,
                height: Number,
                unitMeasure: String,
                width: Number
              }
            ]
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
        itemId: String,
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
  version: {
    type: String,
    required: false
  }
});

const Offer = models.Offer || model("Offer", OfferSchema);
export default Offer;

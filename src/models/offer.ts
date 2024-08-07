import { Schema, model, models, Model } from "mongoose";

export interface IActivity {
  amount: number;
  description: string;
  price: number;
  unitMeasure: string;
  // complexity: "Alta" | "Media" | "Baja";
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
  materialsList?: { description: string; amount: number; unitMeasure: string }[];
  projectId: string;
  projectName: string;
  value?: number;
  isFinalOffer?: boolean;
  // representationPercentage: number;
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
        idNumber: Number,
        key: String,
        description: String,
        activities: [
          {
            amount: Number,
            // complexity: String,
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
  // representationPercentage: {
  //   type: Number,
  //   required: true
  // },
  version: {
    type: String,
    required: false
  }
});

const Offer = models.Offer || model("Offer", OfferSchema);
export default Offer;

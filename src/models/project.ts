import { Schema, model, models, Model } from "mongoose";
import { IOfferItem } from "./offer";

export interface IItem {
  description: string;
}

export interface IProject {
  _id: string;
  clientName: string;
  clientNumber: number;
  currency: string;
  deliveryDate: string;
  expenses: number;
  finalOfferId: string
  initDate: string;
  itemsList: IOfferItem[];
  key: string;
  payMethod: string;
  profits: number;
  projectName: string;
  projectNumber: string;
  status: string;
  totalValue: number;
}

const ProjectSchema = new Schema<IProject, Model<IProject>>({
  key: {
    type: String,
    unique: true
  },
  clientNumber: {
    type: Number,
    required: true
  },
  clientName: {
    type: String,
    required: true
  },
  projectName: {
    type: String,
    required: true,
    unique: true
  },
  payMethod: {
    type: String,
    required: false,
    default: ""
  },
  currency: {
    type: String,
    required: true
  },
  initDate: {
    type: String,
    required: true
  },
  finalOfferId: {
    type: String,
    required: false,
    default: ""
  },
  deliveryDate: {
    type: String
  },
  projectNumber: {
    type: String
  },
  itemsList: {
    type: [
      {
        description: String,
        activities: [
          {
            amount: Number,
            complexity: String,
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
  status: {
    type: String
  },
  expenses: {
    type: Number
  },
  profits: {
    type: Number
  },
  totalValue: {
    type: Number
  }
});

const Project = models.Project || model("Project", ProjectSchema);
export default Project;

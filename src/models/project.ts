import { Schema, model, models, Model } from "mongoose";

export interface IItem {
  key: string;
  idNumber: number;
  description: string;
}

export interface IProject {
  _id: string;
  clientName: string;
  clientNumber: number;
  currency: string;
  deliveryDate: string;
  expenses: number;
  finalOfferId?: string
  initDate: string;
  itemsList: IItem[];
  key: string;
  payMethod?: string;
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
    required: false
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
    required: String
  },
  deliveryDate: {
    type: String
  },
  projectNumber: {
    type: String
  },
  itemsList: [
    {
      key: String,
      idNumber: Number,
      description: String
    }
  ],
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

import { IOfferItem } from "@/models/offer";
import { Schema, model, models, Model } from "mongoose";

export interface IProjectMaterialsDischarge {
  projectId: string;
  projectName: string;
  itemsList: IOfferItem[];
  materialsList: {
    itemId: string;
    description: string;
    amount: number; // CANTIDAD PLANIFICADA
    amountReal: number; // CANTIDAD REAL GASTADA
    unitMeasure: string;
  }[];
  totalValue: number; // VALOR TOTAL PLANIFICADO
  totalCost: number; // VALOR TOTAL REAL GASTADO
}

const ProjectMaterialsDischargeSchema = new Schema<
  IProjectMaterialsDischarge,
  Model<IProjectMaterialsDischarge>
>({
  projectId: {
    type: String,
    required: true
  },
  projectName: {
    type: String,
    required: true
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
  materialsList: {
    type: [
      {
        itemId: String,
        description: String,
        amount: Number, // CANTIDAD PLANIFICADA
        amountReal: Number, // CANTIDAD REAL GASTADA
        unitMeasure: String
      }
    ],
    required: false
  },
  totalValue: {
    type: Number
  },
  totalCost: {
    type: Number
  }
});

const ProjectMaterialsDischarge =
  models.ProjectMaterialsDischarge ||
  model("ProjectMaterialsDischarge", ProjectMaterialsDischargeSchema);
export default ProjectMaterialsDischarge;

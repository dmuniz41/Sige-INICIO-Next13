import { Schema, model, models, Model } from "mongoose";
export interface IDischargeMaterials {
  offerId: string;
  updatedAt: Date;
  materials: IDischargeMaterialsList[];
}

export interface IDischargeMaterialsList {
  description: string;
  amount: number;
  amountReal: number;
  difference: number;
  unitMeasure: string;
}

const DischargeMaterialsSchema = new Schema<
  IDischargeMaterials,
  Model<IDischargeMaterials>
>({
  offerId: {
    type: String
  },
  updatedAt: {
    type: Date
  },
  materials: {
    type: [
      {
        description: String,
        amount: Number,
        amountReal: Number,
        difference: Number,
        unitMeasure: String
      }
    ]
  }
});

const DischargeMaterials =
  models.DischargeMaterials ||
  model("DischargeMaterials ", DischargeMaterialsSchema);
export default DischargeMaterials;

import { Schema, model, models, Model } from "mongoose";

export interface IExpensesDischarge {
  offerId: string;
  updatedAt: Date;
  materials: IExpensesDischargeMaterials[];
  totalValue: number;
  totalCost: number;
  totalDifference: number;
}

export interface IExpensesDischargeMaterials {
  description: string;
  amount: number;
  amountReal: number;
  difference: number;
  unitMeasure: string;
}

const ExpensesDischargeSchema = new Schema<
  IExpensesDischarge,
  Model<IExpensesDischarge>
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
  },
  totalValue: {
    type: Number
  },
  totalCost: {
    type: Number
  },
  totalDifference: {
    type: Number
  }
});

const ExpensesDischarge =
  models.ExpensesDischarge ||
  model("ExpensesDischarge", ExpensesDischargeSchema);
export default ExpensesDischarge;

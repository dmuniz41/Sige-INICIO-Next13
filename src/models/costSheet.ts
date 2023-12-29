import { Model, Schema, model, models } from "mongoose";

export interface ICostSheetSubitem {
  description: string;
  unitMeasure?: string;
  amount: number;
  price: number;
  value: number;
}
export interface ICostSheet {

  _id: string;
  administrativeExpenses: ICostSheetSubitem[];
  administrativeExpensesSubtotal: number;
  approvedBy: string;
  artisticTalent: number;
  artisticTalentValue: number;
  costsTotalValue: number;
  createdBy: string;
  creatorPrice: number;
  description: string;
  directSalaries: ICostSheetSubitem[];
  directSalariesSubtotal: number;
  expensesAndCostsTotalValue: number;
  expensesTotalValue: number;
  financialExpenses: ICostSheetSubitem[];
  financialExpensesSubtotal: number;
  key: string;
  nomenclatorId: string;
  otherDirectExpenses: ICostSheetSubitem[];
  otherDirectExpensesSubtotal: number;
  payMethod: "CASH" | "CONTRACT";
  productionRelatedExpenses: ICostSheetSubitem[];
  productionRelatedExpensesSubtotal: number;
  rawMaterials: ICostSheetSubitem[];
  rawMaterialsByClient: number;
  rawMaterialsSubtotal: number;
  representationCost: number;
  representationCostValue: number;
  salePrice: number;
  salePriceMLC: number;
  salePriceMN: number;
  taskName: string;
  taxExpenses: ICostSheetSubitem[];
  taxExpensesSubtotal: number;
  transportationExpenses: ICostSheetSubitem[];
  transportationExpensesSubtotal: number;
  USDValue: number;
  workersAmount: number;
}

const CostSheetSchema = new Schema<ICostSheet, Model<ICostSheet>>({
  key: {
    type: String,
    unique: true,
  },
  payMethod: {
    type: String,
    required: [true, "La forma de cobro es requerida"],
  },
  taskName: {
    type: String,
    unique: true,
    required: [true, "El nombre de la tarea a ejecutar es requerida"],
  },
  description: {
    type: String,
    unique: true,
    required: [true, "La descripcion de la tarea a ejecutar es requerida"],
  },
  createdBy: {
    type: String,
  },
  approvedBy: {
    type: String,
  },
  nomenclatorId: {
    unique: true,
    type: String,
  },
  workersAmount: {
    type: Number,
  },
  USDValue: {
    type: Number,
  },
  rawMaterials: [
    {
      description: String,
      unitMeasure: String,
      amount: Number,
      price: Number,
      value: Number,
    },
  ],
  rawMaterialsSubtotal: {
    type: Number,
  },
  directSalaries: [
    {
      description: String,
      unitMeasure: String,
      amount: Number,
      price: Number,
      value: Number,
    },
  ],
  directSalariesSubtotal: {
    type: Number,
  },
  otherDirectExpenses: [
    {
      description: String,
      unitMeasure: String,
      amount: Number,
      price: Number,
      value: Number,
    },
  ],
  otherDirectExpensesSubtotal: {
    type: Number,
  },
  productionRelatedExpenses: [
    {
      description: String,
      unitMeasure: String,
      amount: Number,
      price: Number,
      value: Number,
    },
  ],
  productionRelatedExpensesSubtotal: {
    type: Number,
  },
  administrativeExpenses: [
    {
      description: String,
      unitMeasure: String,
      amount: Number,
      price: Number,
      value: Number,
    },
  ],
  administrativeExpensesSubtotal: {
    type: Number,
  },
  transportationExpenses: [
    {
      description: String,
      unitMeasure: String,
      amount: Number,
      price: Number,
      value: Number,
    },
  ],
  transportationExpensesSubtotal: {
    type: Number,
  },
  financialExpenses: [
    {
      description: String,
      unitMeasure: String,
      amount: Number,
      price: Number,
      value: Number,
    },
  ],
  financialExpensesSubtotal: {
    type: Number,
  },
  taxExpenses: [
    {
      description: String,
      unitMeasure: String,
      amount: Number,
      price: Number,
      value: Number,
    },
  ],
  taxExpensesSubtotal: {
    type: Number,
  },
  expensesTotalValue: {
    type: Number,
  },
  costsTotalValue: {
    type: Number,
  },
  expensesAndCostsTotalValue: {
    type: Number,
  },
  artisticTalent: {
    type: Number,
  },
  artisticTalentValue: {
    type: Number,
  },
  representationCost: {
    type: Number,
  },
  representationCostValue: {
    type: Number,
  },
  creatorPrice: {
    type: Number,
  },
  rawMaterialsByClient: {
    type: Number,
  },
  salePriceMLC: {
    type: Number,
  },
  salePriceMN: {
    type: Number,
  },
  salePrice: {
    type: Number,
  },
});

const CostSheet = models.CostSheet || model("CostSheet", CostSheetSchema);

export default CostSheet;

import { Model, Schema, Types, model, models } from "mongoose";

export interface ICostSheetSubitem {
  description: string;
  unitMeasure?: string;
  amount: number;
  price: number;
  value: number;
}
export interface ICostSheet {
  key: string;
  payMethod: "CASH" | "CONTRACT";
  taskName: string;
  workersAmount: number;
  // * Listado de materias primas a utilizar en la actividad
  rawMaterials: ICostSheetSubitem[];
  rawMaterialsSubtotal: Number;
  // * Listado de actividades a ejecutar para completar la actividad
  tasksList: ICostSheetSubitem[];
  tasksListSubtotal: Number;
  // * Listado de gastos por depreciación de equipos a utilizar en la actividad
  equipmentDepreciation: ICostSheetSubitem[];
  equipmentDepreciationSubtotal: Number;
  // * Listado de gastos por matenimiento de equipos a utilizar en la actividad
  equipmentMaintenance: ICostSheetSubitem[];
  equipmentMaintenanceSubtotal: Number;
  // * Listado de gastos administrativos en la actividad
  administrativeExpenses: ICostSheetSubitem[];
  administrativeExpensesSubtotal: Number;
  // * Listado de gastos por transportacion en la actividad
  transportationExpenses: ICostSheetSubitem[];
  transportationExpensesSubtotal: Number;
  // * Listado de gastos por personal contratado en la actividad
  contractedPersonalExpenses: ICostSheetSubitem[];
  contractedPersonalExpensesSubtotal: Number;
  expensesTotalValue: Number;
  artisticTalent: Number;
  artisticPrice: Number;
  ONATTaxes: Number;
  commercialMargin: Number;
  salePriceUSD: Number;
  salePriceMN: Number;

  // Materias primas y materiales aportados por el FCBC
  // PRECIO DE VENTA MAYORISTA MAXIMO
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
    required: [true, "El nombre de la tarea ejecutar es requerida"],
  },
  workersAmount: {
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
  tasksList: [
    {
      description: String,
      unitMeasure: String,
      amount: Number,
      price: Number,
      value: Number,
    },
  ],
  tasksListSubtotal: {
    type: Number,
  },
  equipmentDepreciation: [
    {
      description: String,
      unitMeasure: String,
      amount: Number,
      price: Number,
      value: Number,
    },
  ],
  equipmentDepreciationSubtotal: {
    type: Number,
  },
  equipmentMaintenance: [
    {
      description: String,
      unitMeasure: String,
      amount: Number,
      price: Number,
      value: Number,
    },
  ],
  equipmentMaintenanceSubtotal: {
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
  contractedPersonalExpenses: [
    {
      description: String,
      unitMeasure: String,
      amount: Number,
      price: Number,
      value: Number,
    },
  ],
  contractedPersonalExpensesSubtotal: {
    type: Number,
  },
  expensesTotalValue: {
    type: Number,
  },
  artisticTalent: {
    type: Number,
  },
  artisticPrice: {
    type: Number,
  },
  ONATTaxes: {
    type: Number,
  },
  commercialMargin: {
    type: Number,
  },
  salePriceUSD: {
    type: Number,
  },
  salePriceMN: {
    type: Number,
  },
});

const CostSheet = models.CostSheet || model("CostSheet", CostSheetSchema);

export default CostSheet;

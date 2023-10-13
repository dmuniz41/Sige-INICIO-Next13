import { Model, Schema, Types, model, models } from "mongoose";

export interface ICostSheet {
  name: string;
  key: string;
  taskName: string;
  workersAmount: number;
  // * Listado de materias primas a utilizar en la actividad
  rawMaterials: [
    {
      description: string;
      unitMeasure?: string;
      amount: number;
      price: number;
      value: number;
    }
  ];
  rawMaterialsSubtotal: Number;
  // * Listado de actividades a ejecutar para completar la actividad
  tasksList: [
    {
      description: string;
      unitMeasure?: string;
      amount: number;
      price: number;
      value: number;
    }
  ];
  tasksListSubtotal: Number;
  // * Listado de gastos por depreciación de equipos a utilizar en la actividad
  equipmentDepreciation: [
    {
      description: string;
      unitMeasure?: string;
      amount: number;
      price: number;
      value: number;
    }
  ];
  equipmentDepreciationSubtotal: Number;
  // * Listado de gastos por matenimiento de equipos a utilizar en la actividad
  equipmentMaintenance: [
    {
      description: string;
      unitMeasure?: string;
      amount: number;
      price: number;
      value: number;
    }
  ];
  equipmentMaintenanceSubtotal: Number;
  // * Listado de gastos administrativos en la actividad
  administrativeExpenses: [
    {
      description: string;
      unitMeasure?: string;
      amount: number;
      price: number;
      value: number;
    }
  ];
  administrativeExpensesSubtotal: Number;
  // * Listado de gastos por transportacion en la actividad
  transportationExpenses: [
    {
      description: string;
      unitMeasure?: string;
      amount: number;
      price: number;
      value: number;
    }
  ];
  transportationExpensesSubtotal: Number;
  // * Listado de gastos por personal contratado en la actividad
  contractedPersonalExpenses: [
    {
      description: string;
      unitMeasure?: string;
      amount: number;
      price: number;
      value: number;
    }
  ];
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
  name: {
    type: String,
    unique: true,
  },
  key: {
    type: String,
    unique: true,
  },
  taskName: {
    type: String,
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

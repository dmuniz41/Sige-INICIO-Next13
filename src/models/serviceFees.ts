import { Model, Schema, model, models } from "mongoose";

export interface IServiceFeeSubItem {
  // *La descripcion es Categoria + Nombre que se debe generar previamente al crear el material en el almacen
  description: string;
  unitMeasure?: string;
  amount: number;
  price: number;
  value: number;
}
export interface IServiceFeeSubItemCoefficient {
  description: string;
  coefficient: number;
  amount: number;
  value: number;
}
export interface IServiceFee {
  _id: string;
  category: string;
  nomenclatorId: string;
  key: string;
  workersAmount: number;
  taskName: string;
  payMethodCoef: number;
  currencyChange: number;
  valuePerUnitMeasure: string;
  //* MATERIAS PRIMAS
  rawMaterials: IServiceFeeSubItem[];
  rawMaterialsSubtotal: number;
  // *ACTIVIDADES O OPERACIONES
  taskList: IServiceFeeSubItemCoefficient[];
  taskListSubtotal: number;
  //*DEPRECIACION DE EQUIPOS
  equipmentDepreciation: IServiceFeeSubItemCoefficient[];
  equipmentDepreciationSubtotal: number;
  //*MANTENIMIENTO DE EQUIPOS
  equipmentMaintenance: IServiceFeeSubItemCoefficient[];
  equipmentMaintenanceSubtotal: number;
  //*GASTOS ADMINISTRATIVOS
  electricityExpense: IServiceFeeSubItemCoefficient;
  fuelExpense: IServiceFeeSubItemCoefficient;
  feedingExpense: IServiceFeeSubItemCoefficient;
  phoneExpense: IServiceFeeSubItemCoefficient;
  leaseExpense: IServiceFeeSubItemCoefficient;
  administrativeExpensesSubtotal: number;
  //*GASTOS DE TRANSPORTE
  rawMaterialsTransportationExpenses: IServiceFeeSubItemCoefficient;
  salesAndDistributionExpenses: IServiceFeeSubItemCoefficient;
  transportationExpensesSubtotal: number;
  //*GASTO DE PERSONAL CONTRATADO
  indirectSalaries: {
    coef: number;
    value: number;
  };
  subcontractExpenses: number;
  subcontractExpensesSubtotal: number;
  //*OTROS
  expensesTotalValue: number;
  artisticTalentValue: number;
  ONAT: number;
  commercialMargin: number;
  salePrice: number;
  salePriceUSD: number;
  rawMaterialsByClient: number;
  // createdBy: string;
  // currencyChange: number;
}

const ServiceFeeSchema = new Schema<IServiceFee, Model<IServiceFee>>({
  category: {
    type: String,
  },
  nomenclatorId: {
    unique: true,
    type: String,
  },
  key: {
    type: String,
    unique: true,
  },
  workersAmount: {
    type: Number,
  },
  taskName: {
    type: String,
    unique: true,
  },
  payMethodCoef: {
    type: Number,
  },
  currencyChange: {
    type: Number,
  },
  // createdBy: {
  //   type: String,
  // },
  valuePerUnitMeasure: {
    type: String,
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
  taskList: [
    {
      description: String,
      complexityCoefficient: Number,
      amount: Number,
      value: Number,
    },
  ],
  taskListSubtotal: {
    type: Number,
  },

  equipmentDepreciation: [
    {
      description: String,
      coefficient: Number,
      amount: Number,
      value: Number,
    },
  ],
  equipmentDepreciationSubtotal: {
    type: Number,
  },
  equipmentMaintenance: [
    {
      description: String,
      coefficient: Number,
      amount: Number,
      value: Number,
    },
  ],
  equipmentMaintenanceSubtotal: {
    type: Number,
  },
  fuelExpense: {
    description: String,
    coefficient: Number,
    amount: Number,
    value: Number,
  },
  feedingExpense: {
    description: String,
    coefficient: Number,
    amount: Number,
    value: Number,
  },
  electricityExpense: {
    description: String,
    coefficient: Number,
    amount: Number,
    value: Number,
  },
  leaseExpense: {
    description: String,
    coefficient: Number,
    amount: Number,
    value: Number,
  },
  phoneExpense: {
    description: String,
    coefficient: Number,
    amount: Number,
    value: Number,
  },
  rawMaterialsTransportationExpenses: {
    description: String,
    coefficient: Number,
    amount: Number,
    value: Number,
  },
  salesAndDistributionExpenses: {
    description: String,
    coefficient: Number,
    amount: Number,
    value: Number,
  },
  transportationExpensesSubtotal: {
    type: Number,
  },
  indirectSalaries: {
    coef: Number,
    value: Number,
  },
  subcontractExpenses: {
    type: Number,
  },
  subcontractExpensesSubtotal: {
    type: Number,
  },
  expensesTotalValue: {
    type: Number,
  },
  artisticTalentValue: {
    type: Number,
  },
  ONAT: {
    type: Number,
  },
  rawMaterialsByClient: {
    type: Number,
  },
  commercialMargin: {
    type: Number,
  },
  salePrice: {
    type: Number,
  },
  salePriceUSD: {
    type: Number,
  },
});

const ServiceFee = models.ServiceFee || model("ServiceFee", ServiceFeeSchema);

export default ServiceFee;

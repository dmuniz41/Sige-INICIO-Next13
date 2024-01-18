import { Model, Schema, model, models } from "mongoose";

export interface IServiceFeeSubItem {
  // * En el caso del material la descripcion es Categoria + Nombre que se debe generar previamente al crear el material en el almacen
  description: string;
  unitMeasure?: string;
  amount: number;
  price: number;
  value: number;
}
// export interface IServiceFeeSubItemCoefficient {
//   description: string;
//   amount: number;
//   coefficient: number;
//   value: number;
// }
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
  taskList: IServiceFeeSubItem[];
  taskListSubtotal: number;
  //*DEPRECIACION DE EQUIPOS
  equipmentDepreciation: IServiceFeeSubItem[];
  equipmentDepreciationSubtotal: number;
  //*MANTENIMIENTO DE EQUIPOS
  equipmentMaintenance: IServiceFeeSubItem[];
  equipmentMaintenanceSubtotal: number;
  //*GASTOS ADMINISTRATIVOS
  electricityExpense: IServiceFeeSubItem;
  fuelExpense: IServiceFeeSubItem;
  feedingExpense: IServiceFeeSubItem;
  phoneExpense: IServiceFeeSubItem;
  leaseExpense: IServiceFeeSubItem;
  administrativeExpensesSubtotal: number;
  //*GASTOS DE TRANSPORTE
  rawMaterialsTransportationExpenses: IServiceFeeSubItem;
  salesAndDistributionExpenses: IServiceFeeSubItem;
  transportationExpensesSubtotal: number;
  //*GASTO DE PERSONAL CONTRATADO
  indirectSalaries: IServiceFeeSubItem
  subcontractExpenses: IServiceFeeSubItem;
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
      unitMeasure: String,
      amount: Number,
      price: Number,
      value: Number,
    },
  ],
  taskListSubtotal: {
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
  fuelExpense: {
    description: String,
    unitMeasure: String,
    amount: Number,
    price: Number,
    value: Number,
  },
  feedingExpense: {
    description: String,
    unitMeasure: String,
    amount: Number,
    price: Number,
    value: Number,
  },
  electricityExpense: {
    description: String,
    unitMeasure: String,
    amount: Number,
    price: Number,
    value: Number,
  },
  leaseExpense: {
    description: String,
    unitMeasure: String,
    amount: Number,
    price: Number,
    value: Number,
  },
  phoneExpense: {
    description: String,
    unitMeasure: String,
    amount: Number,
    price: Number,
    value: Number,
  },
  administrativeExpensesSubtotal: {
    type: Number,
  },
  rawMaterialsTransportationExpenses: {
    description: String,
    unitMeasure: String,
    amount: Number,
    price: Number,
    value: Number,
  },
  salesAndDistributionExpenses: {
    description: String,
    unitMeasure: String,
    amount: Number,
    price: Number,
    value: Number,
  },
  transportationExpensesSubtotal: {
    type: Number,
  },
  indirectSalaries: {
    description: String,
    unitMeasure: String,
    amount: Number,
    price: Number,
    value: Number,
  },
  subcontractExpenses: {
    description: String,
    unitMeasure: String,
    amount: Number,
    price: Number,
    value: Number,
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

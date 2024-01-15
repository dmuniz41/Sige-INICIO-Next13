import { Model, Schema, model, models } from "mongoose";

export interface IServiceFeeSubItem {
  description: string;
  unitMeasure?: string;
  amount: number;
  price: number;
  value: number;
}
export interface IServiceFee {
  _id: string;
  category: string;
  nomenclatorId: string;
  key: string;
  workersAmount: number;
  taskName: string;
  payMethod: "CASH" | "CONTRACT";
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
  //*GASTO DE PERSONAL CONTRATADO
  indirectSalaries: IServiceFeeSubItem;
  subcontractExpenses: number;
  //*OTROS
  expensesTotalValue: number;
  artisticTalentValue: number;
  artisticPrice: number;
  ONAT: number;
  commercialMargin: number;
  salePrice: number;
  salePriceUSD: number;
  rawMaterialsByClient: number;
  // createdBy: string;
  // currencyChange: number;
}

const ServiceFeeSchema = new Schema<IServiceFee, Model<IServiceFee>>({
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
  // createdBy: {
  //   type: String,
  // },
  category: {
    type: String,
  },
  valuePerUnitMeasure: {
    type: String,
  },
  nomenclatorId: {
    unique: true,
    type: String,
    required: [true, "Debe asignarle un nomenclador a la tarea"],
  },
  workersAmount: {
    type: Number,
  },
  // currencyChange: {
  //   type: Number,
  // },
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

  indirectSalaries: {
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
  rawMaterialsTransportationExpenses: {
    type: Number,
  },
  salesAndDistributionExpenses: {
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
  salePriceUSD: {
    type: Number,
  },
  salePrice: {
    type: Number,
  },
  fuelExpense: {
    type: Number,
  },
  feedingExpense: {
    type: Number,
  },
  electricityExpense: {
    type: Number,
  },
  leaseExpense: {
    type: Number,
  },
  phoneExpense: {
    type: Number,
  },
  artisticPrice: {
    type: Number,
  },
  commercialMargin: {
    type: Number,
  },
});

const ServiceFee = models.ServiceFee || model("ServiceFee", ServiceFeeSchema);

export default ServiceFee;

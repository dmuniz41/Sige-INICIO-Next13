import { Model, Schema, model, models } from "mongoose";

export interface IServiceFeeSubItem {
  // * En el caso del material la descripcion es Categoria + Nombre que se debe generar previamente al crear el material en el almacen
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
  administrativeExpenses: IServiceFeeSubItem[];
  administrativeExpensesSubtotal: number;
  //*GASTOS DE TRANSPORTE
  transportationExpenses: IServiceFeeSubItem[];
  transportationExpensesSubtotal: number;
  //*GASTO DE PERSONAL CONTRATADO
  hiredPersonalExpenses: IServiceFeeSubItem[];
  hiredPersonalExpensesSubtotal: number;
  //*OTROS
  expensesTotalValue: number;
  artisticTalentValue: number;
  ONAT: number;
  commercialMargin: number;
  salePrice: number;
  salePriceUSD: number;
  rawMaterialsByClient: number;
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
  hiredPersonalExpenses: [
    {
      description: String,
      unitMeasure: String,
      amount: Number,
      price: Number,
      value: Number,
    },
  ],
  hiredPersonalExpensesSubtotal: {
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
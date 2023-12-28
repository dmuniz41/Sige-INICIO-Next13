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
  key: string;
  payMethod: "CASH" | "CONTRACT";
  USDValue: number;
  taskName: string;
  createdBy: string;
  approvedBy: string;
  description: string
  
  workersAmount: number;

  //  Considera los gastos de recursos materiales comprados y producidos

  rawMaterials: ICostSheetSubitem[];
  rawMaterialsSubtotal: number;

  //  Listado de actividades a ejecutar para completar la actividad

  directSalaries: ICostSheetSubitem[];
  directSalariesSubtotal: number;

  //  Se incluye pagos por mantenimientos y reparaciones recibidas, depreciación de los activos fijos tangibles y amortización de activos fijos intangibles (Gasto en Uso de Equipos).

  otherDirectExpenses: ICostSheetSubitem[];
  otherDirectExpensesSubtotal: number;

  //  Comprende los importes de los gastos que se incurren en las actividades asociadas a la producción, no identificables con un producto o servicio determinado.Ej: gasto de las actividades de mantenimiento, reparaciones, explotación de equipos, dirección de la producción, control de calidad, depreciación de activos fijos tangibles de producción y servicios auxiliares a estas, incluidos salarios, etc.

  productionRelatedExpenses: ICostSheetSubitem[];
  productionRelatedExpensesSubtotal: number;

  //  Incluidos salarios(Gastos administrativos)

  administrativeExpenses: ICostSheetSubitem[];
  administrativeExpensesSubtotal: number;

  //  Incluye salarios(Gastos de Transporte)

  transportationExpenses: ICostSheetSubitem[];
  transportationExpensesSubtotal: number;

  //  Comprende los gastos en que se incurre, por las operaciones financieras relacionadas con la producción o servicios para la que se elabora la ficha, reconociendo solamente los conceptos de intereses, comisiones bancarias y primas del seguro.

  financialExpenses: ICostSheetSubitem[];
  financialExpensesSubtotal: number;

  // Incluye los importes de contribución a la seguridad social e impuestos sobre utilización de fuerzas de trabajo (no se considera el importe por la contribución al desarrollo local)

  taxExpenses: ICostSheetSubitem[];
  taxExpensesSubtotal: number;

  expensesTotalValue: number;
  costsTotalValue: number;
  expensesAndCostsTotalValue: number;

  artisticTalent: number;
  artisticTalentValue: number

  // Para la actividad de producción de bienes, la tasa máxima de utilidad aprobada no puede exceder el 25%

  representationCost: number;
  representationCostValue: number;
  creatorPrice: number;

  rawMaterialsByClient: number;
  salePriceMLC: number;
  salePriceMN: number;
  salePrice: number

  // ? Añadir cliente
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

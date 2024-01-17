import { Model, Schema, model, models } from "mongoose";

// * Coeficientes que se utilzan para calcular diferentes valores en las tarifas de servicio

//* Ejemplo: (Efectivo, FCBC, Genesis, ACCS, CNOE)
export interface IRepresentationCoefficients {
  representative: string;
  coefficientValue: number;
}
export interface IServiceFeeAuxiliary {
  _id: string;
  key: string;
  calculationCoefficient: number;
  mermaCoefficient: number;
  currencyChange: number;
  officialCurrencyChangeCoefficient: number;
  informalCurrencyChange: number;
  currency: ["USD", "CUP"];
  administrativeExpensesCoefficients: {
    electricityExpense: number;
    fuelExpense: number;
    feedingExpense: number;
    phoneExpense: number;
    leaseExpense: number;
  };
  equipmentDepreciationCoefficients: {
    plotter: number;
    router: number;
    bendingMachine: number;
    manualTools: number;
  };
  equipmentMaintenanceCoefficients: {
    plotter: number;
    router: number;
  };
  payMethod: IRepresentationCoefficients[];
}

const ServiceFeeAuxiliarySchema = new Schema<IServiceFeeAuxiliary, Model<IServiceFeeAuxiliary>>({
  key: {
    type: String,
  },
  currency: {
    type: [String],
  },
  calculationCoefficient: {
    type: Number,
  },
  officialCurrencyChangeCoefficient: {
    type: Number,
  },
  informalCurrencyChange: {
    type: Number,
  },
  currencyChange: {
    type: Number,
  },
  mermaCoefficient: {
    type: Number,
  },
  payMethod: [
    {
      representative: String,
      coefficientValue: Number,
    },
  ],
  administrativeExpensesCoefficients: {
    electricityExpense: Number,
    fuelExpense: Number,
    feedingExpense: Number,
    phoneExpense: Number,
    leaseExpense: Number,
  },
  equipmentDepreciationCoefficients: {
    plotter: Number,
    router: Number,
    bendingMachine: Number,
    manualTools: Number,
  },
  equipmentMaintenanceCoefficients: {
    plotter: Number,
    router: Number,
  },
});

const ServiceFeeAuxiliary = models.ServiceFeeAuxiliary || model("ServiceFeeAuxiliary", ServiceFeeAuxiliarySchema);
export default ServiceFeeAuxiliary;

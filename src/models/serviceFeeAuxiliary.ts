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
  transportationExpensesCoefficient: number;
  salesAndDistributionExpensesCoefficient: number;
  informalCurrencyChange: number;
  currency: ["USD", "CUP"];
  administrativeExpensesCoefficients: [
    {
      name: string;
      value: number;
    }
  ];
  equipmentDepreciationCoefficients: [
    {
      name: string;
      value: number;
    }
  ];
  equipmentMaintenanceCoefficients: [
    {
      name: string;
      value: number;
    }
  ];
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
  administrativeExpensesCoefficients: [
    {
      name: String,
      value: Number,
    },
  ],
  equipmentDepreciationCoefficients: [
    {
      name: String,
      value: Number,
    },
  ],
  equipmentMaintenanceCoefficients: [
    {
      name: String,
      value: Number,
    },
  ],
  transportationExpensesCoefficient: {
    type: Number,
  },
  salesAndDistributionExpensesCoefficient: {
    type: Number,
  },
});

const ServiceFeeAuxiliary = models.ServiceFeeAuxiliary || model("ServiceFeeAuxiliary", ServiceFeeAuxiliarySchema);
export default ServiceFeeAuxiliary;

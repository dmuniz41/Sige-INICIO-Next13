import { Model, Schema, model, models } from "mongoose";

export interface IServiceFeeAuxiliary {
  _id: string;
  key: string;
  calculationCoefficient: number;
  mermaCoefficient: number;
  currencyChange: number;
  officialCurrencyChangeCoefficient: number;
  transportationExpensesCoefficients: [
    {
      name: string;
      value: number;
    }
  ];
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
}

const ServiceFeeAuxiliarySchema = new Schema<IServiceFeeAuxiliary, Model<IServiceFeeAuxiliary>>({
  key: {
    type: String
  },
  currency: {
    type: [String]
  },
  calculationCoefficient: {
    type: Number
  },
  officialCurrencyChangeCoefficient: {
    type: Number
  },
  informalCurrencyChange: {
    type: Number
  },
  currencyChange: {
    type: Number
  },
  mermaCoefficient: {
    type: Number
  },
  administrativeExpensesCoefficients: [
    {
      name: String,
      value: Number
    }
  ],
  equipmentDepreciationCoefficients: [
    {
      name: String,
      value: Number
    }
  ],
  equipmentMaintenanceCoefficients: [
    {
      name: String,
      value: Number
    }
  ],
  transportationExpensesCoefficients: [
    {
      name: String,
      value: Number
    }
  ]
});

const ServiceFeeAuxiliary =
  models.ServiceFeeAuxiliary || model("ServiceFeeAuxiliary", ServiceFeeAuxiliarySchema);
export default ServiceFeeAuxiliary;

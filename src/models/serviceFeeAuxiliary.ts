import { Model, Schema, model, models } from "mongoose";

export interface IServiceFeeAuxiliary {
  _id: string;
  key: string;
  indirectSalariesCoefficient: number;
  mermaCoefficient: number;
  currencyChange: number;
  artisticTalentPercentage: number;
  ONATTaxPercentage: number;
  currency: ["USD", "CUP"];
  transportationExpensesCoefficients: [
    {
      name: string;
      value: number;
    }
  ];
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
  indirectSalariesCoefficient: {
    type: Number
  },
  artisticTalentPercentage: {
    type: Number
  },
  ONATTaxPercentage: {
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

const ServiceFeeAuxiliary = models.ServiceFeeAuxiliary || model("ServiceFeeAuxiliary", ServiceFeeAuxiliarySchema);
export default ServiceFeeAuxiliary;

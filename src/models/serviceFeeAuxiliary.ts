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
  currency: ["USD" ,"CUP"];
  payMethod: IRepresentationCoefficients[];
}

const ServiceFeeAuxiliarySchema = new Schema<IServiceFeeAuxiliary, Model<IServiceFeeAuxiliary>>({
  key: {
    type: String,
  },
  currency: {
    type: [String],
    required: [true, "la moneda es requerida"],
  },
  calculationCoefficient: {
    type: Number,
    required: [true, "El coeficiente de cálculo es requerido"],
  },
  officialCurrencyChangeCoefficient: {
    type: Number,
    required: [true, "El coeficiente de cambio monetario oficial es requerido"],
  },
  informalCurrencyChange: {
    type: Number,
    required: [true, "El cambio informal es requerido"],
  },
  currencyChange: {
    type: Number,
    required: [true, "El cambio de moneda requerido"],
  },
  mermaCoefficient: {
    type: Number,
    required: [true, "El coeficiente de merma requerido"],
  },
  payMethod: [
    {
      representative: String,
      coefficientValue: Number,
    },
  ],
});

const ServiceFeeAuxiliary = models.ServiceFeeAuxiliary || model("ServiceFeeAuxiliary", ServiceFeeAuxiliarySchema);
export default ServiceFeeAuxiliary;

import { Date, Model, Schema, Types, model, models } from "mongoose";
import { IMaterial } from "./material";

// * Modelo de tarjetas de estiba *

interface IOperation {
  date: Date;
  type: "Añadir" | "Sustraer";
  amount: number;
}

interface IStowageCard {
  code: string;
  materialCategory: string;
  unitsTotal: number;
}

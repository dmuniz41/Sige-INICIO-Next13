import { Model, Schema, Types, model, models } from "mongoose";

export interface IUser {
  key: string,
  user: string,
  userName: string,
  lastName: string,
  privileges: string[],
  password: string,
  area: string[]
}

const UserSchema = new Schema<IUser, Model<IUser>>({
  key: {
    type: String
  },
  user: {
    type: String,
    required: [true, 'El usuario es requerido'],
    unique: true,
  },
  userName: {
    type: String,
    required: [true, 'El nombre es requerido'],
  },
  lastName: {
    type: String,
    required: [true, 'Los apellidos son requeridos'],
  },
  privileges: {
    type: [],
    required: [true, 'Los privilegios son requeridos'],
  },
  password: {
    type: String,
    required: [true, 'La contraseña es requerida'],
  },
  area: {
    type: [],
    required: [true, 'El area es requerida'],
  },
});

const User = models.User || model('User', UserSchema)
export default User

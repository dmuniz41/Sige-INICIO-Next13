import { Schema, model, models } from "mongoose";

const UserSchema = new Schema({
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
    type: String,
    required: [true, 'El area es requerida'],
  },
});

const User = models.User || model('User', UserSchema)
export default User

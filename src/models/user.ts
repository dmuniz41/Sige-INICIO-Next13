import { Schema, model, models } from "mongoose";

const UserSchema = new Schema({
  user: {
    type: String,
    required: [true, 'user is required'],
    unique: true,
  },
  userName: {
    type: String,
    required: [true, 'userName is required'],
  },
  lastName: {
    type: String,
    required: [true, 'lastName is required'],
  },
  privileges: {
    type: [],
    required: [true, 'privileges are required'],
  },
  password: {
    type: String,
    required: [true, 'password is required'],
  },
  area: {
    type: String,
    required: [true, 'area is required'],
  },
});

const User = models.User || model('User', UserSchema)
export default User

const { Schema, model, models } = require("mongoose");

const UserSchema = new Schema({
  user: {
    type: String,
    require: [true, 'user is required'],
    unique: true,
  },
  userName: {
    type: String,
    require: [true, 'userName is required'],
  },
  lastName: {
    type: String,
    require: [true, 'lastName is required'],
  },
  privileges: {
    type: [],
    require: [true, 'privileges are required'],
  },
  password: {
    type: String,
    require: [true, 'password is required'],
  },
  area: {
    type: String,
    require: [true, 'area is required'],
  },
});

const User = models.User || model('User', UserSchema)
export default User

import { types } from "../types/types";

const initialState = {
  users: [],
};

export const userReducer = (state = initialState, action:any) => {
  switch (action.type) {
    case types.addUser:
      return {
        ...state,
      };
    case types.deleteUser:
      return {
        ...state,
      };
    case types.updateUser:
      return {
        ...state,
      };
    case types.usersLoaded:
      return {
        ...state,
        users: [...action.payload],
      };

    default:
      return state;
  }
};

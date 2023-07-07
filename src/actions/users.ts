import Swal from "sweetalert2";
import { fetchSinToken } from "../helpers/fetch";
import { types } from "../types/types";
import { Toast } from "../helpers/customAlert";
import axios, { AxiosError } from "axios";

export const startAddUser = (user: string, userName: string, lastName: string, privileges: string[], password: string, area: string): any => {
  return async (dispatch: any) => {
    await axios
      .post(`${process.env.NEXT_PUBLIC_API_URL}/user`, { user, userName, lastName, privileges, password, area })
      .then(() => {
        dispatch(addUser(user, userName, lastName, privileges, password, area));
        Toast.fire({
          icon: "success",
          title: "Usuario Creado",
        });
      })
      .catch((error: AxiosError) => {
        let { msg }: any = error.response?.data;
        Swal.fire("Error", msg, "error");
      });
  };
};
export const startUpdateUser = (user: string, userName: string, lastName: string, privileges: string[], password: string, area: string): any => {
  return async (dispatch: any) => {
    await axios
      .put(`${process.env.NEXT_PUBLIC_API_URL}/user`, { user, userName, lastName, privileges, password, area })
      .then(() => {
        dispatch(updateUser(user, userName, lastName, privileges, password, area));
        Toast.fire({
          icon: "success",
          title: "Usuario Actualizado",
        });
      })
      .catch((error: AxiosError) => {
        let { msg }: any = error.response?.data;
        Swal.fire("Error", msg, "error");
      });
  };
};
export const startDeleteUser = (user: string): any => {
  return async (dispatch: any) => {
    await axios
      .patch(`${process.env.NEXT_PUBLIC_API_URL}/user`, { user })
      .then(() => {
        dispatch(deleteUser(user));
        Toast.fire({
          icon: "success",
          title: "Usuario Eliminado",
        });
      })
      .catch((error: AxiosError) => {
        let { msg }: any = error.response?.data;
        Swal.fire("Error", msg, "error");
      });
  };
};
export const usersStartLoading = () => {
  return async (dispatch: any) => {
    await axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/user`)
      .then((resp) => {
        let { listOfUsers } = resp.data;
        dispatch(usersLoaded(listOfUsers));
      })
      .catch((error: AxiosError) => {
        let { msg }: any = error.response?.data;
        Swal.fire("Error", msg, "error");
      });
  };
};
export const usersLoaded = (users: any) => ({
  type: types.usersLoaded,
  payload: users,
});

const addUser = (user: string, userName: string, lastName: string, privileges: string[], password: string, area: string) => ({
  type: types.addUser,
  payload: {
    user,
    userName,
    lastName,
    privileges,
    password,
    area,
  },
});
const updateUser = (user: string, userName: string, lastName: string, privileges: string[], password: string, area: string) => ({
  type: types.updateUser,
  payload: {
    user,
    userName,
    lastName,
    privileges,
    password,
    area,
  },
});
const deleteUser = (user: string) => ({
  type: types.deleteUser,
  payload: {
    user,
  },
});

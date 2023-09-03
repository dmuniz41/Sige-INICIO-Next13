import Swal from "sweetalert2";
import { types } from "../types/types";
import { Toast } from "../helpers/customAlert";
import axios, { AxiosError } from "axios";

export const startAddUser = (user: string, userName: string, lastName: string, privileges: string[], password: string, area: string): any => {
  const token = localStorage.getItem("accessToken");
  return async (dispatch: any) => {
    await axios
      .post(`${process.env.NEXT_PUBLIC_API_URL}/user`, { user, userName, lastName, privileges, password, area }, { headers: { accessToken: token } })
      .then(() => {
        dispatch(addUser(user, userName, lastName, privileges, password, area));
        dispatch(usersStartLoading())
        Toast.fire({
          icon: "success",
          title: "Usuario Creado",
        });
      })
      .catch((error: AxiosError) => {
        let { message }: any = error.response?.data;
        Swal.fire("Error", message, "error");
      });
  };
};

export const startUpdateUser = (_id: string, user: string, userName: string, lastName: string, privileges: string[], password: string, area: string): any => {
  const token = localStorage.getItem("accessToken");
  return async (dispatch: any) => {
    await axios
      .put(`${process.env.NEXT_PUBLIC_API_URL}/user`, { _id ,user, userName, lastName, privileges, password, area }, { headers: { accessToken: token } })
      .then(() => {
        dispatch(updateUser(user, userName, lastName, privileges, password, area));
        dispatch(usersStartLoading())
        Toast.fire({
          icon: "success",
          title: "Usuario Actualizado",
        });
      })
      .catch((error: AxiosError) => {
        let { message }: any = error.response?.data;
        Swal.fire("Error", message, "error");
      });
  };
};

export const startDeleteUser = (user: string): any => {
  const token = localStorage.getItem("accessToken");
  return async (dispatch: any) => {
    await axios
      .patch(`${process.env.NEXT_PUBLIC_API_URL}/user`, { user }, { headers: { accessToken: token } })
      .then(() => {
        dispatch(deleteUser(user));
        dispatch(usersStartLoading())
        Toast.fire({
          icon: "success",
          title: "Usuario Eliminado",
        });
      })
      .catch((error: AxiosError) => {
        let { message }: any = error.response?.data;
        Swal.fire("Error", message, "error");
      });
  };
};

export const usersStartLoading = () => {
  const token = localStorage.getItem("accessToken");

  return async (dispatch: any) => {
    await axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/user`, { headers: { accessToken: token } })
      .then((resp) => {
        let { listOfUsers } = resp.data;
        dispatch(usersLoaded(listOfUsers));
      })
      .catch((error: AxiosError) => {
        let { message }: any = error.response?.data;
        Swal.fire("Error", message, "error");
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

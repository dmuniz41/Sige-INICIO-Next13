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
export const startUserUpdate = (
  user: string,
  userName: string,
  lastName: string,
  privileges: string[],
  password: string,
  area: string,
  password2: string
): any => {
  return async (dispatch: any) => {
    try {
      const resp = await fetchSinToken(`api/user`, { user, userName, lastName, privileges, password, area, password2 }, "PUT");
      const body = await resp.json();
      if (body.ok) {
        Toast.fire({
          icon: "success",
          title: "Usuario Actualizado",
        });
        dispatch(updateUser(user, userName, lastName, privileges, password, area, password2));
      } else {
        Swal.fire("Error", body.msg, "error");
      }
    } catch (error) {
      console.log(error);
    }
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

// export const selectedUser = (selectedUser) => ({
//   type: types.selectedUser,
//   payload: selectedUser,
// });

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
const updateUser = (user: string, userName: string, lastName: string, privileges: string[], password: string, area: string, password2: string) => ({
  type: types.updateUser,
  payload: {
    user,
    userName,
    lastName,
    privileges,
    password,
    area,
    password2,
  },
});
const deleteUser = (user: string) => ({
  type: types.deleteUser,
  payload: {
    user,
  },
});

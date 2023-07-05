import Swal from "sweetalert2";
import { fetchSinToken } from "../helpers/fetch";
import { types } from "../types/types";
import { Toast } from "../helpers/customAlert";

export const startAddUser = (
  user: string,
  userName: string,
  lastName: string,
  privileges: string[],
  password: string,
  area: string,
  password2: string
) => {
  return async (dispatch: any) => {
    try {
      const resp = await fetchSinToken("auth/new", { user, userName, lastName, privileges, password, area, password2 }, "POST");
      const body = await resp.json();

      if (body.ok) {
        Toast.fire({
          icon: "success",
          title: "Usuario Creado",
        });
        dispatch(addUser(user, userName, lastName, privileges, password, area));
      } else {
        Swal.fire("Error", body.msg, "error");
      }
    } catch (error) {
      console.log(error);
    }
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
) => {
  return async (dispatch: any) => {
    try {
      const resp = await fetchSinToken(`auth/`, { user, userName, lastName, privileges, password, area, password2 }, "PUT");
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
export const startDeleteUser = (user: string) => {
  return async (dispatch: any) => {
    const resp = await fetchSinToken(`auth/`, { user }, "DELETE");
    const body = await resp.json();
    try {
      if (body.ok) {
        dispatch(deleteUser(user));
        Toast.fire({
          icon: "success",
          title: "Usuario Eliminado",
        });
      } else {
        Swal.fire("Error", body.msg, "error");
      }
    } catch (error) {
      console.log(error);
    }
  };
};
export const usersStartLoading = () => {
  return async (dispatch: any) => {
    const resp = await fetchSinToken(`auth/`, "GET");
    const body = await resp.json();

    dispatch(usersLoaded(body.listOfUsers));
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

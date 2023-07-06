import Swal from "sweetalert2";
import { fetchSinToken } from "../helpers/fetch";
import { types } from "../types/types";
import { Toast } from "../helpers/customAlert";
import axios, {isCancel, AxiosError} from 'axios';

// const apiURL = 'http://localhost:3000/api'


export const startAddUser = (
  user: string,
  userName: string,
  lastName: string,
  privileges: string[],
  password: string,
  area: string,
): any => {
  return async (dispatch: any)=> {
      const resp = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/user`,{user, userName, lastName, privileges, password, area,})
        .then(function(resp){
        console.log("🚀 ~ file: users.ts:18 ~ .then ~ resp:", resp)
        })
        .catch(function(error){
          console.log("🚀 ~ file: users.ts:21 ~ return ~ error:", error)
          
        })

      // if (body.ok) {
      //   Toast.fire({
      //     icon: "success",
      //     title: "Usuario Creado",
      //   });
      //   dispatch(addUser(user, userName, lastName, privileges, password, area));
      // } else {
      //   Swal.fire("Error", body.msg, "error");
      }
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
    const resp = await fetchSinToken(`api/user`, { user }, "PATCH");
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

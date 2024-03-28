import Swal from "sweetalert2";
import { types } from "../types/types";
import { Toast } from "../helpers/customAlert";
import axios, { AxiosError } from "axios";

// * CREA UN NUEVO USUARIO DEL SISTEMA *//
export const startAddUser = ({ ...user }): any => {
  const token = localStorage.getItem("accessToken");
  return async (dispatch: any) => {
    await axios
      .post(
        `${process.env.NEXT_PUBLIC_API_URL}/user`,
        { ...user },
        { headers: { accessToken: token } }
      )
      .then(() => {
        dispatch(addUser(user));
        dispatch(usersStartLoading());
        Toast.fire({
          icon: "success",
          title: "Usuario Creado"
        });
      })
      .catch((error: AxiosError) => {
        let { message }: any = error.response?.data;
        console.log("🚀 ~ return ~  message:",  message)
        Swal.fire("Error", "Error al crear el usuario", "error");
      });
  };
};

// * ACTUALIZA UN USUARIO POR SU ID * //
export const startUpdateUser = ({ ...user }): any => {
  console.log("🚀 ~ startUpdateUser ~ user:", user);
  const token = localStorage.getItem("accessToken");
  return async (dispatch: any) => {
    await axios
      .put(
        `${process.env.NEXT_PUBLIC_API_URL}/user`,
        { ...user },
        { headers: { accessToken: token } }
      )
      .then(() => {
        dispatch(updateUser(user));
        dispatch(usersStartLoading());
        Toast.fire({
          icon: "success",
          title: "Usuario Actualizado"
        });
      })
      .catch((error: AxiosError) => {
        let { message }: any = error.response?.data;
        console.log("🚀 ~ return ~ message:", message)
        Swal.fire("Error", "Error al actualizar el usuario", "error");
      });
  };
};

// * ELIMINA UN USUARIO POR SU USERNAME * //
export const startDeleteUser = (id: string): any => {
  const token = localStorage.getItem("accessToken");
  return async (dispatch: any) => {
    await axios
      .delete(`${process.env.NEXT_PUBLIC_API_URL}/user?id=${id}`, {
        headers: { accessToken: token }
      })
      .then(() => {
        dispatch(deleteUser(id));
        dispatch(usersStartLoading());
        Toast.fire({
          icon: "success",
          title: "Usuario Eliminado"
        });
      })
      .catch((error: AxiosError) => {
        let { message }: any = error.response?.data;
        console.log("🚀 ~ return ~ message:", message)
        Swal.fire("Error", "Error al eliminar el usuario", "error");
      });
  };
};

// * CARGA TODOS LOS USUARIOS * //
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
        console.log("🚀 ~ return ~ message:", message)
        Swal.fire("Error", "Error al cargar los usuarios", "error");
      });
  };
};

export const usersLoaded = (users: any) => ({
  type: types.usersLoaded,
  payload: users
});

const addUser = ({ ...user }) => ({
  type: types.addUser,
  payload: {
    user
  }
});

const updateUser = ({ ...user }) => ({
  type: types.updateUser,
  payload: {
    user
  }
});

const deleteUser = (id: string) => ({
  type: types.deleteUser,
  payload: {
    id
  }
});

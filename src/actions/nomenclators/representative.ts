import axios, { AxiosError } from "axios";
import Swal from "sweetalert2";

import { Toast } from "@/helpers/customAlert";
import { types } from "@/types/types";

// * CREA UN NUEVO NOMENCLADOR DE REPRESENTANTE * //
export const startAddRepresentativeNomenclator = ({ ...representativeNomenclator }): any => {
  const token = localStorage.getItem("accessToken");
  return async (dispatch: any) => {
    await axios
      .post(
        `${process.env.NEXT_PUBLIC_API_URL}/nomenclators/representative`,
        {
          ...representativeNomenclator
        },
        { headers: { accessToken: token } }
      )
      .then(() => {
        dispatch(addRepresentativeNomenclator(representativeNomenclator));
        dispatch(representativeNomenclatorsStartLoading());
        Toast.fire({
          icon: "success",
          title: "Nomenclador Creado"
        });
      })
      .catch((error: AxiosError) => {
        let { message }: any = error.response?.data;
        console.log("🚀 ~ return ~ message:", message);
        Swal.fire(
          "Error",
          "Error al crear el nomenclador de representante. (El nombre del representante debe ser único)",
          "error"
        );
      });
  };
};

// * ACTUALIZA UN NOMENCLADOR DE REPRESENTANTE POR SU ID * //
export const startUpdateRepresentativeNomenclator = ({ ...representativeNomenclator }): any => {
  const token = localStorage.getItem("accessToken");
  return async (dispatch: any) => {
    await axios
      .put(
        `${process.env.NEXT_PUBLIC_API_URL}/nomenclators/representative`,
        {
          ...representativeNomenclator
        },
        { headers: { accessToken: token } }
      )
      .then(() => {
        dispatch(updateRepresentativeNomenclator(representativeNomenclator));
        dispatch(representativeNomenclatorsStartLoading());
        Toast.fire({
          icon: "success",
          title: "Nomenclador Actualizado"
        });
      })
      .catch((error: AxiosError) => {
        let { message }: any = error.response?.data;
        console.log("🚀 ~ return ~ message:", message);
        Swal.fire(
          "Error",
          "Error al actualizar el nomenclador de representante. (El nombre del representante debe ser único)",
          "error"
        );
      });
  };
};

// * ELIMINA UN NOMENCLADOR DE REPRESENTANTE POR SU ID * //
export const startDeleteRepresentativeNomenclator = (id: string): any => {
  const token = localStorage.getItem("accessToken");
  return async (dispatch: any) => {
    await axios
      .delete(`${process.env.NEXT_PUBLIC_API_URL}/nomenclators/representative?id=${id}`, {
        headers: { accessToken: token }
      })
      .then(() => {
        dispatch(deleteRepresentativeNomenclator(id));
        dispatch(representativeNomenclatorsStartLoading());
        Toast.fire({
          icon: "success",
          title: "Nomenclador Eliminado"
        });
      })
      .catch((error: AxiosError) => {
        let { message }: any = error.response?.data;
        console.log("🚀 ~ return ~ message:", message);
        Swal.fire("Error", "Error al eliminar el nomenclador de representante", "error");
      });
  };
};

// * CARGA TODOS LOS NOMENCLADORES DE REPRESENTANTES * //
export const representativeNomenclatorsStartLoading = () => {
  const token = localStorage.getItem("accessToken");
  return async (dispatch: any) => {
    await axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/nomenclators/representative`, {
        headers: { accessToken: token }
      })
      .then((resp) => {
        let { listOfRepresentativeNomenclators } = resp.data;
        dispatch(representativeNomenclatorsLoaded(listOfRepresentativeNomenclators));
      })
      .catch((error: AxiosError) => {
        let { message }: any = error.response?.data;
        console.log("🚀 ~ return ~ message:", message);
        Swal.fire("Error", "Error al cargar los nomencladores de representantes", "error");
      });
  };
};

export const representativeNomenclatorsLoaded = (representativeNomenclators: any) => ({
  type: types.representativeNomenclatorsLoaded,
  payload: representativeNomenclators
});

const addRepresentativeNomenclator = ({ ...representativeNomenclator }) => ({
  type: types.addRepresentativeNomenclator,
  payload: {
    representativeNomenclator
  }
});

const updateRepresentativeNomenclator = ({ ...representativeNomenclator }) => ({
  type: types.updateRepresentativeNomenclator,
  payload: {
    representativeNomenclator
  }
});

const deleteRepresentativeNomenclator = (id: string) => ({
  type: types.deleteRepresentativeNomenclator,
  payload: {
    id
  }
});

import Swal from "sweetalert2";
import { types } from "../types/types";
import { Toast } from "../helpers/customAlert";
import axios, { AxiosError } from "axios";
import { IOffer } from "@/models/offer";

export const startAddOffer = ({ ...offer }: IOffer) => {
  const token = localStorage.getItem("accessToken");
  return async (dispatch: any) => {
    await axios
      .post(`${process.env.NEXT_PUBLIC_API_URL}/offer`, { offer }, { headers: { accessToken: token } })
      .then(() => {
        dispatch(addOffer(offer));
        dispatch(offersStartLoading());
        Toast.fire({
          icon: "success",
          title: "Oferta Creada",
        });
      })
      .catch((error: AxiosError) => {
        let { message }: any = error.response?.data;
        Swal.fire("Error", message, "error");
      });
  };
};
export const startUpdateOffer = ({ ...offer }: IOffer) => {
  const token = localStorage.getItem("accessToken");
  return async (dispatch: any) => {
    await axios
      .put(`${process.env.NEXT_PUBLIC_API_URL}/offer`, { offer }, { headers: { accessToken: token } })
      .then(() => {
        dispatch(updateOffer(offer));
        dispatch(offersStartLoading());
        Toast.fire({
          icon: "success",
          title: "Oferta Actualizada",
        });
      })
      .catch((error: AxiosError) => {
        let { message }: any = error.response?.data;
        Swal.fire("Error", message, "error");
      });
  };
};
export const startDeleteOffer = (id: string): any => {
  const token = localStorage.getItem("accessToken");
  return async (dispatch: any) => {
    await axios
      .patch(`${process.env.NEXT_PUBLIC_API_URL}/offer`, { id }, { headers: { accessToken: token } })
      .then(() => {
        dispatch(deleteOffer(id));
        dispatch(offersStartLoading());
        Toast.fire({
          icon: "success",
          title: "Oferta Eliminada",
        });
      })
      .catch((error: AxiosError) => {
        let { message }: any = error.response?.data;
        Swal.fire("Error", message, "error");
      });
  };
};
export const offersStartLoading = () => {
  const token = localStorage.getItem("accessToken");
  return async (dispatch: any) => {
    await axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/offer`, { headers: { accessToken: token } })
      .then((resp) => {
        let { listOfOffers } = resp.data;
        dispatch(offersLoaded(listOfOffers));
      })
      .catch((error: AxiosError) => {
        let { message }: any = error.response?.data;
        Swal.fire("Error", message, "error");
      });
  };
};
export const offersLoaded = (offers: IOffer[]) => ({
  type: types.offersLoaded,
  payload: offers,
});
const addOffer = (offer: IOffer) => ({
  type: types.addOffer,
  payload: {
    offer,
  },
});
const updateOffer = (offer: IOffer) => ({
  type: types.updateOffer,
  payload: {
    offer,
  },
});
const deleteOffer = (id: string) => ({
  type: types.deleteOffer,
  payload: {
    id,
  },
});

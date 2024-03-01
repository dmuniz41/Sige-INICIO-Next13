import axios, { AxiosError } from "axios";
import Swal from "sweetalert2";

import { IOffer, IOfferItem } from "@/models/offer";
import { Toast } from "../helpers/customAlert";
import { types } from "../types/types";

export const startAddOffer = ({ ...offer }: any) => {
  console.log("🚀 ~ startAddOffer ~ offer:", offer)
  const token = localStorage.getItem("accessToken");
  return async (dispatch: any) => {
    await axios
      .post(
        `${process.env.NEXT_PUBLIC_API_URL}/offer`,
        {
          itemsList: offer?.itemsList,
          name: offer?.name,
          projectName: offer?.projectName,
          projectId: offer?.projectId,
          value: offer?.value,
        },
        { headers: { accessToken: token } }
      )
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
        console.log("🚀 ~ file: offer.ts:22 ~ return ~ message:", message);
        Swal.fire("Error", "Error al crear la oferta", "error");
      });
  };
};
export const startUpdateOffer = ({ ...offer }: any) => {
  const token = localStorage.getItem("accessToken");
  return async (dispatch: any) => {
    await axios
      .put(`${process.env.NEXT_PUBLIC_API_URL}/offer`, { ...offer }, { headers: { accessToken: token } })
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
        console.log("🚀 ~ file: offer.ts:41 ~ return ~ message:", message);
        Swal.fire("Error", "Error al actualizar la oferta", "error");
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
        console.log("🚀 ~ file: offer.ts:60 ~ return ~ message:", message);
        Swal.fire("Error", "Error al borrar la oferta", "error");
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
        console.log("🚀 ~ file: offer.ts:75 ~ return ~ message:", message);
        Swal.fire("Error", "Error al cargar las ofertas", "error");
      });
  };
};

export const loadSelectedOffer = (projectId: string) => {
  const token = localStorage.getItem("accessToken");
  return async (dispatch: any) => {
    await axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/offer/${projectId}`, { headers: { accessToken: token } })
      .then((resp) => {
        let { BDOffer } = resp.data;
        dispatch(selectedOffer(BDOffer));
      })
      .catch((error: AxiosError) => {
        let { message }: any = error.response?.data;
        console.log("🚀 ~ file: offer.ts:91 ~ return ~ message:", message);
        Swal.fire("Error", "Error al cargar la oferta seleccionada", "error");
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
const selectedOffer = (offer: IOffer) => ({
  type: types.selectedOffer,
  payload: offer,
});

export const setCurrentItem = (item: IOfferItem) => ({
  type: types.setCurrentItem,
  payload: item,
});

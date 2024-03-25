import axios, { AxiosError } from "axios";
import Swal from "sweetalert2";

import { IOffer, IOfferItem } from "@/models/offer";
import { Toast } from "../helpers/customAlert";
import { types } from "../types/types";

// * CREA UNA NUEVA OFERTA * //
export const startAddOffer = ({ ...offer }: any) => {
  console.log("🚀 ~ startAddOffer ~ offer:", offer);
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
          representationCoef: offer?.representationCoef
        },
        { headers: { accessToken: token } }
      )
      .then(() => {
        dispatch(addOffer(offer));
        Toast.fire({
          icon: "success",
          title: "Oferta Creada"
        });
      })
      .catch((error: AxiosError) => {
        let { message }: any = error.response?.data;
        console.log("🚀 ~ file: offer.ts:22 ~ return ~ message:", message);
        Swal.fire("Error", "Error al crear la oferta", "error");
      });
  };
};

// * ACTUALIZA UNA OFERTA POR SU ID * //
export const startUpdateOffer = ({ ...offer }: any) => {
  const token = localStorage.getItem("accessToken");
  return async (dispatch: any) => {
    await axios
      .put(
        `${process.env.NEXT_PUBLIC_API_URL}/offer`,
        { ...offer },
        { headers: { accessToken: token } }
      )
      .then(() => {
        dispatch(updateOffer(offer));
        dispatch(offersStartLoading(offer.projectId));
        Toast.fire({
          icon: "success",
          title: "Oferta Actualizada"
        });
      })
      .catch((error: AxiosError) => {
        let { message }: any = error.response?.data;
        console.log("🚀 ~ file: offer.ts:41 ~ return ~ message:", message);
        Swal.fire("Error", "Error al actualizar la oferta", "error");
      });
  };
};

// * ELIMINA UNA OFERTA POR SU ID * //
export const startDeleteOffer = (id: string): any => {
  const token = localStorage.getItem("accessToken");
  return async (dispatch: any) => {
    await axios
      .patch(
        `${process.env.NEXT_PUBLIC_API_URL}/offer`,
        { id },
        { headers: { accessToken: token } }
      )
      .then(() => {
        dispatch(deleteOffer(id));
        Toast.fire({
          icon: "success",
          title: "Oferta Eliminada"
        });
      })
      .catch((error: AxiosError) => {
        let { message }: any = error.response?.data;
        console.log("🚀 ~ file: offer.ts:60 ~ return ~ message:", message);
        Swal.fire("Error", "Error al borrar la oferta", "error");
      });
  };
};

// * CARGA TODAS LAS OFERTAS CORRESPONDIENTES A UN PROYECTO POR SI ID * //
export const offersStartLoading = (projectId: string) => {
  console.log("🚀 ~ offersStartLoading ~ projectId:", projectId);
  const token = localStorage.getItem("accessToken");
  return async (dispatch: any) => {
    await axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/offer`, {
        headers: { accessToken: token, projectId: projectId }
      })
      .then((resp) => {
        let { listOfOffers } = resp.data;
        console.log("🚀 ~ .then ~ listOfOffers:", listOfOffers);
        dispatch(offersLoaded(listOfOffers));
      })
      .catch((error: AxiosError) => {
        let { message }: any = error.response?.data;
        console.log("🚀 ~ file: offer.ts:75 ~ return ~ message:", message);
        Swal.fire("Error", "Error al cargar las ofertas", "error");
      });
  };
};

// * CARGA LA INFORMACION DE UNA OFERTA * //
export const loadSelectedOffer = (projectId: string) => {
  const token = localStorage.getItem("accessToken");
  return async (dispatch: any) => {
    await axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/offer/${projectId}`, {
        headers: { accessToken: token }
      })
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
  payload: offers
});

const addOffer = (offer: IOffer) => ({
  type: types.addOffer,
  payload: {
    offer
  }
});

const updateOffer = (offer: IOffer) => ({
  type: types.updateOffer,
  payload: {
    offer
  }
});

const deleteOffer = (id: string) => ({
  type: types.deleteOffer,
  payload: {
    id
  }
});

const selectedOffer = (offer: IOffer) => ({
  type: types.selectedOffer,
  payload: offer
});

export const selectedItem = (item: IOfferItem) => ({
  type: types.selectedItem,
  payload: item
});

// * AÑADE UN NUEVO ITEM A LA OFERTA * //
export const setCurrentItem = (item: IOfferItem) => ({
  type: types.setCurrentItem,
  payload: item
});

// * ELIMINA UN ITEM DE LA LISTA DE LA LISTA DE ITEMS EN LA OFERTA * //
export const deleteItem = (item: IOfferItem) => ({
  type: types.deleteItem,
  payload: item
});

// * EDITA UN ITEM SELECCIONADO * //
export const editItem = (item: IOfferItem, isItemUpdated: boolean) => ({
  type: types.editItem,
  payload: { item: item, isItemUpdated: isItemUpdated }
});

// * ESTABLECE EN EL ESTADO GLOBAL EL ID DE LA OFERTA FINAL DEL PROYECTO SELECCIONADO * //
export const setFinalOffer = (id: string) => ({
  type: types.setFinalOffer,
  payload: id
});

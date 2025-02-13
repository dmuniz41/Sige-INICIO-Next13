import axios, { AxiosError, AxiosResponse } from "axios";
import Swal from "sweetalert2";

import { IActivity, IOffer, IOfferItem } from "@/models/offer";
import { Toast } from "../helpers/customAlert";
import { types } from "../types/types";

// * CREA UNA NUEVA OFERTA * //
export const startAddOffer = ({ ...offer }: any) => {
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
          representativeName: offer?.representativeName,
          version: offer?.version
        },
        { headers: { accessToken: token } }
      )
      .then((response) => {
        dispatch(addOffer(response.data.newOffer));
        Toast.fire({
          icon: "success",
          title: "Oferta Creada"
        });
      })
      .catch((error: AxiosError) => {
        const { message }: any = error.response?.data;
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
      .put(`${process.env.NEXT_PUBLIC_API_URL}/offer`, { ...offer }, { headers: { accessToken: token } })
      .then(() => {
        dispatch(updateOffer(offer));
        Toast.fire({
          icon: "success",
          title: "Oferta Actualizada"
        });
      })
      .catch((error: AxiosError) => {
        const { message }: any = error.response?.data;
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
      .delete(`${process.env.NEXT_PUBLIC_API_URL}/offer?id=${id}`, {
        headers: { accessToken: token }
      })
      .then(() => {
        dispatch(deleteOffer(id));
        Toast.fire({
          icon: "success",
          title: "Oferta Eliminada"
        });
      })
      .catch((error: AxiosError) => {
        const { message }: any = error.response?.data;
        console.log("🚀 ~ file: offer.ts:60 ~ return ~ message:", message);
        Swal.fire("Error", "Error al borrar la oferta", "error");
      });
  };
};

// * CARGA TODAS LAS OFERTAS CORRESPONDIENTES A UN PROYECTO POR SI ID * //
export const offersStartLoading = (projectId: string) => {
  const token = localStorage.getItem("accessToken");
  return async (dispatch: any) => {
    await axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/offer`, {
        headers: { accessToken: token, projectId: projectId }
      })
      .then((resp) => {
        const { listOfOffers } = resp.data;
        dispatch(offersLoaded(listOfOffers));
      })
      .catch((error: AxiosError) => {
        const { message }: any = error.response?.data;
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
      .then((response) => {
        const { BDOffer } = response?.data;
        dispatch(selectedOffer(BDOffer));
      })
      .catch((error: AxiosError) => {
        const { message }: any = error.response?.data;
        console.log("🚀 ~ file: offer.ts:124 ~ return ~ message:", message);
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

export const selectedActivity = (activity: IActivity) => ({
  type: types.selectedActivity,
  payload: activity
});

// * AÑADE UN NUEVO ITEM A LA OFERTA * //
export const setCurrentItem = (item: IOfferItem) => ({
  type: types.setCurrentItem,
  payload: item
});

// * ELIMINA UN ITEM DE LA LISTA DE LA LISTA DE ITEMS EN LA OFERTA * //
export const deleteItem = (item: IOfferItem) => ({
  type: types.deleteItem,
  payload: item?.description
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

// * EDITA UNA ACTIVIDAD DE LA LISTA DE ACTIVIDADES DE UNA OFERTA //
export const editActivityList = (activities: IActivity[]) => ({
  type: types.editActivityList,
  payload: activities
});

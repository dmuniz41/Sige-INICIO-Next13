import axios, { AxiosError } from "axios";
import Swal from "sweetalert2";

import { IItem, IProject } from "@/models/project";
import { Toast } from "@/helpers/customAlert";
import { types } from "@/types/types";
import { offersStartLoading, startUpdateOffer } from "./offer";
import { IOffer } from "@/models/offer";

//* CREA UN NUEVO PROYECTO *//
export const startAddProject = ({ ...project }) => {
  const token = localStorage.getItem("accessToken");
  return async (dispatch: any) => {
    await axios
      .post(
        `${process.env.NEXT_PUBLIC_API_URL}/project`,
        { ...project },
        { headers: { accessToken: token } }
      )
      .then((resp) => {
        dispatch(addProject(resp.data.newProject));
        dispatch(projectsStartLoading());
        Toast.fire({
          icon: "success",
          title: "Proyecto Creado"
        });
      })
      .catch((error: AxiosError) => {
        let { message }: any = error.response?.data;
        console.log("🚀 ~ file: project.ts:30 ~ return ~ message:", message);
        Swal.fire("Error", message, "error");
      });
  };
};

//* ACTUALIZA UN PROYECTO  *//
export const startUpdateProject = ({ ...project }) => {
  const token = localStorage.getItem("accessToken");
  return async (dispatch: any) => {
    await axios
      .put(
        `${process.env.NEXT_PUBLIC_API_URL}/project`,
        { ...project },
        { headers: { accessToken: token } }
      )
      .then((resp) => {
        dispatch(updateProject(resp.data.updatedProject));
        dispatch(projectsStartLoading());
        Toast.fire({
          icon: "success",
          title: `Proyecto Actualizado`
        });
      })
      .catch((error: AxiosError) => {
        let { message }: any = error.response?.data;
        console.log("🚀 ~ file: project.ts:57 ~ return ~ message:", message);
        Swal.fire("Error", "Error al editar proyecto", "error");
      });
  };
};

//* CAMBIA EL ESTADO DE UN PROYECTO *//
export const changeProjectStatus = (project: IProject, newStatus: string) => {
  const token = localStorage.getItem("accessToken");
  return async (dispatch: any) => {
    await axios
      .put(
        `${process.env.NEXT_PUBLIC_API_URL}/project`,
        {
          ...project,
          status: newStatus
        },
        { headers: { accessToken: token } }
      )
      .then((resp) => {
        dispatch(updateProject(resp.data.updatedProject));
        dispatch(projectsStartLoading());
        Toast.fire({
          icon: "success",
          title: `Proyecto Actualizado`
        });
      })
      .catch((error: AxiosError) => {
        let { message }: any = error.response?.data;
        console.log("🚀 ~ file: project.ts:112 ~ return ~ message:", message);
        Swal.fire("Error", "Error al cambiar el estado del proyecto", "error");
      });
  };
};

// * ESTABLECE EN EL PROYECTO EL ID DE LA OFERTA FINAL *//
export const setFinalOfferId = (project: IProject, offer: IOffer) => {
  const token = localStorage.getItem("accessToken");
  return async (dispatch: any) => {
    if (project.finalOfferId !== "") {
      await axios
        .get(`${process.env.NEXT_PUBLIC_API_URL}/offer/${project.finalOfferId}`, {
          headers: { accessToken: token }
        })
        .then((resp) => {
          let { BDOffer } = resp.data;
          dispatch(startUpdateOffer({ ...BDOffer, isFinalOffer: false }));
          dispatch(offersStartLoading(project._id));
          dispatch(loadSelectedProject(project._id));
        })
        .catch((error: AxiosError) => {
          let { message }: any = error.response?.data;
          console.log("🚀 ~ file: project.ts:133 ~ return ~ message:", message);
          Swal.fire("Error", "Error establecer la oferta como final", "error");
        });
    }
    dispatch(
      startUpdateProject({
        ...project,
        totalValue: offer?.value,
        finalOfferId: offer?._id,
        payMethod: offer?.representativeName
      })
    );
    dispatch(loadSelectedProject(project._id));
    dispatch(startUpdateOffer({ ...offer, isFinalOffer: true }));
  };
};

//* CARGA TODOS LOS PROYECTOS *//
export const projectsStartLoading = () => {
  const token = localStorage.getItem("accessToken");
  return async (dispatch: any) => {
    await axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/project`, { headers: { accessToken: token } })
      .then((resp) => {
        let { listOfProjects } = resp.data;
        dispatch(projectLoaded(listOfProjects));
      })
      .catch((error: AxiosError) => {
        let { message }: any = error.response?.data;
        console.log("🚀 ~ file: project.ts:138 ~ return ~ message:", message);
        Swal.fire("Error", "Error al cargar los proyectos", "error");
      });
  };
};

//* ELIMINA UN PROYECTO POR SI ID *//
export const startDeleteProject = (id: string) => {
  const token = localStorage.getItem("accessToken");
  return async (dispatch: any) => {
    await axios
      .delete(`${process.env.NEXT_PUBLIC_API_URL}/project?id=${id}`, {
        headers: { accessToken: token }
      })
      .then(() => {
        dispatch(deleteProject(id));
        dispatch(projectsStartLoading());
        Toast.fire({
          icon: "success",
          title: "Proyecto Eliminado"
        });
      })
      .catch((error: AxiosError) => {
        let { message }: any = error?.response?.data;
        console.log("🚀 ~ file: project.ts:162 ~ return ~ message:", message);
        Swal.fire("Error", "Error al eliminar el proyecto", "error");
      });
  };
};

//* CARGA LA INFORMACION DE UN PROYECTO *//
export const loadSelectedProject = (id: string) => {
  const token = localStorage.getItem("accessToken");
  return async (dispatch: any) => {
    await axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/project/${id}`, { headers: { accessToken: token } })
      .then((resp) => {
        let { BDProject } = resp.data;
        dispatch(selectedProject(BDProject));
      })
      .catch((error: AxiosError) => {
        console.log("🚀 ~ return ~ error:", error);
        let { message }: any = error?.response?.data;
        Swal.fire("Error", "Error al cargar el proyecto seleccionado", "error");
      });
  };
};

const addProject = ({ ...project }) => ({
  type: types.addProject,
  payload: {
    project
  }
});

export const updateProject = ({ ...project }) => ({
  type: types.updateProject,
  payload: {
    project
  }
});

export const projectLoaded = (projects: IProject[]) => ({
  type: types.projectsLoaded,
  payload: projects
});

export const clearOffer = () => {
  return {
    type: types.clearOffer
  };
};

const deleteProject = (id: string) => ({
  type: types.deleteProject,
  payload: {
    id
  }
});
const selectedProject = ({ ...project }) => ({
  type: types.selectedProject,
  payload: { ...project }
});

export const editItemList = (items: IItem[]) => ({
  type: types.editItemList,
  payload: items
});

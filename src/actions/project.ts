import axios, { AxiosError } from "axios";
import Swal from "sweetalert2";

import { IProject } from "@/models/project";
import { Toast } from "@/helpers/customAlert";
import { types } from "@/types/types";

//* CREA UN NUEVO PROYECTO *//
export const startAddProject = ({ ...project }) => {
  const token = localStorage.getItem("accessToken");
  return async (dispatch: any) => {
    await axios
      .post(
        `${process.env.NEXT_PUBLIC_API_URL}/project`,
        {
          clientName: project.clientName,
          clientNumber: project.clientNumber,
          currency: project.currency,
          deliveryDate: project.deliveryDate,
          expenses: project.expenses,
          initDate: project.initDate,
          itemsList: project.itemsList,
          payMethod: project.payMethod,
          profits: project.profits,
          projectName: project.projectName,
          projectNumber: project.projectNumber.toString(),
          status: project.status,
          totalValue: project.totalValue,
        },
        { headers: { accessToken: token } }
      )
      .then((project) => {
        dispatch(addProject(project));
        dispatch(projectsStartLoading());
        Toast.fire({
          icon: "success",
          title: "Proyecto Creado",
        });
      })
      .catch((error: AxiosError) => {
        let { message }: any = error.response?.data;
        console.log("🚀 ~ file: project.ts:40 ~ return ~ message:", message);
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
        {
          _id: project._id,
          clientName: project.clientName,
          clientNumber: project.clientNumber,
          currency: project.currency,
          deliveryDate: project.deliveryDate,
          expenses: project.expenses,
          initDate: project.initDate,
          itemsList: project.itemsList,
          payMethod: project.payMethod,
          profits: project.profits,
          projectName: project.projectName,
          projectNumber: project.projectNumber,
          status: project.status,
          totalValue: project.totalValue,
        },
        { headers: { accessToken: token } }
      )
      .then((project) => {
        dispatch(updateProject(project));
        dispatch(projectsStartLoading());
        Toast.fire({
          icon: "success",
          title: `Proyecto Actualizado`,
        });
      })
      .catch((error: AxiosError) => {
        let { message }: any = error.response?.data;
        console.log("🚀 ~ file: project.ts:80 ~ return ~ message:", message);
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
          _id: project._id,
          clientName: project.clientName,
          clientNumber: project.clientNumber,
          currency: project.currency,
          deliveryDate: project.deliveryDate,
          expenses: project.expenses,
          initDate: project.initDate,
          itemsList: project.itemsList,
          payMethod: project.payMethod,
          profits: project.profits,
          projectName: project.projectName,
          projectNumber: project.projectNumber,
          status: newStatus,
          totalValue: project.totalValue,
        },
        { headers: { accessToken: token } }
      )
      .then((project) => {
        dispatch(updateProject(project));
        dispatch(projectsStartLoading());
        Toast.fire({
          icon: "success",
          title: `Proyecto Actualizado`,
        });
      })
      .catch((error: AxiosError) => {
        let { message }: any = error.response?.data;
        console.log("🚀 ~ file: project.ts:120 ~ return ~ message:", message);
        Swal.fire("Error", "Error al cambiar el estado del proyecto", "error");
      });
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
        console.log("🚀 ~ file: project.ts:99 ~ return ~ message:", message);
        Swal.fire("Error", "Error al cargar los proyectos", "error");
      });
  };
};

//* ELIMINA UN PROYECTO POR SI ID *// 
export const startDeleteProject = (id: string) => {
  const token = localStorage.getItem("accessToken");
  return async (dispatch: any) => {
    await axios
      .patch(`${process.env.NEXT_PUBLIC_API_URL}/project`, { id }, { headers: { accessToken: token } })
      .then(() => {
        dispatch(deleteProject(id));
        dispatch(projectsStartLoading());
        Toast.fire({
          icon: "success",
          title: "Proyecto Eliminado",
        });
      })
      .catch((error: AxiosError) => {
        let { message }: any = error.response?.data;
        console.log("🚀 ~ file: project.ts:118 ~ return ~ message:", message);
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
        let { message }: any = error.response?.data;
        console.log("🚀 ~ file: project.ts:137 ~ return ~ message:", message);
        Swal.fire("Error", "Error al cargar el proyecto seleccionado", "error");
      });
  };
};

const addProject = ({ ...project }) => ({
  type: types.addProject,
  payload: {
    project
  },
});

export const updateProject = ({ ...project }) => ({
  type: types.updateProject,
  payload: {
    project
  },
});

export const projectLoaded = (projects: IProject[]) => ({
  type: types.projectsLoaded,
  payload: projects,
});
export const clearOffer = () => {
  console.log('Clear')
  return {
  type: types.clearOffer,
}};

const deleteProject = (id: string) => ({
  type: types.deleteProject,
  payload: {
    id,
  },
});
const selectedProject = (project: any) => ({
  type: types.selectedProject,
  payload: project,
});

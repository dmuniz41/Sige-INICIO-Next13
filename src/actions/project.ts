import axios, { AxiosError } from "axios";
import Swal from "sweetalert2";

import { Toast } from "@/helpers/customAlert";
import { types } from "@/types/types";

export const startAddProject = ({ ...project }): any => {
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
        console.log("🚀 ~ file: project.ts:42 ~ return ~ message:", message);
        Swal.fire("Error", message, "error");
      });
  };
};

export const startUpdateProject = ({ ...project }): any => {
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
        console.log("🚀 ~ file: project.ts:82 ~ return ~ message:", message);
        Swal.fire("Error", "Error al editar proyecto", "error");
      });
  };
};

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

export const startDeleteProject = (id: string): any => {
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
        console.log("🚀 ~ file: project.ts:120 ~ return ~ message:", message);
        Swal.fire("Error", "Error al eliminar el proyecto", "error");
      });
  };
};

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
    clientNumber: project.clientNumber,
    clientName: project.clientName,
    projectName: project.projectName,
    payMethod: project.payMethod,
    currency: project.currency,
    initDate: project.initDate,
    deliveryDate: project.deliveryDate,
    projectNumber: project.projectNumber,
    itemsList: project.itemsList,
    status: project.status,
    expenses: project.expenses,
    profits: project.profits,
    totalValue: project.totalValue,
  },
});

export const updateProject = ({ ...project }) => ({
  type: types.updateProject,
  payload: {
    clientNumber: project.clientNumber,
    clientName: project.clientName,
    projectName: project.projectName,
    payMethod: project.payMethod,
    currency: project.currency,
    initDate: project.initDate,
    deliveryDate: project.deliveryDate,
    projectNumber: project.projectNumber,
    itemsList: project.itemsList,
    status: project.status,
    expenses: project.expenses,
    profits: project.profits,
    totalValue: project.totalValue,
  },
});
export const projectLoaded = (projects: any) => ({
  type: types.projectsLoaded,
  payload: projects,
});
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

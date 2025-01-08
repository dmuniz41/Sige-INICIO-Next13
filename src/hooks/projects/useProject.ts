import { useQuery } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import Swal from "sweetalert2";

// **
// @abstract: Return a project by its projectId
// @return: IProject
// */
const getProjectByIdAPI = async (projectId: string) => {
  const token = localStorage.getItem("accessToken");
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/project/${projectId}`,
      {
        headers: { accessToken: token }
      }
    );
    return response.data;
  } catch (error: any) {
    const { message }: any = error?.response?.data;
    console.log("🚀 ~ getProjectByIdAPI ~  message:", message);
    Swal.fire("Error", "Error al cargar el proyecto seleccionado", "error");
  }
};

export const useGetProjectById = (projectId: string) => {
  return useQuery({
    queryKey: ["useGetProjectById", projectId],
    queryFn: () => getProjectByIdAPI(projectId),
    staleTime: 60000,
    enabled: !!projectId // Only run the query if projectId is truthy
  });
};

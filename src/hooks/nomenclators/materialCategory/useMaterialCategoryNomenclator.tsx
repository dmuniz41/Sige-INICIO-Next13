import { MaterialCategoryNomenclators } from "@/db/migrations/schema";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const getMaterialCategoryNomenclatorsAPI = async () => {
  const token = localStorage.getItem("accessToken");
  const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/nomenclators/material`, {
    headers: { accessToken: token }
  });
  return response.data;
};

const useGetMaterialCategoryNomenclator = () => {
  const query = useQuery({
    queryKey: ["getMaterialCategoryNomenclators"],
    queryFn: getMaterialCategoryNomenclatorsAPI
  });

  return query;
};

export const useMaterialCategoryNomenclator = () => {
  return { useGetMaterialCategoryNomenclator };
};

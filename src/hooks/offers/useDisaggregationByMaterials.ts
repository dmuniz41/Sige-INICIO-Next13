import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const disaggregationByMaterialsAPI = async (finalOfferId: string) => {
  const token = localStorage.getItem("accessToken");
  const response = await axios.get(
    `/api/offer/materialsPerItem?finalOfferId=${finalOfferId}`,
    {
      headers: { accessToken: token }
    }
  );
  return response.data;
};

export const useDisaggregationByMaterial = (finalOfferId: string) => {
  return useQuery({
    queryKey: ["disaggregationByMaterials"],
    queryFn: () => disaggregationByMaterialsAPI(finalOfferId)
  });
};

import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const getDischargeMaterialsAPI = async (offerId: string) => {
  const token = localStorage.getItem("accessToken");
  const response = await axios.get(
    `/api/dischargeMaterials?offerId=${offerId}`,
    {
      headers: { accessToken: token }
    }
  );
  return response.data;
};

const useGetDischargeMaterials = (offerId: string) => {
  return useQuery({
    queryKey: ["getDischargeMaterials", offerId],
    queryFn: () => getDischargeMaterialsAPI(offerId)
  });
};

export default function useDischargeMaterials() {
  return {
    useGetDischargeMaterials
  };
}

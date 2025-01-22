import { IDischargeMaterials } from "@/models/dischargeExpenses";
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
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

const updateDischargeMaterialsAPI = async (
  dischargeMaterials: IDischargeMaterials
) => {
  const token = localStorage.getItem("accessToken");
  const response = await axios.put(
    `/api/dischargeMaterials`,
    {
      ...dischargeMaterials
    },
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

const useUpdateDischargeMaterials = (
  dischargeMaterials: IDischargeMaterials
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["updateDischargeMaterials"],
    mutationFn: () => updateDischargeMaterialsAPI(dischargeMaterials),
    onSuccess: () => {
      queryClient.invalidateQueries();
    },
  });
};

export default function useDischargeMaterials() {
  return {
    useGetDischargeMaterials,
    useUpdateDischargeMaterials
  };
}

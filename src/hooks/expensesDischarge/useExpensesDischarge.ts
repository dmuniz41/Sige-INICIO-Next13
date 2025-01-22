import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from "axios";

import { IExpensesDischarge } from "@/models/expensesDischarge";

const getExpensesDischargeAPI = async (offerId: string) => {
  const token = localStorage.getItem("accessToken");
  const response = await axios.get(`/api/expensesDischarge?offerId=${offerId}`, {
    headers: { accessToken: token }
  });
  return response.data;
};

const updateExpensesDischargeAPI = async (
  expensesDischarge: IExpensesDischarge
) => {
  const token = localStorage.getItem("accessToken");
  const response = await axios.put(
    `/api/expensesDischarge`,
    {
      ...expensesDischarge
    },
    {
      headers: { accessToken: token }
    }
  );
  return response.data;
};

const useGetExpensesDischarge = (offerId: string) => {
  return useQuery({
    queryKey: ["getExpensesDischarge", offerId],
    queryFn: () => getExpensesDischargeAPI(offerId)
  });
};

const useUpdateExpensesDischarge = (
  expensesDischarge: IExpensesDischarge
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["updateExpensesDischarge"],
    mutationFn: () => updateExpensesDischargeAPI(expensesDischarge),
    onSuccess: () => {
      queryClient.invalidateQueries();
    },
  });
};

export default function useExpensesDischarge() {
  return {
    useGetExpensesDischarge,
    useUpdateExpensesDischarge
  };
}

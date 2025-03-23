import { Toast } from "@/helpers/customAlert";
import { InsertWarehouse, UpdateWarehouse } from "@/types/DTOs/warehouse/warehouse";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import axios, { AxiosError } from "axios";
import Swal from "sweetalert2";

const getStockMovementsAPI = async (warehouseId: number, page: number = 1, limit: number = 10) => {
  const token = localStorage.getItem("accessToken");
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/warehouse/${warehouseId}/stockMovement?page=${page}&limit=${limit}`,
    {
      headers: { accessToken: token }
    }
  );
  return response.data;
};

const useGetStockMovements = (warehouseId: number, page: number, limit: number) => {
  const query = useQuery({
    queryKey: ["GetStockMovements"],
    queryFn: () => getStockMovementsAPI(warehouseId, page, limit),
  });

  return query;
};

export const useStockMovements = () => {
  return {
    useGetStockMovements
  };
};

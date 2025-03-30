import { useQuery } from "@tanstack/react-query";

import axios from "axios";

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
    enabled: !!warehouseId
  });

  return query;
};

export const useStockMovements = () => {
  return {
    useGetStockMovements
  };
};

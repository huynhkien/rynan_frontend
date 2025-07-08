import axiosInstance from "@/shared/configs/axios";
import { InventoryEndpoints } from "./inventoryEndpoints";
import { InventoryData, InventoryResponse } from "../type/inventoryType";

// Thêm kho
export const createInventory = async (data: InventoryData): Promise<InventoryResponse> => 
  axiosInstance.post(InventoryEndpoints.CREATE, data, {
    withCredentials: true,
});
// Xuất kho
export const removeInventory =async (data: InventoryData): Promise<InventoryResponse> => 
  axiosInstance.put(InventoryEndpoints.REMOVE_INVENTORY, data, {
    withCredentials: true,
});
// Hiển thị tất cả kho
export const getAllInventory = async(): Promise<InventoryResponse> => 
    axiosInstance.get(InventoryEndpoints.GET_ALL);

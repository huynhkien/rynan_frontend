import axiosInstance from "@/shared/configs/axios";
import {CategoryData, CategoryResponse, Data } from "../type/categoryType";
import { CategoryEndpoints } from "./categoryEndpoints";


export const createCategory = async (data: CategoryData): Promise<CategoryResponse> => 
  axiosInstance.post(CategoryEndpoints.CREATE, data, {
    withCredentials: true,
    
});
export const updateCategory = async (data: Data, id: string | number): Promise<CategoryResponse> => 
  axiosInstance.put(CategoryEndpoints.UPDATE(id), data, {
    withCredentials: true,
});
export const getAllCategory = async(): Promise<Data> => 
    axiosInstance.get(CategoryEndpoints.GET_ALL);
export const getById = async(id: string | number): Promise<Data> => 
    axiosInstance.get(CategoryEndpoints.GET_BY_ID(id));

export const GetBySlug = async(slug: string): Promise<Data> => 
    axiosInstance.get(CategoryEndpoints.GET_BY_SLUG(slug));

export const deleteCategory = async(id: string | number): Promise<Data> => 
    axiosInstance.delete(CategoryEndpoints.DELETE(id))
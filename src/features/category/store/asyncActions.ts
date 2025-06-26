import { createAsyncThunk } from "@reduxjs/toolkit";
import { getAllCategory } from "../api/categoryApi";
import { CategoryResponse } from "../type/categoryType";

export const getCategory = createAsyncThunk(
    'category/getCategory',
    async (_, { rejectWithValue }) => {
        try {
            const response: CategoryResponse = await getAllCategory();
            if (!response.success) {
                return rejectWithValue(response.message || 'API call failed');
            }
            return response.data;
        } catch (error) {
            let errorMessage = 'Đã xảy ra lỗi';
            if (error instanceof Error) {
                errorMessage = error.message;
            }
            return rejectWithValue(errorMessage);
        }
    }
);
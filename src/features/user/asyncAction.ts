import { createAsyncThunk } from '@reduxjs/toolkit';
import * as apis from './userApis';
import { UserResponse } from './userTypes';

export const getCurrent = createAsyncThunk('user/current', async (_, { rejectWithValue }) => {
    try {
        const response: UserResponse = await apis.apiGetCurrent();
        if (!response.success) return rejectWithValue(response);
        return response.data;
    } catch (error) {
        let errorMessage = 'Đã xảy ra lỗi';
        if (error instanceof Error) {
            errorMessage = error.message;
        }
        return rejectWithValue(errorMessage);
    }
});
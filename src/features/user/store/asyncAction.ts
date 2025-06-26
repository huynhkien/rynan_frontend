import { createAsyncThunk } from '@reduxjs/toolkit';
import { UserResponse } from '../type/userTypes';
import { getUserCurrent } from '../api/userApis';


export const getCurrent = createAsyncThunk('user/current', async (_, { rejectWithValue }) => {
    try {
        const response: UserResponse = await getUserCurrent();
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
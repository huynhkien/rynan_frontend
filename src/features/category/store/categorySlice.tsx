import { createSlice } from '@reduxjs/toolkit';
import { Category } from '../type/categoryType'; 
import { getCategory } from './asyncActions';

export interface CategoryState {
    categories: Category[];
    loading: boolean;
    error: string | null;
}

const initialState: CategoryState = {
    categories: [],
    loading: false,
    error: null,
};

const categorySlice = createSlice({
    name: 'category',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        resetCategories: (state) => {
            state.categories = [];
            state.loading = false;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getCategory.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getCategory.fulfilled, (state, action) => {
                state.loading = false;
                state.categories = action.payload as Category[];
                state.error = null;
             })
            .addCase(getCategory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { clearError, resetCategories } = categorySlice.actions;
export default categorySlice.reducer;
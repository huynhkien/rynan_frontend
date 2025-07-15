import { AppState } from '@/types/app/appType';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: AppState = {
  isLoading: false,
  isShowModal: false,
  modalType: null,
};

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    showModal: (
      state,
      action: PayloadAction<{ isShowModal: boolean; modalType: string | null }>
    ) => {
      state.isShowModal = action.payload.isShowModal;
      state.modalType = action.payload.modalType;
    },
    hideModal: (state) => {
      state.isShowModal = false;
      state.modalType = null;
    },
  },
});

export const { showModal, hideModal } = appSlice.actions;
export default appSlice.reducer;

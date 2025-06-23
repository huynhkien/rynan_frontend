import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import * as actions from './asyncAction';
import { UserData } from './userTypes';



export interface UserState {
  isLogin: boolean;
  current: UserData | null;
  token: string | null;
  isLoading: boolean;
  mes: string;
}

interface LoginPayload {
  isLogin: boolean;
  token: string;
  userData: UserData;
}

const initialState: UserState = {
  isLogin: false,
  current: null,
  token: null,
  isLoading: false,
  mes: '',
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<LoginPayload>) => {
      const { isLogin, token, userData } = action.payload;
      state.isLogin = isLogin;
      state.token = token;
      state.current = userData;
    },
    logout: (state) => {
      state.isLogin = false;
      state.current = null;
      state.token = null;
      state.isLoading = false;
      state.mes = '';
    },
    clearMessage: (state) => {
      state.mes = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(actions.getCurrent.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(actions.getCurrent.fulfilled, (state, action: PayloadAction<UserData>) => {
        state.isLoading = false;
        state.current = action.payload; 
        state.isLogin = true;
      })
      .addCase(actions.getCurrent.rejected, (state) => {
        state.isLoading = false;
        state.current = null;
        state.isLogin = false;
        state.token = null;
        state.mes = 'Phiên đăng nhập đã hết hạn, hãy đăng nhập lại';
      });
  }
});

export const { login, logout, clearMessage } = userSlice.actions;
export default userSlice.reducer;
import { OrderProductItem, QuoteProductItem } from './../type/userTypes';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import * as actions from './asyncAction';
import { CartItem, LoginPayload, UserData, UserState } from '../type/userTypes';
import { getFromLocalStorage, removeToLocalStorage, setToLocalStorage } from '../utils/helper';

// Khởi tạo trang thái giỏ hàng
const initialCart: CartItem[] = getFromLocalStorage('cart', []);
const initialProductQuote: QuoteProductItem[] = getFromLocalStorage('quote_product', []);
const initialProductOrder: OrderProductItem[] = getFromLocalStorage('order_product', []);
// Khởi tạo trạng thái người dùng
const initialState: UserState = {
  isLogin: false,
  current: null,
  token: null,
  isLoading: false,
  mes: '',
  cart: initialCart,
  quoteProduct: initialProductQuote,
  orderProduct: initialProductOrder
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
    // Xử lý quản lý trạng thái thêm sản phẩm vào giỏ hàng
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const {pid, quantity, thumb, name, price} = action.payload;
      const existingItem = state.cart.findIndex(
        item => item.pid === pid
      );
      if(existingItem !== -1) {
        state.cart[existingItem].quantity += quantity;
      }else{
        state.cart.push({pid, quantity, thumb, name, price});
      }
      setToLocalStorage('cart', state.cart);
    },
    updateQuantityCart: (state, action) => {
      const {pid, quantity} = action.payload;
      state.cart = state.cart.map(item => {
        if(item.pid === pid){
          return {...item, quantity};
        }
        return item;
      });
      setToLocalStorage('cart', state.cart);
    },
    removeItemCart: (state, action) => {
      const {pid} = action.payload;
      state.cart = state.cart.filter(
        item => !(item.pid === pid)
      );
      setToLocalStorage('cart', state.cart);
    },
    removeAllCart: (state) => {
      state.cart = [];
      removeToLocalStorage('cart');
    },
    // Xử lý thêm sản phâm trong danh sách báo giá
    addProductToQuote: (state, action: PayloadAction<QuoteProductItem>) => {
      const {pid} = action.payload;
      const existingItem = state.quoteProduct.findIndex(
        item => item.pid === pid
      );
      if(existingItem !== -1) {
        alert('Sản phẩm đã tồn tại trong danh sách báo giá')
      }else{
        state.quoteProduct.push({pid});
      }
      setToLocalStorage('quote_product', state.quoteProduct);
    },
    removeItemQuoteProduct: (state, action) => {
      const {pid} = action.payload;
      state.quoteProduct = state.quoteProduct.filter(
        item => !(item.pid === pid)
      );
      setToLocalStorage('quote_product', state.quoteProduct);
    },
    removeAllQuoteProduct: (state) => {
      state.quoteProduct = [];
      removeToLocalStorage('quote_product');
    },
    // Xử lý thêm sản phâm trong danh sách báo giá
    addProductToOrder: (state, action: PayloadAction<OrderProductItem>) => {
      const {pid, quantity, name, price, priceType, thumb} = action.payload;
      const existingItem = state.orderProduct.findIndex(
        item => item.pid === pid 
      );
      if(existingItem !== -1) {
        state.orderProduct[existingItem].quantity += quantity;
      }else{
        state.orderProduct.push({pid, quantity, name, price, priceType, thumb});
      }
      setToLocalStorage('order_product', state.orderProduct);
    },
    removeItemOrderProduct: (state, action) => {
      const {pid} = action.payload;
      state.orderProduct = state.orderProduct.filter(
        item => !(item.pid === pid)
      );
      setToLocalStorage('order_product', state.orderProduct);
    },
    removeAllOrderProduct: (state) => {
      state.orderProduct = [];
      removeToLocalStorage('order_product');
    },
  },
  
  extraReducers: (builder) => {
    builder
      .addCase(actions.getCurrent.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(actions.getCurrent.fulfilled, (state, action) => {
        state.isLoading = false;
        state.current = action.payload as UserData; 
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

export const { 
  login, 
  logout, 
  clearMessage, 
  addToCart, 
  updateQuantityCart,
  removeItemCart, 
  removeAllCart,
  addProductToQuote,
  removeAllQuoteProduct,
  removeItemQuoteProduct,
  addProductToOrder,
  removeAllOrderProduct,
  removeItemOrderProduct
} 
  = userSlice.actions;
export default userSlice.reducer;
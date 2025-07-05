import { OrderProductItem, QuoteProductItem } from './../type/userTypes';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import * as actions from './asyncAction';
import { CartItem, LoginPayload, UserData, UserState } from '../type/userTypes';
import { getFromLocalStorage, removeToLocalStorage, setToLocalStorage } from '../utils/helper';
import { ReceiptMaterialData, ReceiptProductData } from '@/features/receipt/type/receiptType';

// Khởi tạo trang thái giỏ hàng
const initialCart: CartItem[] = getFromLocalStorage('cart', []);
const initialProductQuote: QuoteProductItem[] = getFromLocalStorage('quote_product', []);
const initialProductOrder: OrderProductItem[] = getFromLocalStorage('order_product', []);
const initialMaterialReceipt: ReceiptMaterialData[] = getFromLocalStorage('material_receipt', []);
const initialProductReceipt: ReceiptProductData[] = getFromLocalStorage('product_receipt', []);
// Khởi tạo trạng thái người dùng
const initialState: UserState = {
  isLogin: false,
  current: null,
  token: null,
  isLoading: false,
  mes: '',
  cart: initialCart,
  quoteProduct: initialProductQuote,
  orderProduct: initialProductOrder,
  materialReceipt: initialMaterialReceipt,
  productReceipt: initialProductReceipt
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
        return;
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
    // Xử lý thêm nguyên liệu trong kho
    addMaterialToReceipt: (state, action: PayloadAction<ReceiptMaterialData>) => {
      const {mid, quantity, name, specification, price, batchNumber, expiryDate, manufacturingDate} = action.payload;
      const existingItem = state.materialReceipt.findIndex(
        item => item.mid === mid 
      );
      if(existingItem !== -1) {
        return;
      }else{
        state.materialReceipt.push({mid, specification, quantity, name, price, batchNumber, expiryDate, manufacturingDate});
      }
      setToLocalStorage('material_receipt', state.materialReceipt);
    },
    
    removeItemMaterialReceipt: (state, action) => {
      const {mid} = action.payload;
      state.materialReceipt = state.materialReceipt.filter(
        item => !(item.mid === mid)
      );
      setToLocalStorage('material_receipt', state.materialReceipt);
    },
    removeAllMaterialReceipt: (state) => {
      state.materialReceipt = [];
      removeToLocalStorage('material_receipt');
    },
   updateMaterialByMid: (state, action: PayloadAction<ReceiptMaterialData>) => {
    const {mid, quantity, name, specification, price, batchNumber, expiryDate, manufacturingDate} = action.payload;
    const existingItemIndex = state.materialReceipt.findIndex(item => item.mid === mid);
    
    if(existingItemIndex !== -1) {
      state.materialReceipt[existingItemIndex] = {
        mid, 
        quantity, 
        name, 
        specification, 
        price, 
        batchNumber, 
        expiryDate, 
        manufacturingDate
      };
      setToLocalStorage('material_receipt', state.materialReceipt);
    }
},
    // Xử lý thêm sản phâm trong kho
    addProductToReceipt: (state, action: PayloadAction<ReceiptProductData>) => {
      const {pid, name, quantity, specification, batchNumber, expiryDate, manufacturingDate} = action.payload;
      const existingItem = state.productReceipt.findIndex(
        item => item.pid === pid 
      );
      if(existingItem !== -1) {
        return;
      }else{
        state.productReceipt.push({pid, specification, quantity, name, batchNumber, expiryDate, manufacturingDate});
      }
      setToLocalStorage('product_receipt', state.productReceipt);
    },
    
    removeItemProductReceipt: (state, action) => {
      const {pid} = action.payload;
      state.productReceipt = state.productReceipt.filter(
        item => !(item.pid === pid)
      );
      setToLocalStorage('product_receipt', state.productReceipt);
    },
    removeAllProductReceipt: (state) => {
      state.productReceipt = [];
      removeToLocalStorage('product_receipt');
    },
   updateProductByPid: (state, action: PayloadAction<ReceiptProductData>) => {
    const {pid, quantity, name, specification, batchNumber, expiryDate, manufacturingDate} = action.payload;
    const existingItemIndex = state.productReceipt.findIndex(item => item.pid === pid);
    
    if(existingItemIndex !== -1) {
      state.productReceipt[existingItemIndex] = {
        pid, 
        quantity, 
        name, 
        specification, 
        batchNumber, 
        expiryDate, 
        manufacturingDate
      };
      setToLocalStorage('product_receipt', state.productReceipt);
    }
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
  removeItemOrderProduct,
  addMaterialToReceipt,
  removeAllMaterialReceipt,
  removeItemMaterialReceipt,
  updateMaterialByMid,
  addProductToReceipt,
  removeAllProductReceipt,
  removeItemProductReceipt,
  updateProductByPid
} 
  = userSlice.actions;
export default userSlice.reducer;
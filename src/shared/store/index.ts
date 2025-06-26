import { configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import storage from '@/shared/utils/storage';

import {
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';

import userReducer from '@/features/user/store/userSlice';
import categoryReducer, { CategoryState } from '@/features/category/store/categorySlice';
import { UserState } from '@/features/user/type/userTypes';

interface PersistConfig<T> {
  key: string;
  storage: typeof storage;
  whitelist?: Array<keyof T>;
}

const userConfig: PersistConfig<UserState> = {
  key: 'shop/user',
  storage,
  whitelist: ['isLogin', 'token', 'current']
};
const categoryConfig: PersistConfig<CategoryState> = {
  key: 'shop/category',
  storage,
  whitelist: ['categories'] 
};

const persistedUserReducer = persistReducer<UserState>(
  userConfig,
  userReducer
);
const persistedCategoryReducer = persistReducer<CategoryState>(
  categoryConfig,
  categoryReducer
);
export const store = configureStore({
  reducer: {
    user: persistedUserReducer,
    category: persistedCategoryReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const persistor = persistStore(store);
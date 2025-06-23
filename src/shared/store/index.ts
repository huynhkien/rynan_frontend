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

import userReducer, { UserState } from '../../features/user/userSlice';

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

const persistedUserReducer = persistReducer<UserState>(
  userConfig,
  userReducer
);

export const store = configureStore({
  reducer: {
    user: persistedUserReducer
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
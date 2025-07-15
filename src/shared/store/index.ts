import { configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import storage from '@/shared/utils/storage';
import {
  FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER,
} from 'redux-persist';

import userReducer from '@/features/user/store/userSlice';
import { UserState } from '@/features/user/type/userTypes';
import appReducer from './appSlice';

interface PersistConfig<T> {
  key: string;
  storage: typeof storage;
  whitelist?: Array<keyof T>;
}

const userConfig: PersistConfig<UserState> = {
  key: 'shop/user',
  storage,
  whitelist: ['isLogin', 'token', 'current'],
};

const persistedUserReducer = persistReducer<UserState>(userConfig, userReducer);

export const store = configureStore({
  reducer: {
    user: persistedUserReducer,
    app: appReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

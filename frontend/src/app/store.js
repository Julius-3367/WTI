import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import authReducer from '../features/auth/authSlice';
import usersReducer from '../features/users/usersSlice';
import candidatesReducer from '../features/candidates/candidateSlice';
import { setupAxiosInterceptors } from '../api/axios';

// Configure persistence for the auth slice
const authPersistConfig = {
  key: 'auth',
  storage,
  whitelist: ['accessToken', 'refreshToken', 'user', 'isAuthenticated'],
};

const rootReducer = {
  auth: persistReducer(authPersistConfig, authReducer),
  users: usersReducer,
  candidates: candidatesReducer,
};

// Create store without interceptors first
const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

// Setup axios interceptors with the store
setupAxiosInterceptors(store);

// Initialize persistor
export const persistor = persistStore(store);

export { store };

// TypeScript types removed for JavaScript project

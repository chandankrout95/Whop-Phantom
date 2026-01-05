import { configureStore } from "@reduxjs/toolkit";
import campaignReducer from "./campaignSlice";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage"; // localStorage

const persistConfig = {
  key: "root",
  storage,
};

const persistedCampaignReducer = persistReducer(persistConfig, campaignReducer);

export const store = configureStore({
  reducer: {
    campaigns: persistedCampaignReducer,
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

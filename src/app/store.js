import { configureStore } from "@reduxjs/toolkit";
import publicAnnotator from "../features/public-annotator/slice";
import privateAnnotator from "../features/private-annotator/slice";
import { firebaseReducer } from "react-redux-firebase";

export const store = configureStore({
  reducer: {
    publicAnnotator,
    privateAnnotator,
    firebase: firebaseReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

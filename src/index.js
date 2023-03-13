import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { store } from "./app/store";
import { Provider } from "react-redux";
import { ReactReduxFirebaseProvider } from "react-redux-firebase";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { StepsTheme } from "chakra-ui-steps";
import { BrowserRouter } from "react-router-dom";
import { injectStore } from "./features/public-annotator/client";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";

const root = ReactDOM.createRoot(document.getElementById("root"));

const firebaseConfig = {
  apiKey: "AIzaSyDpitmnOEaY6YjAOqDmvn0tfEYIyauGjSo",
  authDomain: "annopedia-8479c.firebaseapp.com",
  projectId: "annopedia-8479c",
  storageBucket: "annopedia-8479c.appspot.com",
  messagingSenderId: "585061864747",
  appId: "1:585061864747:web:fbe5de56a3fe398953216e",
};
firebase.initializeApp(firebaseConfig);

export const rrfProviderProps = {
  firebase,
  config: {},
  dispatch: store.dispatch,
};
injectStore(store);

const extendedTheme = extendTheme({
  components: {
    Steps: StepsTheme,
  },
});

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <ReactReduxFirebaseProvider {...rrfProviderProps}>
        <ChakraProvider theme={extendedTheme}>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </ChakraProvider>
      </ReactReduxFirebaseProvider>
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

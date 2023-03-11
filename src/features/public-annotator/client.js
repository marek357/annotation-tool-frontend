import axios from "axios";

// https://redux.js.org/faq/code-structure#how-can-i-use-the-redux-store-in-non-component-files
// https://stackoverflow.com/questions/43051291/attach-authorization-header-for-all-axios-requests
let store;

export const injectStore = (injectedStore) => {
  store = injectedStore;
  store.subscribe(() => {
    const state = store.getState();
    const auth = state.firebase.auth;
    if (auth === undefined || !auth.isLoaded || auth.isEmpty) return;
    const token = auth.stsTokenManager.accessToken;
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  });
};

const configureClient = (client) => {
  client.interceptors.request.use(
    async (config) => {
      if (store === undefined) return config;

      const state = store.getState();
      const auth = state.firebase.auth;
      if (auth === undefined || auth.stsTokenManager === undefined)
        return config;

      const token = auth.stsTokenManager.accessToken;
      config.headers.Authorization = `Bearer ${token}`;
      return config;
    },
    (error) => error
  );
  return client;
};

const buildPublicAnnotatorClient = (baseURL) => {
  const config = {
    baseURL: baseURL,
    useAuth: false,
    validateStatus: (status) => 200 <= status && status < 300,
  };
  const client = axios.create(config);
  //   return client;
  return configureClient(client);
};

const testingURL = "http://localhost:8000/api";
const deploymentURL = "https://annopedia.marekmasiak.tech/api";
const testing = true;

export const client = buildPublicAnnotatorClient(
  testing ? testingURL : deploymentURL
);

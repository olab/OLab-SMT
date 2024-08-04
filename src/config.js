// Constants.js

const cfg = {
  API_RETRY_COUNT: import.meta.env.VITE_APP_API_RETRY_COUNT,
  API_URL: import.meta.env.VITE_APP_API_URL,
  APP_BASEPATH: import.meta.env.VITE_APP_BASEPATH,
  APPLICATION_ID: "SMT",
};

// export const config = process.env.NODE_ENV === "development" ? dev : prod;

export const config = cfg;

import React from "react";
import ReactDOM from "react-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import "bootstrap";

import App from "./containers/App";
import queryDefaultOptions from "./constants/queryDefaultOptions";
import "./styles/globals.scss";

const queryClient = new QueryClient({
  defaultOptions: queryDefaultOptions,
});

ReactDOM.render(
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>,
  document.getElementById("root")
);

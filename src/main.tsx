import "./index.css"

import React from "react";
import ReactDOM from "react-dom/client";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client"
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import Root from "./routes/Root";
import { Login } from "./routes/Login";
import { Signup } from "./routes/Signup";

// export const URI = "https://idontknowanymore.xyz"
export const URI = "http://localhost:5500"

const CustomRouter = createBrowserRouter([
  {
    path: "/*",
    element: <Root />
  },
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/signup",
    element: <Signup />
  }
], {
  basename: '/cookie-bite'
});

const client = new ApolloClient({
  uri: URI + "/api",
  cache: new InMemoryCache()
})

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <RouterProvider router={CustomRouter} />
    </ApolloProvider>
  </React.StrictMode>
);
import axios from "axios";

export const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost";

export const client = axios.create({
  baseURL: backendUrl,
  responseType: "json",
  headers: {
    "X-Requested-With": "XMLHttpRequest",
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": backendUrl,
  },
  withCredentials: true,
  withXSRFToken: true,
  xsrfCookieName: "XSRF-TOKEN",
  xsrfHeaderName: "X-XSRF-TOKEN",
  timeout: 7000,
});

export const apiServer = axios.create({
  baseURL: backendUrl,
  responseType: "json",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": backendUrl,
  },
});

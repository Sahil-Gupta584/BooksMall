import axios from "axios";
import { backendUrl } from "./auth-client";

export const axiosInstance = axios.create({
  baseURL: backendUrl,
  withCredentials: true,
});

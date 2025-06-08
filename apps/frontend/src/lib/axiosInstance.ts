import axios from "axios";
import { backendUrl } from "./auth";

export const axiosInstance = axios.create({
  baseURL: backendUrl,
});

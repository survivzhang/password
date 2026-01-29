import axios from "axios";
import { authUtils } from "../utils/auth";

const api = axios.create({
  baseURL: "http://localhost:3000",
  timeout: 10000,
});

api.interceptors.request.use(
  (config) => {
    const token = authUtils.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const status = error.response?.status;
    if (status === 401) {
      console.log("Unauthorized: Token expired or invalid");
    } else if (status === 403) {
      console.log("Forbidden: No permission");
    } else if (status === 404) {
      console.log("Not Found");
    } else if (status >= 500) {
      console.log("Server Error");
    }
    return Promise.reject(error);
  },
);

export const authAPI = {
  register: async (email: string, masterPassword: string) => {
    const response = await api.post("/register", {
      email,
      masterPassword,
    });
    return response.data;
  },

  login: async (email: string, masterPassword: string) => {
    const response = await api.post("/login", {
      email,
      masterPassword,
    });
    return response.data;
  },
};

export const passwordAPI = {
  getAll: async () => {
    const response = await api.get("/passwords");
    return response.data;
  },
  getOne: async (id: number) => {
    const response = await api.get(`/passwords/${id}`);
    return response.data;
  },
  create: async (data: {
    website: string;
    username: string;
    password: string;
    notes?: string;
  }) => {
    const response = await api.post("/passwords", data);
    return response.data;
  },
  update: async (
    id: number,
    data: {
      website?: string;
      username?: string;
      password?: string;
      notes?: string;
    },
  ) => {
    const response = await api.put(`/passwords/${id}`, data);
    return response.data;
  },
  delete: async (id: number) => {
    const response = await api.delete(`/passwords/${id}`);
    return response.data;
  },
};
export default api;

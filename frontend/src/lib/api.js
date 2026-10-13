import axios from "axios";

const BACKEND_URL = (process.env.REACT_APP_BACKEND_URL || "").replace(/\/+$/, "");
export const API = `${BACKEND_URL}/api`;
export const api = axios.create({ baseURL: API, withCredentials: true, timeout: 30000 });

export const submitContact = (p) => api.post("/contact", p).then((r) => r.data);
export const startAssessment = (p) => api.post("/assessments", p).then((r) => r.data);
export const completeAssessment = (id, p) => api.post(`/assessments/${id}/complete`, p).then((r) => r.data);

const admin = axios.create({ baseURL: `${API}/admin`, withCredentials: true, timeout: 30000, headers: { "X-Requested-With": "nexcare-admin" } });
export const adminApi = {
  login: (username, password) => admin.post("/login", { username, password }).then((r) => r.data),
  logout: () => admin.post("/logout").then((r) => r.data),
  me: () => admin.get("/me").then((r) => r.data),
  analytics: () => admin.get("/analytics").then((r) => r.data),
  list: (kind, params) => admin.get(`/records/${kind}`, { params }).then((r) => r.data),
  get: (kind, id) => admin.get(`/records/${kind}/${id}`).then((r) => r.data),
  update: (kind, id, body) => admin.patch(`/records/${kind}/${id}`, body).then((r) => r.data),
  remove: (kind, id) => admin.delete(`/records/${kind}/${id}`).then((r) => r.data),
  retry: (id) => admin.post(`/records/contacts/${id}/retry-delivery`).then((r) => r.data),
  audit: (page) => admin.get("/audit", { params: { page } }).then((r) => r.data),
  export: (kind, params) => admin.get(`/export/${kind}`, { params, responseType: "blob" }),
};

export const brochureURL = "/brochure/NexCare-Healthcare-Consulting-Brochure.pdf";
export const BROCHURE_FILENAME = "NexCare-Healthcare-Consulting-Brochure.pdf";
export { trackBrochure } from "./tracking";

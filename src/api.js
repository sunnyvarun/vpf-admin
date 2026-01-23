// src/api.js
import api from "./apiClient";
import { API_BASE_URL } from "./config";

/* ================= AUTH ================= */

export async function adminLogin(username, password) {
  const res = await fetch(`${API_BASE_URL}/auth/login.php`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Login failed");
  }

  localStorage.setItem("vpf_admin_token", data.token);
  return data;
}

export function getToken() {
  return localStorage.getItem("vpf_admin_token");
}

export function setToken(token) {
  localStorage.setItem("vpf_admin_token", token);
}

export function logout() {
  localStorage.removeItem("vpf_admin_token");
}

/* ================= PROPERTIES ================= */

export async function fetchProperties() {
  return (await api.get("/properties/list.php")).data;
}

export async function fetchPropertyById(id) {
  return (await api.get("/properties/get.php", { params: { id } })).data;
}

export async function deleteProperty(id) {
  return (await api.post("/properties/delete.php", { id })).data;
}

export async function saveProperty(formData) {
  // formData can be FormData (images etc.)
  return (await api.post("/properties/save.php", formData)).data;
}

/* ================= SITE SETTINGS ================= */

export async function fetchSettings() {
  return (await api.get("/settings/get.php")).data;
}

export async function saveSettings(payload) {
  // payload is a plain JSON object
  // example:
  // {
  //   site_title: "...",
  //   popular_localities: ["Gachibowli", "Madhapur"]
  // }
  return (await api.post("/settings/save.php", payload)).data;
}

/* ================= PROPERTY TYPES ================= */

export async function fetchPropertyTypes() {
  return (await api.get("/property_types/list.php")).data;
}

export async function savePropertyType(obj) {
  return (await api.post("/property_types/save.php", obj)).data;
}

export async function deletePropertyType(id) {
  return (await api.post("/property_types/delete.php", { id })).data;
}

/* ================= FEATURED ================= */

export async function fetchFeatured() {
  return (await api.get("/featured/list.php")).data;
}

export async function saveFeatured(objOrForm) {
  return (await api.post("/featured/save.php", objOrForm)).data;
}

export async function deleteFeatured(id) {
  return (await api.post("/featured/delete.php", { id })).data;
}

/* ================= VIDEOS ================= */

export async function fetchVideos() {
  return (await api.get("/videos/list.php")).data;
}

export async function saveVideo(formData) {
  return (await api.post("/videos/save.php", formData)).data;
}

export async function deleteVideo(id) {
  return (await api.post("/videos/delete.php", { id })).data;
}

/* ================= REVIEWS (ADMIN) ================= */

export async function fetchReviewsAdmin() {
  return (await api.get("/reviews/list.php?approved_only=0")).data;
}

export async function approveReview(id, approved = 1) {
  return (await api.post("/reviews/approve.php", { id, approved })).data;
}

export async function deleteReview(id) {
  return (await api.post("/reviews/delete.php", { id })).data;
}

/* ================= HERO IMAGE UPLOAD ================= */

export async function uploadHeroImage(file) {
  const fd = new FormData();
  fd.append("image", file);

  const token = localStorage.getItem("vpf_admin_token");

  const res = await fetch(`${API_BASE_URL}/settings/hero-image.php`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: fd,
  });

  return res.json();
}

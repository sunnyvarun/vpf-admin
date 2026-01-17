// src/api.js
import api from "./apiClient";
import { API_BASE_URL } from "./config";

export async function adminLogin(username, password) {
  const res = await fetch(`${API_BASE_URL}/auth/login.php`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  const data = await res.json();
  localStorage.setItem("vpf_admin_token", data.token);

  if (!res.ok) throw new Error(data.error || "Login failed");
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

export async function fetchProperties() {
  const res = await api.get("/properties/list.php");
  return res.data;
}

export async function fetchPropertyById(id) {
  const res = await api.get(`/properties/get.php`, { params: { id } });
  return res.data;
}

export async function deleteProperty(id) {
  const res = await api.post("/properties/delete.php", { id });
  return res.data;
}

export async function saveProperty(formData) {
  const res = await api.post("/properties/save.php", formData, );
  return res.data;
}
// settings
export async function fetchSettings() {
  const res = await api.get('/settings/get.php');
  return res.data;
}
export async function saveSettings(payload) {
  // payload = { hero_title: "...", phone_number: "...", ... }
  const res = await api.post('/settings/save.php', payload);
  return res.data;
}

// property types
export async function fetchPropertyTypes() {
  const res = await api.get('/property_types/list.php');
  return res.data;
}
export async function savePropertyType(obj) {
  // obj = { id?, name, slug, position? }
  const res = await api.post('/property_types/save.php', obj);
  return res.data;
}
export async function deletePropertyType(id) {
  const res = await api.post('/property_types/delete.php', { id });
  return res.data;
}
// Featured
export async function fetchFeatured() { return (await api.get('/featured/list.php')).data; }
export async function saveFeatured(objOrForm) { return (await api.post('/featured/save.php', objOrForm)).data; }
export async function deleteFeatured(id) { return (await api.post('/featured/delete.php',{id})).data; }

// Videos
export async function fetchVideos() { return (await api.get('/videos/list.php')).data; }
export async function saveVideo(formData) { return (await api.post('/videos/save.php', formData)).data; }
export async function deleteVideo(id) { return (await api.post('/videos/delete.php', {id})).data; }

// Reviews (admin)
export async function fetchReviewsAdmin() { return (await api.get('/reviews/list.php?approved_only=0')).data; }
export async function approveReview(id, approved=1) { return (await api.post('/reviews/approve.php', {id, approved})).data; }
export async function deleteReview(id) { return (await api.post('/reviews/delete.php', {id})).data; }
export async function uploadHeroImage(file) {
  const fd = new FormData();
  fd.append("image", file);

  const token = localStorage.getItem("vpf_admin_token");

  const res = await fetch(
    `${API_BASE_URL}/settings/hero-image.php`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: fd,
    }
  );

  return res.json();
}

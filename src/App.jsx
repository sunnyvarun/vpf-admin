// src/App.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage.jsx";
import AdminLayout from "./layout/AdminLayout.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import PropertiesAdminList from "./pages/PropertiesAdminList.jsx";
import PropertyForm from "./pages/PropertyForm.jsx";
import SettingsPage from "./pages/SettingsPage.jsx";
import PropertyTypesPage from "./pages/PropertyTypesPage.jsx";
import FeaturedAdmin from "./pages/FeaturedAdmin.jsx";
import VideoGalleryAdmin from "./pages/VideoGalleryAdmin.jsx";
import ReviewsAdmin from "./pages/ReviewsAdmin.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<AdminLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="properties" element={<PropertiesAdminList />} />
        <Route path="properties/new" element={<PropertyForm />} />
        <Route path="properties/:id/edit" element={<PropertyForm />} />
        <Route path="settings" element={<SettingsPage />} />
<Route path="property-types" element={<PropertyTypesPage />} />
<Route path="featured" element={<FeaturedAdmin />} />
  <Route path="videos" element={<VideoGalleryAdmin />} />
  <Route path="reviews" element={<ReviewsAdmin />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

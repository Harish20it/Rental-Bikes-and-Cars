import { BrowserRouter, Routes, Route } from "react-router-dom";

import NotFound from "./pages/NotFound";
import Login from "./Component/Login";
import Register from "./Component/Register";
import UserDashboard from "./Component/UserDashborad";
import AdminDashboard from "./Component/AdminDashboard";
import MainPage from "./Component/MainPage"; // import the MainPage

const App = () => (
  <BrowserRouter>
    <Routes>
      {/*Main page as the first landing page */}
      <Route path="/" element={<MainPage />} />

      {/* Auth pages */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Dashboards */}
      <Route path="/user-dashboard" element={<UserDashboard />} />
      <Route path="/admin-dashboard" element={<AdminDashboard />} />

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  </BrowserRouter>
);

export default App;

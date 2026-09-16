import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import DoctorLogin from "./pages/DoctorLogin";
import Upload from "./pages/Upload";
import Results from "./pages/Results";
import Dashboard from "./pages/Dashboard";
import History from "./pages/History";
import Processing from "./pages/Processing";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<DoctorLogin />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/results" element={<Results />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/history" element={<History />} />
        <Route path="/processing" element={<Processing />} />
      </Routes>
    </BrowserRouter>
  );
}
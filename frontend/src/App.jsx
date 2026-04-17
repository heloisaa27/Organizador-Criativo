import { BrowserRouter, Routes, Route } from "react-router-dom"

import Dashboard from "./pages/Dashboard"
import Project from "./pages/Project"

export default function App() {

  return (
    <BrowserRouter>

      <Routes>

        {/* DASHBOARD */}
        <Route path="/" element={<Dashboard />} />

        {/* PROJETO COM ID */}
        <Route path="/project/:id" element={<Project />} />

        {/* FALLBACK (evita erro de rota) */}
        <Route path="*" element={<Dashboard />} />

      </Routes>

    </BrowserRouter>
  )
}

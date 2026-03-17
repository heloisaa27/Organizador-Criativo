import { BrowserRouter, Routes, Route } from "react-router-dom"

import Dashboard from "./pages/Dashboard"
import Story from "./pages/Story"
import ChapterEditor from "./pages/ChapterEditor"

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Dashboard />} />
        <Route path="/story" element={<Story />} />
        <Route path="/chapter" element={<ChapterEditor />} />

      </Routes>
    </BrowserRouter>
  )
}

export default App
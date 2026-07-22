import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import Home from "@/pages/Home";
import Guide from "@/pages/Guide";
import Docs from "@/pages/Docs";
import Demo from "@/pages/Demo";
import Api from "@/pages/Api";

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-dark-900">
        <Header />
        <Sidebar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/guide" element={<Guide />} />
            <Route path="/docs" element={<Docs />} />
            <Route path="/demo" element={<Demo />} />
            <Route path="/api" element={<Api />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

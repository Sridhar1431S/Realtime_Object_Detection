import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useEffect } from "react";
import { getSettings } from "@/lib/settingsStore";
import Navbar from "./components/Navbar";
import Index from "./pages/Index";
import Detection from "./pages/Detection";
import History from "./pages/History";
import Statistics from "./pages/Statistics";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function ThemeManager() {
  useEffect(() => {
    const apply = () => {
      const s = getSettings();
      document.documentElement.classList.toggle('dark', s.darkMode);
    };
    apply();
    window.addEventListener('storage', apply);
    // listen for custom event for same-tab updates
    window.addEventListener('settings-changed', apply);
    return () => {
      window.removeEventListener('storage', apply);
      window.removeEventListener('settings-changed', apply);
    };
  }, []);
  return null;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Sonner />
      <ThemeManager />
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/detection" element={<Detection />} />
          <Route path="/history" element={<History />} />
          <Route path="/statistics" element={<Statistics />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Routes, Route } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import GamesPage from "./pages/GamesPage";
import PostResultsPage from "./pages/PostResultsPage";
import HistoryPage from "./pages/HistoryPage";
import DesignGuidePage from "./pages/DesignGuidePage";
import NotFound from "./pages/NotFound";
import Design9DemoPage from "./pages/Design9DemoPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";

const App = () => (
  <TooltipProvider>
    <Toaster />
    <Sonner />
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/games" element={<GamesPage />} />
          <Route path="/post-results" element={<PostResultsPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/design-guide" element={<DesignGuidePage />} />
          <Route path="/design9-demo" element={<Design9DemoPage />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  </TooltipProvider>
);

export default App;

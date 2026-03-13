import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import ErrorBoundary from "@/components/ErrorBoundary";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Gerador from "./pages/Gerador";
import Restauracao from "./pages/Restauracao";
import Galeria from "./pages/Galeria";
import Treinamento from "./pages/Treinamento";
import Configuracoes from "./pages/Configuracoes";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <Routes>
        <Route path="*" element={<Auth />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route path="/dashboard" element={<Dashboard />}>
        <Route index element={<Navigate to="/dashboard/gerador" replace />} />
        <Route path="gerador" element={<Gerador />} />
        <Route path="restauracao" element={<Restauracao />} />
        <Route path="galeria" element={<Galeria />} />
        <Route path="treinamento" element={<Treinamento />} />
        <Route path="configuracoes" element={<Configuracoes />} />
      </Route>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter>
          <AppRoutes />
          <Sonner />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;

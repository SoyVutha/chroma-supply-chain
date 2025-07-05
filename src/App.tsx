
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ERPAuthProvider } from "@/contexts/ERPAuthContext";
import Index from "./pages/Index";
import Customer from "./pages/Customer";
import Auth from "./pages/Auth";
import ERP from "./pages/ERP";
import ERPAuth from "./pages/ERPAuth";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          
          {/* Customer Routes - wrapped in AuthProvider */}
          <Route path="/customer/*" element={
            <AuthProvider>
              <Routes>
                <Route path="/" element={<Customer />} />
              </Routes>
            </AuthProvider>
          } />
          <Route path="/auth" element={
            <AuthProvider>
              <Auth />
            </AuthProvider>
          } />
          
          {/* ERP Routes - wrapped in ERPAuthProvider */}
          <Route path="/erp/*" element={
            <ERPAuthProvider>
              <Routes>
                <Route path="/" element={<ERP />} />
              </Routes>
            </ERPAuthProvider>
          } />
          <Route path="/erp-auth" element={
            <ERPAuthProvider>
              <ERPAuth />
            </ERPAuthProvider>
          } />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

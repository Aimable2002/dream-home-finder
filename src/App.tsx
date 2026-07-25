import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/use-auth";
import { RequireAuth } from "@/components/admin/RequireAuth";
import Index from "./pages/Index";
import Properties from "./pages/Properties";
import PropertyDetails from "./pages/PropertyDetails";
import BestDeals from "./pages/BestDeals";
import Team from "./pages/Team";
import About from "./pages/About";
import Contact from "./pages/Contact";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AddProperty from "./pages/admin/AddProperty";
import EditProperty from "./pages/admin/EditProperty";
import ManageProperties from "./pages/admin/ManageProperties";
import ManageTeam from "./pages/admin/ManageTeam";
import ManageMessages from "./pages/admin/ManageMessages";
import AdminSettings from "./pages/admin/AdminSettings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/properties" element={<Properties />} />
            <Route path="/property/:id" element={<PropertyDetails />} />
            <Route path="/best-deals" element={<BestDeals />} />
            <Route path="/team" element={<Team />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/admin" element={<AdminLogin />} />
            <Route
              path="/admin/dashboard"
              element={
                <RequireAuth>
                  <AdminDashboard />
                </RequireAuth>
              }
            />
            <Route
              path="/admin/add-property"
              element={
                <RequireAuth>
                  <AddProperty />
                </RequireAuth>
              }
            />
            <Route
              path="/admin/edit-property/:id"
              element={
                <RequireAuth>
                  <EditProperty />
                </RequireAuth>
              }
            />
            <Route
              path="/admin/properties"
              element={
                <RequireAuth>
                  <ManageProperties />
                </RequireAuth>
              }
            />
            <Route
              path="/admin/team"
              element={
                <RequireAuth>
                  <ManageTeam />
                </RequireAuth>
              }
            />
            <Route
              path="/admin/messages"
              element={
                <RequireAuth>
                  <ManageMessages />
                </RequireAuth>
              }
            />
            <Route
              path="/admin/settings"
              element={
                <RequireAuth>
                  <AdminSettings />
                </RequireAuth>
              }
            />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
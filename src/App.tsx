import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/lib/auth";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Internships from "./pages/Internships";
import InternshipDetails from "./pages/InternshipDetails";
import StudentDashboard from "./pages/dashboards/StudentDashboard";
import StudentProfile from "./pages/dashboards/StudentProfile";
import StudentSaved from "./pages/dashboards/StudentSaved";
import StudentApplications from "./pages/dashboards/StudentApplications";
import OrganizationDashboard from "./pages/dashboards/OrganizationDashboard";
import OrganizationProfile from "./pages/dashboards/OrganizationProfile";
import PostInternship from "./pages/dashboards/PostInternship";
import ManageApplicants from "./pages/dashboards/ManageApplicants";
import AdminDashboard from "./pages/dashboards/AdminDashboard";
import AdminModerate from "./pages/dashboards/AdminModerate";
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
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/internships" element={<Internships />} />
            <Route path="/internships/:id" element={<InternshipDetails />} />
            <Route path="/student-dashboard" element={<StudentDashboard />} />
            <Route path="/student-dashboard/profile" element={<StudentProfile />} />
            <Route path="/student-dashboard/saved" element={<StudentSaved />} />
            <Route path="/student-dashboard/applications" element={<StudentApplications />} />
            <Route path="/organization-dashboard" element={<OrganizationDashboard />} />
            <Route path="/organization-dashboard/profile" element={<OrganizationProfile />} />
            <Route path="/organization-dashboard/post" element={<PostInternship />} />
            <Route path="/organization-dashboard/applicants" element={<ManageApplicants />} />
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/admin-dashboard/moderate" element={<AdminModerate />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;

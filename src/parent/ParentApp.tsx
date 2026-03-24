import { Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "@/shared/components/DashboardLayout";
import {
  LayoutDashboard,
  Activity,
  AlertTriangle,
  BarChart3,
  UserPlus,
} from "lucide-react";

import ParentHome from "./pages/Dashboard";
import ActivityLog from "./pages/ActivityLog";
import WeakAreas from "./pages/WeakAreas";
import ReportsPage from "./pages/ReportsPage";
import LinkStudent from "./pages/LinkStudent";

const navItems = [
  { path: "/parent", label: "لوحة التحكم", icon: LayoutDashboard },
  { path: "/parent/activity", label: "سجل النشاط", icon: Activity },
  { path: "/parent/weak-areas", label: "نقاط الضعف", icon: AlertTriangle },
  { path: "/parent/reports", label: "التقارير", icon: BarChart3 },
  { path: "/parent/link", label: "ربط طالب", icon: UserPlus },
];

const ParentApp = () => {
  return (
    <DashboardLayout
      title="لوحة ولي الأمر"
      navItems={navItems}
      accentColor="bg-success"
      roleName="ولي أمر"
    >
      <Routes>
        <Route index element={<ParentHome />} />
        <Route path="activity" element={<ActivityLog />} />
        <Route path="weak-areas" element={<WeakAreas />} />
        <Route path="reports" element={<ReportsPage />} />
        <Route path="link" element={<LinkStudent />} />
        <Route path="*" element={<Navigate to="/parent" replace />} />
      </Routes>
    </DashboardLayout>
  );
};

export default ParentApp;

import { Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "@/shared/components/DashboardLayout";
import {
  LayoutDashboard,
  BookOpen,
  FileEdit,
  Users,
  MessageSquare,
  BarChart3,
} from "lucide-react";

import TeacherHome from "./pages/Dashboard";
import CurriculumBuilder from "./pages/CurriculumBuilder";
import LessonEditor from "./pages/LessonEditor";
import ClassManagement from "./pages/ClassManagement";
import ClassMonitor from "./pages/ClassMonitor";
import FeedbackPanel from "./pages/FeedbackPanel";

const navItems = [
  { path: "/teacher", label: "لوحة التحكم", icon: LayoutDashboard },
  { path: "/teacher/curriculum", label: "بناء المنهج", icon: BookOpen },
  { path: "/teacher/content", label: "إنشاء المحتوى", icon: FileEdit },
  { path: "/teacher/classes", label: "إدارة الفصول", icon: Users },
  { path: "/teacher/monitor", label: "متابعة الأداء", icon: BarChart3 },
  { path: "/teacher/feedback", label: "التغذية الراجعة", icon: MessageSquare },
];

const TeacherApp = () => {
  return (
    <DashboardLayout
      title="لوحة المعلم"
      navItems={navItems}
      accentColor="bg-primary"
      roleName="معلم"
    >
      <Routes>
        <Route index element={<TeacherHome />} />
        <Route path="curriculum" element={<CurriculumBuilder />} />
        <Route path="content" element={<LessonEditor />} />
        <Route path="classes" element={<ClassManagement />} />
        <Route path="monitor" element={<ClassMonitor />} />
        <Route path="feedback" element={<FeedbackPanel />} />
        <Route path="*" element={<Navigate to="/teacher" replace />} />
      </Routes>
    </DashboardLayout>
  );
};

export default TeacherApp;

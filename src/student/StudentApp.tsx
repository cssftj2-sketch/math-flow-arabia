import { Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "@/shared/components/DashboardLayout";
import {
  LayoutDashboard,
  Route as RoutePath,
  Brain,
  Trophy,
  CreditCard,
  Target,
  Link2,
} from "lucide-react";

import StudentDashboard from "./pages/Dashboard";
import LearningPath from "./pages/LearningPath";
import FlashcardReview from "./pages/FlashcardReview";
import QuizPage from "./pages/QuizPage";
import ExercisePractice from "./pages/ExercisePractice";
import BadgesPage from "./pages/BadgesPage";
import ParentLink from "./pages/ParentLink";
import JoinClass from "./pages/JoinClass";

const navItems = [
  { path: "/student", label: "لوحة التحكم", icon: LayoutDashboard },
  { path: "/student/path", label: "مسار التعلم", icon: RoutePath },
  { path: "/student/classes", label: "انضمام لفصل", icon: Brain },
  { path: "/student/flashcards", label: "البطاقات", icon: CreditCard },
  { path: "/student/quiz", label: "الاختبارات", icon: Target },
  { path: "/student/exercises", label: "التمارين", icon: Brain },
  { path: "/student/badges", label: "الشارات", icon: Trophy },
  { path: "/student/parent-link", label: "ربط ولي الأمر", icon: Link2 },
];

const StudentApp = () => {
  return (
    <DashboardLayout
      title="لوحة الطالب"
      navItems={navItems}
      accentColor="bg-primary"
      roleName="طالب"
    >
      <Routes>
        <Route index element={<StudentDashboard />} />
        <Route path="path" element={<LearningPath />} />
        <Route path="classes" element={<JoinClass />} />
        <Route path="flashcards" element={<FlashcardReview />} />
        <Route path="quiz" element={<QuizPage />} />
        <Route path="exercises" element={<ExercisePractice />} />
        <Route path="badges" element={<BadgesPage />} />
        <Route path="parent-link" element={<ParentLink />} />
        <Route path="*" element={<Navigate to="/student" replace />} />
      </Routes>
    </DashboardLayout>
  );
};

export default StudentApp;

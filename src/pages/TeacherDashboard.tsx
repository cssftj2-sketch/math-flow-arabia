import { Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import StatCard from "@/components/StatCard";
import {
  LayoutDashboard, BookOpen, FileEdit, Users, MessageSquare,
  CheckCircle2, Clock, GraduationCap, BarChart3, Plus
} from "lucide-react";

const navItems = [
  { path: "/teacher", label: "لوحة التحكم", icon: LayoutDashboard },
  { path: "/teacher/curriculum", label: "بناء المنهج", icon: BookOpen },
  { path: "/teacher/content", label: "إنشاء المحتوى", icon: FileEdit },
  { path: "/teacher/classes", label: "إدارة الفصول", icon: Users },
  { path: "/teacher/monitor", label: "متابعة الأداء", icon: BarChart3 },
  { path: "/teacher/feedback", label: "التغذية الراجعة", icon: MessageSquare },
];

const TeacherHome = () => (
  <div className="space-y-8">
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard title="المناهج" value="٤" icon={<BookOpen className="w-5 h-5 text-primary-foreground" />} colorClass="bg-secondary" />
      <StatCard title="الطلاب" value="١٢٨" icon={<GraduationCap className="w-5 h-5 text-primary-foreground" />} colorClass="bg-primary" />
      <StatCard title="محتوى منشور" value="٨٦" subtitle="درس" icon={<CheckCircle2 className="w-5 h-5 text-primary-foreground" />} colorClass="bg-success" />
      <StatCard title="بانتظار المراجعة" value="٥" icon={<Clock className="w-5 h-5 text-primary-foreground" />} colorClass="bg-warning" />
    </div>

    <div className="grid lg:grid-cols-2 gap-6">
      <div className="bg-card rounded-2xl border border-border p-6">
        <h2 className="font-bold mb-4">آخر النشاطات</h2>
        <div className="space-y-3">
          {[
            { text: "أحمد أكمل اختبار الجبر بنتيجة 90%", time: "منذ ٣ دقائق" },
            { text: "سارة طلبت مساعدة في الهندسة الفراغية", time: "منذ ١٥ دقيقة" },
            { text: "تم نشر درس المعادلات التربيعية بنجاح", time: "منذ ساعة" },
            { text: "محمد حقق شارة سلسلة 7 أيام", time: "منذ ساعتين" },
          ].map((a, i) => (
            <div key={i} className="flex justify-between items-start py-2 border-b border-border last:border-0">
              <p className="text-sm">{a.text}</p>
              <span className="text-xs text-muted-foreground whitespace-nowrap mr-4">{a.time}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-card rounded-2xl border border-border p-6">
        <h2 className="font-bold mb-4">أداء الفصول</h2>
        <div className="space-y-4">
          {[
            { name: "الصف التاسع - أ", students: 32, avg: 78 },
            { name: "الصف التاسع - ب", students: 28, avg: 72 },
            { name: "الصف العاشر - أ", students: 35, avg: 85 },
            { name: "الصف العاشر - ب", students: 33, avg: 68 },
          ].map((c) => (
            <div key={c.name} className="flex items-center justify-between">
              <div>
                <p className="font-medium text-sm">{c.name}</p>
                <p className="text-xs text-muted-foreground">{c.students} طالب</p>
              </div>
              <div className="text-left">
                <span className={`text-sm font-bold ${c.avg >= 75 ? 'text-success' : 'text-warning'}`}>{c.avg}%</span>
                <p className="text-xs text-muted-foreground">المعدل</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const CurriculumBuilder = () => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <p className="text-muted-foreground">خطط المواضيع والأهداف التعليمية</p>
      <button className="bg-gradient-hero text-primary-foreground px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2">
        <Plus className="w-4 h-4" /> منهج جديد
      </button>
    </div>
    <div className="space-y-4">
      {["الجبر المتقدم", "الهندسة الفراغية", "الإحصاء والاحتمالات", "حساب المثلثات"].map((name, i) => (
        <div key={name} className="bg-card rounded-2xl border border-border p-5 hover-lift">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center text-secondary-foreground font-bold">{i + 1}</div>
              <div>
                <h3 className="font-bold">{name}</h3>
                <p className="text-xs text-muted-foreground">{8 + i * 2} دروس · {3 + i} اختبارات</p>
              </div>
            </div>
            <span className={`text-xs px-3 py-1 rounded-full ${i < 2 ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'}`}>
              {i < 2 ? 'منشور' : 'مسودة'}
            </span>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const ContentAuthoring = () => (
  <div className="space-y-6">
    <p className="text-muted-foreground">أنشئ الدروس والتمارين والبطاقات التعليمية</p>
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {[
        { icon: "📹", title: "درس فيديو", desc: "أنشئ درساً مرئياً" },
        { icon: "📝", title: "بطاقات تعليمية", desc: "صيغ ومفاهيم" },
        { icon: "❓", title: "اختبار QCM", desc: "أسئلة متعددة الخيارات" },
        { icon: "✏️", title: "تمرين عملي", desc: "حل خطوة بخطوة" },
      ].map((t) => (
        <button key={t.title} className="bg-card rounded-2xl border border-border p-6 text-center hover-lift">
          <span className="text-4xl block mb-3">{t.icon}</span>
          <p className="font-bold text-sm">{t.title}</p>
          <p className="text-xs text-muted-foreground mt-1">{t.desc}</p>
        </button>
      ))}
    </div>
  </div>
);

const PlaceholderPage = ({ title }: { title: string }) => (
  <div className="bg-card rounded-2xl border border-border p-8 text-center">
    <p className="text-muted-foreground">{title} — قيد التطوير</p>
  </div>
);

const TeacherDashboard = () => (
  <DashboardLayout title="لوحة المعلم" navItems={navItems} accentColor="bg-secondary" roleName="معلم">
    <Routes>
      <Route index element={<TeacherHome />} />
      <Route path="curriculum" element={<CurriculumBuilder />} />
      <Route path="content" element={<ContentAuthoring />} />
      <Route path="classes" element={<PlaceholderPage title="إدارة الفصول" />} />
      <Route path="monitor" element={<PlaceholderPage title="متابعة الأداء" />} />
      <Route path="feedback" element={<PlaceholderPage title="التغذية الراجعة" />} />
      <Route path="*" element={<Navigate to="/teacher" replace />} />
    </Routes>
  </DashboardLayout>
);

export default TeacherDashboard;

import { Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import StatCard from "@/components/StatCard";
import {
  LayoutDashboard, Activity, AlertTriangle, BarChart3,
  GraduationCap, Clock, TrendingUp, CheckCircle2
} from "lucide-react";

const navItems = [
  { path: "/parent", label: "لوحة التحكم", icon: LayoutDashboard },
  { path: "/parent/activity", label: "سجل النشاط", icon: Activity },
  { path: "/parent/weak-areas", label: "نقاط الضعف", icon: AlertTriangle },
  { path: "/parent/reports", label: "التقارير", icon: BarChart3 },
];

const ParentHome = () => (
  <div className="space-y-8">
    {/* Child selector */}
    <div className="bg-card rounded-2xl border border-border p-4 flex items-center gap-4 overflow-x-auto">
      <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">الأبناء:</span>
      {[{ name: "أحمد", active: true }, { name: "سارة", active: false }].map((c) => (
        <button
          key={c.name}
          className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
            c.active ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"
          }`}
        >
          {c.name}
        </button>
      ))}
    </div>

    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard title="المعدل العام" value="٨٢%" icon={<TrendingUp className="w-5 h-5 text-primary-foreground" />} colorClass="bg-success" />
      <StatCard title="الدروس المكتملة" value="٣٧" icon={<CheckCircle2 className="w-5 h-5 text-primary-foreground" />} colorClass="bg-primary" />
      <StatCard title="وقت التعلم الأسبوعي" value="٥ س" icon={<Clock className="w-5 h-5 text-primary-foreground" />} colorClass="bg-info" />
      <StatCard title="أيام متتالية" value="١٢" icon={<GraduationCap className="w-5 h-5 text-primary-foreground" />} colorClass="bg-secondary" />
    </div>

    <div className="grid lg:grid-cols-2 gap-6">
      <div className="bg-card rounded-2xl border border-border p-6">
        <h2 className="font-bold mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5 text-primary" /> آخر النشاطات
        </h2>
        <div className="space-y-3">
          {[
            { text: "أكمل اختبار الجبر بنتيجة 90%", time: "اليوم", good: true },
            { text: "راجع 15 بطاقة تعليمية", time: "اليوم", good: true },
            { text: "حصل على شارة نجم الجبر ⭐", time: "أمس", good: true },
            { text: "لم يكمل تمرين الهندسة", time: "أمس", good: false },
          ].map((a, i) => (
            <div key={i} className="flex items-start justify-between py-2 border-b border-border last:border-0">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full mt-1.5 ${a.good ? 'bg-success' : 'bg-warning'}`} />
                <p className="text-sm">{a.text}</p>
              </div>
              <span className="text-xs text-muted-foreground whitespace-nowrap mr-4">{a.time}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-card rounded-2xl border border-border p-6">
        <h2 className="font-bold mb-4 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-warning" /> نقاط تحتاج انتباه
        </h2>
        <div className="space-y-3">
          {[
            { area: "الهندسة الفراغية", score: "45%", tip: "يحتاج مراجعة إضافية" },
            { area: "المتتاليات", score: "52%", tip: "صعوبة في التمارين التطبيقية" },
          ].map((w) => (
            <div key={w.area} className="bg-warning/5 rounded-xl p-4 border border-warning/20">
              <div className="flex justify-between items-center mb-1">
                <span className="font-medium text-sm">{w.area}</span>
                <span className="text-sm font-bold text-warning">{w.score}</span>
              </div>
              <p className="text-xs text-muted-foreground">{w.tip}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const PlaceholderPage = ({ title }: { title: string }) => (
  <div className="bg-card rounded-2xl border border-border p-8 text-center">
    <p className="text-muted-foreground">{title} — قيد التطوير</p>
  </div>
);

const ParentDashboard = () => (
  <DashboardLayout title="لوحة ولي الأمر" navItems={navItems} accentColor="bg-success" roleName="ولي أمر">
    <Routes>
      <Route index element={<ParentHome />} />
      <Route path="activity" element={<PlaceholderPage title="سجل النشاط" />} />
      <Route path="weak-areas" element={<PlaceholderPage title="نقاط الضعف" />} />
      <Route path="reports" element={<PlaceholderPage title="التقارير" />} />
      <Route path="*" element={<Navigate to="/parent" replace />} />
    </Routes>
  </DashboardLayout>
);

export default ParentDashboard;

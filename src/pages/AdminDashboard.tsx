import { Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import StatCard from "@/components/StatCard";
import {
  LayoutDashboard, Users, FileCheck, CreditCard, Settings,
  BarChart3, UserCheck, BookOpen, ShieldCheck
} from "lucide-react";

const navItems = [
  { path: "/admin", label: "لوحة التحكم", icon: LayoutDashboard },
  { path: "/admin/users", label: "إدارة المستخدمين", icon: Users },
  { path: "/admin/content", label: "مراجعة المحتوى", icon: FileCheck },
  { path: "/admin/billing", label: "الفوترة والخطط", icon: CreditCard },
  { path: "/admin/analytics", label: "التحليلات", icon: BarChart3 },
  { path: "/admin/config", label: "إعدادات المنصة", icon: Settings },
];

const AdminHome = () => (
  <div className="space-y-8">
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard title="إجمالي المستخدمين" value="١,٢٤٠" icon={<Users className="w-5 h-5 text-primary-foreground" />} colorClass="bg-accent" />
      <StatCard title="المعلمون" value="٤٢" icon={<UserCheck className="w-5 h-5 text-primary-foreground" />} colorClass="bg-secondary" />
      <StatCard title="المناهج المنشورة" value="١٨" icon={<BookOpen className="w-5 h-5 text-primary-foreground" />} colorClass="bg-primary" />
      <StatCard title="معدل النشاط اليومي" value="٦٨%" icon={<BarChart3 className="w-5 h-5 text-primary-foreground" />} colorClass="bg-success" />
    </div>

    <div className="grid lg:grid-cols-2 gap-6">
      <div className="bg-card rounded-2xl border border-border p-6">
        <h2 className="font-bold mb-4 flex items-center gap-2"><ShieldCheck className="w-5 h-5 text-accent" /> محتوى بانتظار المراجعة</h2>
        <div className="space-y-3">
          {[
            { teacher: "أ. خالد", content: "درس: المصفوفات", type: "فيديو" },
            { teacher: "أ. نورة", content: "اختبار: المتتاليات", type: "QCM" },
            { teacher: "أ. سعيد", content: "بطاقات: التكامل", type: "بطاقات" },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between py-3 border-b border-border last:border-0">
              <div>
                <p className="text-sm font-medium">{item.content}</p>
                <p className="text-xs text-muted-foreground">{item.teacher} · {item.type}</p>
              </div>
              <div className="flex gap-2">
                <button className="text-xs bg-success/10 text-success px-3 py-1 rounded-lg">قبول</button>
                <button className="text-xs bg-destructive/10 text-destructive px-3 py-1 rounded-lg">رفض</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-card rounded-2xl border border-border p-6">
        <h2 className="font-bold mb-4">آخر التسجيلات</h2>
        <div className="space-y-3">
          {[
            { name: "ليلى أحمد", role: "طالبة", time: "منذ ١٠ دقائق" },
            { name: "عمر محمد", role: "طالب", time: "منذ ساعة" },
            { name: "أ. فاطمة", role: "معلمة", time: "منذ ٣ ساعات" },
            { name: "يوسف علي", role: "طالب", time: "أمس" },
          ].map((u, i) => (
            <div key={i} className="flex items-center justify-between py-2 border-b border-border last:border-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-bold">{u.name[0]}</div>
                <div>
                  <p className="text-sm font-medium">{u.name}</p>
                  <p className="text-xs text-muted-foreground">{u.role}</p>
                </div>
              </div>
              <span className="text-xs text-muted-foreground">{u.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const UserManagement = () => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <p className="text-muted-foreground">إدارة جميع الحسابات على المنصة</p>
      <button className="bg-gradient-hero text-primary-foreground px-4 py-2 rounded-xl text-sm font-medium">+ مستخدم جديد</button>
    </div>
    <div className="bg-card rounded-2xl border border-border overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border bg-muted/50">
            <th className="text-right p-4 text-sm font-medium text-muted-foreground">الاسم</th>
            <th className="text-right p-4 text-sm font-medium text-muted-foreground">الدور</th>
            <th className="text-right p-4 text-sm font-medium text-muted-foreground">الحالة</th>
            <th className="text-right p-4 text-sm font-medium text-muted-foreground">آخر نشاط</th>
          </tr>
        </thead>
        <tbody>
          {[
            { name: "أحمد محمد", role: "طالب", status: "نشط", last: "اليوم" },
            { name: "أ. خالد سعيد", role: "معلم", status: "نشط", last: "اليوم" },
            { name: "سارة أحمد", role: "طالبة", status: "غير نشط", last: "منذ أسبوع" },
            { name: "أ. نورة علي", role: "معلمة", status: "نشط", last: "أمس" },
          ].map((u, i) => (
            <tr key={i} className="border-b border-border last:border-0 hover:bg-muted/30">
              <td className="p-4 text-sm font-medium">{u.name}</td>
              <td className="p-4 text-sm text-muted-foreground">{u.role}</td>
              <td className="p-4">
                <span className={`text-xs px-2 py-0.5 rounded-full ${u.status === 'نشط' ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground'}`}>
                  {u.status}
                </span>
              </td>
              <td className="p-4 text-sm text-muted-foreground">{u.last}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const PlaceholderPage = ({ title }: { title: string }) => (
  <div className="bg-card rounded-2xl border border-border p-8 text-center">
    <p className="text-muted-foreground">{title} — قيد التطوير</p>
  </div>
);

const AdminDashboard = () => (
  <DashboardLayout title="لوحة المدير" navItems={navItems} accentColor="bg-accent" roleName="مدير">
    <Routes>
      <Route index element={<AdminHome />} />
      <Route path="users" element={<UserManagement />} />
      <Route path="content" element={<PlaceholderPage title="مراجعة المحتوى" />} />
      <Route path="billing" element={<PlaceholderPage title="الفوترة والخطط" />} />
      <Route path="analytics" element={<PlaceholderPage title="التحليلات" />} />
      <Route path="config" element={<PlaceholderPage title="إعدادات المنصة" />} />
      <Route path="*" element={<Navigate to="/admin" replace />} />
    </Routes>
  </DashboardLayout>
);

export default AdminDashboard;

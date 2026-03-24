import { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import StatCard from "@/components/StatCard";
import { supabase } from "@/integrations/supabase/client";
import {
  LayoutDashboard, Users, FileCheck, CreditCard, Settings,
  BarChart3, UserCheck, BookOpen, ShieldCheck, Trash2, CheckCircle2, X
} from "lucide-react";
import { toast } from "sonner";

const navItems = [
  { path: "/admin", label: "لوحة التحكم", icon: LayoutDashboard },
  { path: "/admin/users", label: "إدارة المستخدمين", icon: Users },
  { path: "/admin/content", label: "مراجعة المحتوى", icon: FileCheck },
  { path: "/admin/billing", label: "الفوترة والخطط", icon: CreditCard },
  { path: "/admin/analytics", label: "التحليلات", icon: BarChart3 },
  { path: "/admin/config", label: "إعدادات المنصة", icon: Settings },
];

// ─── Admin Home ───
const AdminHome = () => {
  const [stats, setStats] = useState({ users: 0, teachers: 0, curricula: 0, lessons: 0 });
  const [recentUsers, setRecentUsers] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      const [{ count: uCount }, { count: tCount }, { count: cCount }, { count: lCount }, { data: recent }] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('user_roles').select('*', { count: 'exact', head: true }).eq('role', 'teacher'),
        supabase.from('curricula').select('*', { count: 'exact', head: true }).eq('is_published', true),
        supabase.from('lessons').select('*', { count: 'exact', head: true }),
        supabase.from('profiles').select('full_name, created_at, user_roles(role)').order('created_at', { ascending: false }).limit(5),
      ]);
      setStats({ users: uCount || 0, teachers: tCount || 0, curricula: cCount || 0, lessons: lCount || 0 });
      setRecentUsers(recent || []);
    };
    load();
  }, []);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="إجمالي المستخدمين" value={String(stats.users)} icon={<Users className="w-5 h-5 text-primary-foreground" />} colorClass="bg-accent" />
        <StatCard title="المعلمون" value={String(stats.teachers)} icon={<UserCheck className="w-5 h-5 text-primary-foreground" />} colorClass="bg-secondary" />
        <StatCard title="المناهج المنشورة" value={String(stats.curricula)} icon={<BookOpen className="w-5 h-5 text-primary-foreground" />} colorClass="bg-primary" />
        <StatCard title="الدروس" value={String(stats.lessons)} icon={<BarChart3 className="w-5 h-5 text-primary-foreground" />} colorClass="bg-success" />
      </div>

      <div className="bg-card rounded-2xl border border-border p-6">
        <h2 className="font-bold mb-4">آخر التسجيلات</h2>
        {recentUsers.length === 0 ? (
          <p className="text-sm text-muted-foreground">لا يوجد مستخدمون بعد</p>
        ) : (
          <div className="space-y-3">
            {recentUsers.map((u: any, i: number) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-bold">{u.full_name?.[0] || '?'}</div>
                  <div>
                    <p className="text-sm font-medium">{u.full_name || 'بدون اسم'}</p>
                    <p className="text-xs text-muted-foreground">{(u.user_roles as any)?.[0]?.role === 'teacher' ? 'معلم' : (u.user_roles as any)?.[0]?.role === 'admin' ? 'مدير' : (u.user_roles as any)?.[0]?.role === 'parent' ? 'ولي أمر' : 'طالب'}</p>
                  </div>
                </div>
                <span className="text-xs text-muted-foreground">{new Date(u.created_at).toLocaleDateString('ar')}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// ─── User Management ───
const UserManagement = () => {
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    supabase.from('profiles').select('user_id, full_name, created_at, user_roles(role)')
      .order('created_at', { ascending: false })
      .then(({ data }) => setUsers(data || []));
  }, []);

  const roleLabel = (role: string) => {
    const map: Record<string, string> = { student: 'طالب', teacher: 'معلم', admin: 'مدير', parent: 'ولي أمر' };
    return map[role] || role;
  };

  return (
    <div className="space-y-6">
      <p className="text-muted-foreground">إدارة جميع الحسابات على المنصة</p>
      <div className="bg-card rounded-2xl border border-border overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="text-right p-4 text-sm font-medium text-muted-foreground">الاسم</th>
              <th className="text-right p-4 text-sm font-medium text-muted-foreground">الدور</th>
              <th className="text-right p-4 text-sm font-medium text-muted-foreground">تاريخ التسجيل</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u: any, i: number) => (
              <tr key={i} className="border-b border-border last:border-0 hover:bg-muted/30">
                <td className="p-4 text-sm font-medium">{u.full_name || 'بدون اسم'}</td>
                <td className="p-4">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                    {roleLabel((u.user_roles as any)?.[0]?.role || 'student')}
                  </span>
                </td>
                <td className="p-4 text-sm text-muted-foreground">{new Date(u.created_at).toLocaleDateString('ar')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ─── Content Review ───
const ContentReview = () => {
  const [lessons, setLessons] = useState<any[]>([]);

  const load = () => {
    supabase.from('lessons').select('id, title, lesson_type, is_published, curricula(title, profiles:teacher_id(full_name))')
      .eq('is_published', false)
      .order('created_at', { ascending: false })
      .then(({ data }) => setLessons(data || []));
  };

  useEffect(() => { load(); }, []);

  const publishLesson = async (id: string) => {
    await supabase.from('lessons').update({ is_published: true }).eq('id', id);
    toast.success('تم نشر الدرس');
    load();
  };

  const deleteLesson = async (id: string) => {
    await supabase.from('lessons').delete().eq('id', id);
    toast.success('تم حذف الدرس');
    load();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-2">
        <ShieldCheck className="w-5 h-5 text-accent" />
        <p className="text-muted-foreground">محتوى بانتظار المراجعة والنشر</p>
      </div>
      {lessons.length === 0 ? (
        <div className="bg-card rounded-2xl border border-border p-8 text-center">
          <CheckCircle2 className="w-8 h-8 text-success mx-auto mb-3" />
          <p className="text-muted-foreground">لا يوجد محتوى بانتظار المراجعة</p>
        </div>
      ) : (
        <div className="space-y-3">
          {lessons.map((l: any) => (
            <div key={l.id} className="bg-card rounded-2xl border border-border p-5 flex items-center justify-between">
              <div>
                <p className="font-medium text-sm">{l.title}</p>
                <p className="text-xs text-muted-foreground">
                  {(l.curricula as any)?.title} · {(l.curricula as any)?.profiles?.full_name || 'معلم'}
                </p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => publishLesson(l.id)} className="text-xs bg-success/10 text-success px-3 py-1.5 rounded-lg hover:bg-success/20">نشر</button>
                <button onClick={() => deleteLesson(l.id)} className="text-xs bg-destructive/10 text-destructive px-3 py-1.5 rounded-lg hover:bg-destructive/20">حذف</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── Billing ───
const BillingPage = () => (
  <div className="space-y-6">
    <p className="text-muted-foreground">إعدادات الفوترة وخطط الاشتراك</p>
    <div className="grid sm:grid-cols-3 gap-4">
      {[
        { name: 'مجاني', price: '٠', features: ['5 دروس', '3 اختبارات', 'بطاقات محدودة'], active: true },
        { name: 'متقدم', price: '٤٩', features: ['دروس غير محدودة', 'اختبارات غير محدودة', 'تحليلات متقدمة'], active: false },
        { name: 'مؤسسات', price: '١٩٩', features: ['كل المميزات', 'دعم مخصص', 'API مفتوح'], active: false },
      ].map(plan => (
        <div key={plan.name} className={`bg-card rounded-2xl border p-6 ${plan.active ? 'border-primary ring-2 ring-primary/20' : 'border-border'}`}>
          <h3 className="font-bold text-lg mb-1">{plan.name}</h3>
          <p className="text-3xl font-black mb-4">{plan.price}<span className="text-sm font-normal text-muted-foreground"> ر.س/شهر</span></p>
          <ul className="space-y-2">
            {plan.features.map(f => (
              <li key={f} className="text-sm text-muted-foreground flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-success" /> {f}
              </li>
            ))}
          </ul>
          {plan.active && <p className="text-xs text-primary font-medium mt-4">الخطة الحالية</p>}
        </div>
      ))}
    </div>
  </div>
);

// ─── Analytics ───
const AnalyticsPage = () => {
  const [stats, setStats] = useState({ totalProgress: 0, avgScore: 0, completedLessons: 0 });

  useEffect(() => {
    supabase.from('student_progress').select('score, status').then(({ data }) => {
      if (!data) return;
      const completed = data.filter(d => d.status === 'completed');
      const avg = completed.length > 0 ? completed.reduce((s, d) => s + (d.score || 0), 0) / completed.length : 0;
      setStats({ totalProgress: data.length, avgScore: Math.round(avg), completedLessons: completed.length });
    });
  }, []);

  return (
    <div className="space-y-6">
      <p className="text-muted-foreground">تحليلات المنصة والاستخدام</p>
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-card rounded-2xl border border-border p-6 text-center">
          <p className="text-3xl font-black text-primary">{stats.totalProgress}</p>
          <p className="text-sm text-muted-foreground">إجمالي التقدم المسجل</p>
        </div>
        <div className="bg-card rounded-2xl border border-border p-6 text-center">
          <p className="text-3xl font-black text-success">{stats.avgScore}%</p>
          <p className="text-sm text-muted-foreground">متوسط النتائج</p>
        </div>
        <div className="bg-card rounded-2xl border border-border p-6 text-center">
          <p className="text-3xl font-black text-secondary">{stats.completedLessons}</p>
          <p className="text-sm text-muted-foreground">دروس مكتملة</p>
        </div>
      </div>
    </div>
  );
};

// ─── Platform Config ───
const PlatformConfig = () => (
  <div className="space-y-6">
    <p className="text-muted-foreground">إعدادات المنصة العامة</p>
    <div className="bg-card rounded-2xl border border-border p-6 space-y-5">
      <div>
        <label className="block text-sm font-medium mb-2">اسم المنصة</label>
        <input defaultValue="رياضيات+" className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">وصف المنصة</label>
        <textarea defaultValue="منصة تعليم الرياضيات التفاعلية بالذكاء الاصطناعي" className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground" rows={3} />
      </div>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium">السماح بالتسجيل المفتوح</p>
          <p className="text-xs text-muted-foreground">يمكن للطلاب التسجيل بدون دعوة</p>
        </div>
        <div className="w-12 h-7 bg-success rounded-full relative cursor-pointer">
          <div className="w-5 h-5 bg-white rounded-full absolute top-1 left-1 shadow" />
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium">تأكيد البريد الإلكتروني</p>
          <p className="text-xs text-muted-foreground">مطلوب تأكيد البريد قبل الدخول</p>
        </div>
        <div className="w-12 h-7 bg-muted rounded-full relative cursor-pointer">
          <div className="w-5 h-5 bg-white rounded-full absolute top-1 right-1 shadow" />
        </div>
      </div>
      <button className="bg-gradient-hero text-primary-foreground px-6 py-2.5 rounded-xl text-sm font-medium">حفظ الإعدادات</button>
    </div>
  </div>
);

const AdminDashboard = () => (
  <DashboardLayout title="لوحة المدير" navItems={navItems} accentColor="bg-accent" roleName="مدير">
    <Routes>
      <Route index element={<AdminHome />} />
      <Route path="users" element={<UserManagement />} />
      <Route path="content" element={<ContentReview />} />
      <Route path="billing" element={<BillingPage />} />
      <Route path="analytics" element={<AnalyticsPage />} />
      <Route path="config" element={<PlatformConfig />} />
      <Route path="*" element={<Navigate to="/admin" replace />} />
    </Routes>
  </DashboardLayout>
);

export default AdminDashboard;

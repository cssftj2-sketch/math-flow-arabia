import { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import StatCard from "@/components/StatCard";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
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

// ─── Parent Home ───
const ParentHome = () => {
  const { user } = useAuth();
  const [children, setChildren] = useState<any[]>([]);
  const [selectedChild, setSelectedChild] = useState<string | null>(null);
  const [progress, setProgress] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;
    supabase.from('parent_students').select('student_id, profiles:student_id(full_name)').eq('parent_id', user.id)
      .then(({ data }) => {
        setChildren(data || []);
        if (data && data.length > 0) setSelectedChild(data[0].student_id);
      });
  }, [user]);

  useEffect(() => {
    if (!selectedChild) return;
    supabase.from('student_progress').select('status, score, lessons(title), quizzes(title), updated_at')
      .eq('student_id', selectedChild)
      .order('updated_at', { ascending: false })
      .limit(10)
      .then(({ data }) => setProgress(data || []));
  }, [selectedChild]);

  const completed = progress.filter(p => p.status === 'completed');
  const avgScore = completed.length > 0 ? Math.round(completed.reduce((s, p) => s + (p.score || 0), 0) / completed.length) : 0;

  return (
    <div className="space-y-8">
      {children.length > 0 ? (
        <div className="bg-card rounded-2xl border border-border p-4 flex items-center gap-4 overflow-x-auto">
          <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">الأبناء:</span>
          {children.map((c: any) => (
            <button
              key={c.student_id}
              onClick={() => setSelectedChild(c.student_id)}
              className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
                selectedChild === c.student_id ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {(c.profiles as any)?.full_name || 'طالب'}
            </button>
          ))}
        </div>
      ) : (
        <div className="bg-warning/5 border border-warning/20 rounded-2xl p-6 text-center">
          <AlertTriangle className="w-8 h-8 text-warning mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">لم يتم ربط أي أبناء بحسابك بعد. تواصل مع المدير لربط حساب ابنك.</p>
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="المعدل العام" value={`${avgScore}%`} icon={<TrendingUp className="w-5 h-5 text-primary-foreground" />} colorClass="bg-success" />
        <StatCard title="دروس مكتملة" value={String(completed.length)} icon={<CheckCircle2 className="w-5 h-5 text-primary-foreground" />} colorClass="bg-primary" />
        <StatCard title="إجمالي النشاطات" value={String(progress.length)} icon={<Clock className="w-5 h-5 text-primary-foreground" />} colorClass="bg-info" />
        <StatCard title="الأبناء" value={String(children.length)} icon={<GraduationCap className="w-5 h-5 text-primary-foreground" />} colorClass="bg-secondary" />
      </div>

      {progress.length > 0 && (
        <div className="bg-card rounded-2xl border border-border p-6">
          <h2 className="font-bold mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" /> آخر النشاطات
          </h2>
          <div className="space-y-3">
            {progress.map((p: any, i: number) => (
              <div key={i} className="flex items-start justify-between py-2 border-b border-border last:border-0">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full mt-1.5 ${p.status === 'completed' ? 'bg-success' : 'bg-warning'}`} />
                  <p className="text-sm">{(p.lessons as any)?.title || (p.quizzes as any)?.title || 'نشاط'} — {p.status === 'completed' ? `مكتمل ${p.score ? `(${p.score}%)` : ''}` : 'جارٍ'}</p>
                </div>
                <span className="text-xs text-muted-foreground whitespace-nowrap mr-4">{new Date(p.updated_at).toLocaleDateString('ar')}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Activity Log ───
const ActivityLog = () => {
  const { user } = useAuth();
  const [activities, setActivities] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;
    supabase.from('parent_students').select('student_id').eq('parent_id', user.id).then(async ({ data: kids }) => {
      if (!kids || kids.length === 0) return;
      const ids = kids.map(k => k.student_id);
      const { data } = await supabase.from('student_progress')
        .select('status, score, updated_at, completed_at, lessons(title), quizzes(title), profiles:student_id(full_name)')
        .in('student_id', ids)
        .order('updated_at', { ascending: false })
        .limit(20);
      setActivities(data || []);
    });
  }, [user]);

  return (
    <div className="space-y-6">
      <p className="text-muted-foreground">سجل جميع نشاطات أبنائك</p>
      {activities.length === 0 ? (
        <div className="bg-card rounded-2xl border border-border p-8 text-center">
          <p className="text-muted-foreground">لا توجد نشاطات مسجلة</p>
        </div>
      ) : (
        <div className="space-y-3">
          {activities.map((a: any, i: number) => (
            <div key={i} className="bg-card rounded-2xl border border-border p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${a.status === 'completed' ? 'bg-success' : a.status === 'in_progress' ? 'bg-info' : 'bg-muted'}`} />
                <div>
                  <p className="text-sm font-medium">{(a.profiles as any)?.full_name}: {(a.lessons as any)?.title || (a.quizzes as any)?.title}</p>
                  <p className="text-xs text-muted-foreground">{a.status === 'completed' ? 'مكتمل' : 'جارٍ'} {a.score ? `— ${a.score}%` : ''}</p>
                </div>
              </div>
              <span className="text-xs text-muted-foreground">{new Date(a.updated_at).toLocaleDateString('ar')}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── Weak Areas ───
const WeakAreas = () => {
  const { user } = useAuth();
  const [weakAreas, setWeakAreas] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;
    supabase.from('parent_students').select('student_id').eq('parent_id', user.id).then(async ({ data: kids }) => {
      if (!kids || kids.length === 0) return;
      const ids = kids.map(k => k.student_id);
      const { data } = await supabase.from('student_progress')
        .select('score, lessons(title, curricula(title)), profiles:student_id(full_name)')
        .in('student_id', ids)
        .eq('status', 'completed')
        .not('score', 'is', null)
        .lt('score', 60)
        .order('score', { ascending: true })
        .limit(10);
      setWeakAreas(data || []);
    });
  }, [user]);

  return (
    <div className="space-y-6">
      <p className="text-muted-foreground">المواضيع التي يحتاج أبناؤك لتحسينها (نتائج أقل من 60%)</p>
      {weakAreas.length === 0 ? (
        <div className="bg-card rounded-2xl border border-border p-8 text-center">
          <CheckCircle2 className="w-8 h-8 text-success mx-auto mb-3" />
          <p className="text-muted-foreground">لا توجد نقاط ضعف مسجلة — أداء ممتاز!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {weakAreas.map((w: any, i: number) => (
            <div key={i} className="bg-warning/5 rounded-2xl p-5 border border-warning/20">
              <div className="flex justify-between items-center mb-1">
                <div>
                  <p className="font-medium text-sm">{(w.profiles as any)?.full_name}: {(w.lessons as any)?.title}</p>
                  <p className="text-xs text-muted-foreground">{(w.lessons as any)?.curricula?.title}</p>
                </div>
                <span className="text-lg font-bold text-warning">{w.score}%</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── Reports ───
const ReportsPage = () => {
  const { user } = useAuth();
  const [children, setChildren] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;
    supabase.from('parent_students').select('student_id, profiles:student_id(full_name)').eq('parent_id', user.id).then(async ({ data: kids }) => {
      if (!kids) return;
      const enriched = await Promise.all(kids.map(async (k: any) => {
        const { data: prog } = await supabase.from('student_progress').select('status, score').eq('student_id', k.student_id);
        const completed = (prog || []).filter(p => p.status === 'completed');
        const avg = completed.length > 0 ? Math.round(completed.reduce((s, p) => s + (p.score || 0), 0) / completed.length) : 0;
        return { name: (k.profiles as any)?.full_name || 'طالب', total: (prog || []).length, completed: completed.length, avg };
      }));
      setChildren(enriched);
    });
  }, [user]);

  return (
    <div className="space-y-6">
      <p className="text-muted-foreground">تقارير شاملة عن أداء أبنائك</p>
      {children.length === 0 ? (
        <div className="bg-card rounded-2xl border border-border p-8 text-center">
          <p className="text-muted-foreground">لا توجد بيانات بعد</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {children.map((c, i) => (
            <div key={i} className="bg-card rounded-2xl border border-border p-6">
              <h3 className="font-bold text-lg mb-4">{c.name}</h3>
              <div className="space-y-3">
                <div className="flex justify-between"><span className="text-sm text-muted-foreground">إجمالي النشاطات</span><span className="font-bold">{c.total}</span></div>
                <div className="flex justify-between"><span className="text-sm text-muted-foreground">الدروس المكتملة</span><span className="font-bold text-success">{c.completed}</span></div>
                <div className="flex justify-between"><span className="text-sm text-muted-foreground">متوسط النتائج</span><span className={`font-bold ${c.avg >= 60 ? 'text-success' : 'text-warning'}`}>{c.avg}%</span></div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const ParentDashboard = () => (
  <DashboardLayout title="لوحة ولي الأمر" navItems={navItems} accentColor="bg-success" roleName="ولي أمر">
    <Routes>
      <Route index element={<ParentHome />} />
      <Route path="activity" element={<ActivityLog />} />
      <Route path="weak-areas" element={<WeakAreas />} />
      <Route path="reports" element={<ReportsPage />} />
      <Route path="*" element={<Navigate to="/parent" replace />} />
    </Routes>
  </DashboardLayout>
);

export default ParentDashboard;

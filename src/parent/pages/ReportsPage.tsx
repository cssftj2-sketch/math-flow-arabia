import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

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

export default ReportsPage;

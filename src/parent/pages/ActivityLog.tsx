import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const ActivityLog = () => {
  const { user } = useAuth();
  const [activities, setActivities] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;
    supabase.from('parent_students').select('student_id').eq('parent_id', user.id).then(async ({ data: kids }) => {
      if (!kids || kids.length === 0) return;
      const ids = kids.map(k => k.student_id);
      const { data } = await supabase.from('student_progress')
        .select('status, score, updated_at, lessons(title), quizzes(title), profiles:student_id(full_name)')
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

export default ActivityLog;

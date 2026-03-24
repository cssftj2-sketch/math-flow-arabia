import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { CheckCircle2 } from "lucide-react";

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

export default WeakAreas;

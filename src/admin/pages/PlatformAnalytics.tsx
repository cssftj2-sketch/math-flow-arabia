import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

const PlatformAnalytics = () => {
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
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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

export default PlatformAnalytics;

import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

const ClassMonitor = () => {
  const [progress, setProgress] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("student_progress")
      .select("status, score, updated_at, lessons(title), quizzes(title)")
      .order("updated_at", { ascending: false })
      .limit(20)
      .then(({ data }) => {
        setProgress(data ?? []);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-14 bg-muted/50 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <p className="text-muted-foreground">
        تابع أداء الطلاب في المناهج والاختبارات
      </p>
      {progress.length === 0 ? (
        <div className="bg-card rounded-2xl border border-border p-8 text-center">
          <p className="text-muted-foreground">لا توجد بيانات تقدم بعد</p>
        </div>
      ) : (
        <div className="bg-card rounded-2xl border border-border overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-right p-4 text-sm font-medium text-muted-foreground">
                  المحتوى
                </th>
                <th className="text-right p-4 text-sm font-medium text-muted-foreground">
                  الحالة
                </th>
                <th className="text-right p-4 text-sm font-medium text-muted-foreground">
                  النتيجة
                </th>
              </tr>
            </thead>
            <tbody>
              {progress.map((p: any, i: number) => (
                <tr
                  key={i}
                  className="border-b border-border last:border-0 hover:bg-muted/30"
                >
                  <td className="p-4 text-sm">
                    {(p.lessons as any)?.title ??
                      (p.quizzes as any)?.title ??
                      "—"}
                  </td>
                  <td className="p-4">
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        p.status === "completed"
                          ? "bg-success/10 text-success"
                          : p.status === "in_progress"
                          ? "bg-info/10 text-info"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {p.status === "completed"
                        ? "مكتمل"
                        : p.status === "in_progress"
                        ? "جارٍ"
                        : "لم يبدأ"}
                    </span>
                  </td>
                  <td className="p-4 text-sm font-bold">
                    {p.score != null ? `${p.score}%` : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ClassMonitor;

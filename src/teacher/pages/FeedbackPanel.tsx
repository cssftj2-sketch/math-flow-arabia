import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const FeedbackPanel = () => {
  const [progress, setProgress] = useState<any[]>([]);

  useEffect(() => {
    supabase
      .from("student_progress")
      .select("id, status, score, lessons(title), quizzes(title)")
      .order("updated_at", { ascending: false })
      .limit(10)
      .then(({ data }) => setProgress(data ?? []));
  }, []);

  const sendFeedback = (type: string) => {
    const labels: Record<string, string> = {
      good: "تم إرسال تعليق: أحسنت!",
      improve: "تم إرسال تعليق: يحتاج تحسين",
      note: "تم إرسال ملاحظة",
    };
    toast.success(labels[type] ?? "تم إرسال التغذية الراجعة");
  };

  return (
    <div className="space-y-6">
      <p className="text-muted-foreground">
        أرسل تغذية راجعة للطلاب بناءً على أدائهم
      </p>
      {progress.length === 0 ? (
        <div className="bg-card rounded-2xl border border-border p-8 text-center">
          <p className="text-muted-foreground">
            لا توجد بيانات طلاب لتقديم تغذية راجعة
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {progress.map((p: any) => {
            const contentTitle =
              (p.lessons as any)?.title ?? (p.quizzes as any)?.title ?? "—";
            return (
              <div
                key={p.id}
                className="bg-card rounded-2xl border border-border p-5"
              >
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="font-bold text-sm">{contentTitle}</p>
                    <p className="text-xs text-muted-foreground">
                      النتيجة: {p.score != null ? `${p.score}%` : "—"}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => sendFeedback("good")}
                      className="bg-success/10 text-success text-xs px-3 py-1.5 rounded-lg font-medium hover:bg-success/20 transition-colors"
                    >
                      أحسنت! 👏
                    </button>
                    <button
                      onClick={() => sendFeedback("improve")}
                      className="bg-warning/10 text-warning text-xs px-3 py-1.5 rounded-lg font-medium hover:bg-warning/20 transition-colors"
                    >
                      تحسين ✍️
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default FeedbackPanel;

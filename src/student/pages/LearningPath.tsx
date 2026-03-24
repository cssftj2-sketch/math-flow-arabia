import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

const LearningPath = () => {
  const { user } = useAuth();
  const [curricula, setCurricula] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const [{ data: currData }, { data: progress }] = await Promise.all([
        supabase
          .from("curricula")
          .select("id, title, lessons(id, title, is_published)")
          .eq("is_published", true),
        supabase
          .from("student_progress")
          .select("lesson_id, status")
          .eq("student_id", user.id),
      ]);

      if (!currData) return;

      const progressMap = new Map(
        (progress ?? []).map((p) => [p.lesson_id, p.status])
      );

      const enriched = currData.map((c) => ({
        ...c,
        lessons: (c.lessons ?? [])
          .filter((l: any) => l.is_published)
          .map((l: any) => ({
            ...l,
            status: progressMap.get(l.id) ?? "not_started",
          })),
      }));
      setCurricula(enriched);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const startLesson = async (lessonId: string) => {
    if (!user) return;
    const { data: existing } = await supabase
      .from("student_progress")
      .select("id, status")
      .eq("student_id", user.id)
      .eq("lesson_id", lessonId)
      .maybeSingle();

    if (existing) {
      toast.info("الدرس بدأ بالفعل");
      return;
    }

    const { error } = await supabase.from("student_progress").insert({
      student_id: user.id,
      lesson_id: lessonId,
      status: "in_progress",
    });

    if (error) { toast.error("حدث خطأ أثناء بدء الدرس"); return; }
    toast.success("تم بدء الدرس");
    fetchData();
  };

  const completeLesson = async (lessonId: string) => {
    if (!user) return;
    const { error } = await supabase
      .from("student_progress")
      .update({
        status: "completed",
        score: Math.floor(Math.random() * 31) + 70,
        completed_at: new Date().toISOString(),
      })
      .eq("student_id", user.id)
      .eq("lesson_id", lessonId);

    if (error) { toast.error("حدث خطأ أثناء إكمال الدرس"); return; }
    toast.success("تم إكمال الدرس! 🎉");
    fetchData();
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-20 bg-muted/50 rounded-2xl animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <p className="text-muted-foreground">مسار التعلم المخصص لك</p>
      {curricula.length === 0 ? (
        <div className="bg-card rounded-2xl border border-border p-8 text-center">
          <p className="text-muted-foreground">لا توجد مناهج منشورة بعد</p>
        </div>
      ) : (
        curricula.map((c) => (
          <div key={c.id} className="space-y-3">
            <h3 className="font-bold text-lg">{c.title}</h3>
            {c.lessons.length === 0 ? (
              <p className="text-sm text-muted-foreground pr-2">لا توجد دروس في هذا المنهج بعد</p>
            ) : (
              c.lessons.map((l: any, i: number) => (
                <div
                  key={l.id}
                  className={`bg-card rounded-2xl border p-5 hover-lift ${
                    l.status === "completed"
                      ? "border-success/30"
                      : l.status === "in_progress"
                      ? "border-primary/30 ring-2 ring-primary/10"
                      : "border-border"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm flex-shrink-0 ${
                        l.status === "completed"
                          ? "bg-success text-success-foreground"
                          : l.status === "in_progress"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {l.status === "completed" ? "✓" : i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{l.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {l.status === "completed"
                          ? "✅ مكتمل"
                          : l.status === "in_progress"
                          ? "▶️ جارٍ"
                          : "⏳ لم يبدأ"}
                      </p>
                    </div>
                    {l.status === "not_started" && (
                      <button
                        onClick={() => startLesson(l.id)}
                        className="bg-gradient-hero text-primary-foreground px-4 py-2 rounded-xl text-xs font-medium flex-shrink-0"
                      >
                        ابدأ
                      </button>
                    )}
                    {l.status === "in_progress" && (
                      <button
                        onClick={() => completeLesson(l.id)}
                        className="bg-success text-success-foreground px-4 py-2 rounded-xl text-xs font-medium flex-shrink-0"
                      >
                        أكمل
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default LearningPath;

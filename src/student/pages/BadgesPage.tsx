import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const BadgesPage = () => {
  const { user } = useAuth();
  const [completedCount, setCompletedCount] = useState(0);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("student_progress")
      .select("*", { count: "exact", head: true })
      .eq("student_id", user.id)
      .eq("status", "completed")
      .then(({ count }) => setCompletedCount(count ?? 0));
  }, [user]);

  const allBadges = [
    { emoji: "🏅", name: "متعلم نشط", desc: "أكمل أول درس", earned: completedCount >= 1 },
    { emoji: "⭐", name: "نجم المنصة", desc: "أكمل 5 دروس", earned: completedCount >= 5 },
    { emoji: "🔥", name: "سلسلة حارقة", desc: "أكمل 10 دروس", earned: completedCount >= 10 },
    { emoji: "🎯", name: "القناص", desc: "أكمل 20 درساً", earned: completedCount >= 20 },
    { emoji: "🏆", name: "بطل الرياضيات", desc: "أكمل 50 درساً", earned: completedCount >= 50 },
    { emoji: "💎", name: "الماسي", desc: "أكمل 100 درس", earned: completedCount >= 100 },
  ];

  return (
    <div className="space-y-6">
      <p className="text-muted-foreground">شاراتك وإنجازاتك — أكملت {completedCount} درساً</p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {allBadges.map((b) => (
          <div key={b.name} className={`bg-card rounded-2xl border p-6 text-center transition-opacity ${b.earned ? "border-secondary/50" : "border-border opacity-50"}`}>
            <span className="text-5xl block mb-3">{b.emoji}</span>
            <p className="font-bold">{b.name}</p>
            <p className="text-xs text-muted-foreground mt-1">{b.desc}</p>
            {b.earned && <span className="inline-block mt-2 text-xs bg-success/10 text-success px-2 py-0.5 rounded-full">مكتسبة ✓</span>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BadgesPage;

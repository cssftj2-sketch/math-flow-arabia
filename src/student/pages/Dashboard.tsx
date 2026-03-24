import { useState, useEffect } from "react";
import StatCard from "@/shared/components/StatCard";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import {
  Trophy,
  CheckCircle2,
  Clock,
  BarChart3,
  Star,
} from "lucide-react";

const StudentDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    completed: 0,
    inProgress: 0,
    avgScore: 0,
    total: 0,
  });

  useEffect(() => {
    if (!user) return;
    supabase
      .from("student_progress")
      .select("status, score")
      .eq("student_id", user.id)
      .then(({ data }) => {
        if (!data) return;
        const completed = data.filter((d) => d.status === "completed");
        const scoredItems = completed.filter((d) => d.score !== null);
        const avg =
          scoredItems.length > 0
            ? Math.round(
                scoredItems.reduce((s, d) => s + (d.score ?? 0), 0) /
                  scoredItems.length
              )
            : 0;
        setStats({
          completed: completed.length,
          inProgress: data.filter((d) => d.status === "in_progress").length,
          avgScore: avg,
          total: data.length,
        });
      });
  }, [user]);

  const badges = [
    { emoji: "🏅", name: "متعلم نشط", desc: "أكمل أول درس", earned: stats.completed >= 1 },
    { emoji: "⭐", name: "نجم المنصة", desc: "أكمل 5 دروس", earned: stats.completed >= 5 },
    { emoji: "🔥", name: "سلسلة حارقة", desc: "أكمل 10 دروس", earned: stats.completed >= 10 },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="دروس مكتملة"
          value={String(stats.completed)}
          icon={<CheckCircle2 className="w-5 h-5 text-primary-foreground" />}
          colorClass="bg-success"
        />
        <StatCard
          title="قيد التقدم"
          value={String(stats.inProgress)}
          icon={<Clock className="w-5 h-5 text-primary-foreground" />}
          colorClass="bg-info"
        />
        <StatCard
          title="المعدل العام"
          value={`${stats.avgScore}%`}
          icon={<Star className="w-5 h-5 text-primary-foreground" />}
          colorClass="bg-primary"
        />
        <StatCard
          title="إجمالي النشاطات"
          value={String(stats.total)}
          icon={<BarChart3 className="w-5 h-5 text-primary-foreground" />}
          colorClass="bg-secondary"
        />
      </div>

      <div className="bg-card rounded-2xl border border-border p-6">
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Trophy className="w-5 h-5 text-secondary" />
          شاراتك
        </h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {badges.map((b) => (
            <div
              key={b.name}
              className={`bg-muted/50 rounded-xl p-4 flex items-center gap-3 transition-opacity ${
                !b.earned ? "opacity-40" : ""
              }`}
            >
              <span className="text-3xl">{b.emoji}</span>
              <div>
                <p className="font-bold text-sm">{b.name}</p>
                <p className="text-xs text-muted-foreground">{b.desc}</p>
                {b.earned && (
                  <span className="text-xs text-success">مكتسبة ✓</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;

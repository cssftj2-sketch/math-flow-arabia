import { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import StatCard from "@/components/StatCard";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import {
  LayoutDashboard, Route as RoutePath, BookOpen, Brain, Trophy,
  CreditCard, Target, Star, Flame, CheckCircle2, Clock, BarChart3
} from "lucide-react";
import { toast } from "sonner";

const navItems = [
  { path: "/student", label: "لوحة التحكم", icon: LayoutDashboard },
  { path: "/student/path", label: "مسار التعلم", icon: RoutePath },
  { path: "/student/flashcards", label: "البطاقات", icon: CreditCard },
  { path: "/student/quiz", label: "الاختبارات", icon: Target },
  { path: "/student/exercises", label: "التمارين", icon: Brain },
  { path: "/student/badges", label: "الشارات", icon: Trophy },
];

// ─── Dashboard Home ───
const DashboardHome = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ completed: 0, inProgress: 0, avgScore: 0, total: 0 });

  useEffect(() => {
    if (!user) return;
    supabase.from('student_progress').select('status, score').eq('student_id', user.id).then(({ data }) => {
      if (!data) return;
      const completed = data.filter(d => d.status === 'completed');
      const avg = completed.length > 0 ? Math.round(completed.reduce((s, d) => s + (d.score || 0), 0) / completed.length) : 0;
      setStats({
        completed: completed.length,
        inProgress: data.filter(d => d.status === 'in_progress').length,
        avgScore: avg,
        total: data.length,
      });
    });
  }, [user]);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="دروس مكتملة" value={String(stats.completed)} icon={<CheckCircle2 className="w-5 h-5 text-primary-foreground" />} colorClass="bg-success" />
        <StatCard title="قيد التقدم" value={String(stats.inProgress)} icon={<Clock className="w-5 h-5 text-primary-foreground" />} colorClass="bg-info" />
        <StatCard title="المعدل العام" value={`${stats.avgScore}%`} icon={<Star className="w-5 h-5 text-primary-foreground" />} colorClass="bg-primary" />
        <StatCard title="إجمالي النشاطات" value={String(stats.total)} icon={<BarChart3 className="w-5 h-5 text-primary-foreground" />} colorClass="bg-secondary" />
      </div>

      <div className="bg-card rounded-2xl border border-border p-6">
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Trophy className="w-5 h-5 text-secondary" />
          شاراتك
        </h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            { emoji: "🏅", name: "متعلم نشط", desc: "أكمل أول درس", earned: stats.completed >= 1 },
            { emoji: "⭐", name: "نجم المنصة", desc: "أكمل 5 دروس", earned: stats.completed >= 5 },
            { emoji: "🔥", name: "سلسلة حارقة", desc: "أكمل 10 دروس", earned: stats.completed >= 10 },
          ].map((b) => (
            <div key={b.name} className={`bg-muted/50 rounded-xl p-4 flex items-center gap-3 ${!b.earned ? 'opacity-40' : ''}`}>
              <span className="text-3xl">{b.emoji}</span>
              <div>
                <p className="font-bold text-sm">{b.name}</p>
                <p className="text-xs text-muted-foreground">{b.desc}</p>
                {b.earned && <span className="text-xs text-success">مكتسبة ✓</span>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ─── Learning Path ───
const LearningPath = () => {
  const { user } = useAuth();
  const [curricula, setCurricula] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;
    supabase.from('curricula').select('id, title, lessons(id, title, is_published)').eq('is_published', true).then(async ({ data }) => {
      if (!data) return;
      const { data: progress } = await supabase.from('student_progress').select('lesson_id, status').eq('student_id', user.id);
      const progressMap = new Map((progress || []).map(p => [p.lesson_id, p.status]));
      const enriched = data.map(c => ({
        ...c,
        lessons: (c.lessons || []).filter((l: any) => l.is_published).map((l: any) => ({
          ...l,
          status: progressMap.get(l.id) || 'not_started',
        })),
      }));
      setCurricula(enriched);
    });
  }, [user]);

  const startLesson = async (lessonId: string) => {
    if (!user) return;
    const { error } = await supabase.from('student_progress').insert({ student_id: user.id, lesson_id: lessonId, status: 'in_progress' });
    if (!error) toast.success('تم بدء الدرس');
    window.location.reload();
  };

  const completeLesson = async (lessonId: string) => {
    if (!user) return;
    await supabase.from('student_progress').update({ status: 'completed', score: Math.floor(Math.random() * 30) + 70, completed_at: new Date().toISOString() }).eq('student_id', user.id).eq('lesson_id', lessonId);
    toast.success('تم إكمال الدرس! 🎉');
    window.location.reload();
  };

  return (
    <div className="space-y-6">
      <p className="text-muted-foreground">مسار التعلم المخصص لك</p>
      {curricula.length === 0 ? (
        <div className="bg-card rounded-2xl border border-border p-8 text-center">
          <p className="text-muted-foreground">لا توجد مناهج منشورة بعد</p>
        </div>
      ) : (
        curricula.map(c => (
          <div key={c.id} className="space-y-3">
            <h3 className="font-bold text-lg">{c.title}</h3>
            {c.lessons.map((l: any, i: number) => (
              <div key={l.id} className={`bg-card rounded-2xl border p-5 hover-lift ${l.status === 'completed' ? 'border-success/30' : l.status === 'in_progress' ? 'border-primary/30 ring-2 ring-primary/10' : 'border-border'}`}>
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${
                    l.status === 'completed' ? 'bg-success text-success-foreground' :
                    l.status === 'in_progress' ? 'bg-primary text-primary-foreground' :
                    'bg-muted text-muted-foreground'
                  }`}>{i + 1}</div>
                  <div className="flex-1">
                    <p className="font-medium">{l.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {l.status === 'completed' ? '✅ مكتمل' : l.status === 'in_progress' ? '▶️ جارٍ' : '⏳ لم يبدأ'}
                    </p>
                  </div>
                  {l.status === 'not_started' && (
                    <button onClick={() => startLesson(l.id)} className="bg-gradient-hero text-primary-foreground px-4 py-2 rounded-xl text-xs font-medium">ابدأ</button>
                  )}
                  {l.status === 'in_progress' && (
                    <button onClick={() => completeLesson(l.id)} className="bg-success text-success-foreground px-4 py-2 rounded-xl text-xs font-medium">أكمل</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ))
      )}
    </div>
  );
};

// ─── Flashcards ───
const FlashcardReview = () => {
  const [questions, setQuestions] = useState<any[]>([]);
  const [flipped, setFlipped] = useState<Set<number>>(new Set());

  useEffect(() => {
    supabase.from('quiz_questions').select('question_text, correct_answer, quizzes(title)').limit(12).then(({ data }) => setQuestions(data || []));
  }, []);

  const toggleFlip = (i: number) => {
    setFlipped(prev => { const n = new Set(prev); n.has(i) ? n.delete(i) : n.add(i); return n; });
  };

  const defaultCards = [
    { question_text: "ما هي صيغة حل المعادلة التربيعية؟", correct_answer: "x = (-b ± √(b²-4ac)) / 2a" },
    { question_text: "ما هو مجموع زوايا المثلث؟", correct_answer: "١٨٠ درجة" },
    { question_text: "قانون فيثاغورس", correct_answer: "a² + b² = c²" },
  ];
  const cards = questions.length > 0 ? questions : defaultCards;

  return (
    <div className="space-y-6">
      <p className="text-muted-foreground">اضغط على البطاقة لكشف الإجابة — نظام التكرار المتباعد</p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((card: any, i: number) => (
          <div key={i} onClick={() => toggleFlip(i)} className="bg-card rounded-2xl border border-border p-6 hover-lift cursor-pointer min-h-[200px] flex flex-col justify-between">
            <div>
              <span className="text-xs text-muted-foreground mb-2 block">{(card.quizzes as any)?.title || `بطاقة ${i + 1}`}</span>
              <p className="font-bold text-lg">{card.question_text}</p>
            </div>
            {flipped.has(i) && (
              <div className="mt-4 pt-4 border-t border-border">
                <p className="text-sm text-primary font-medium font-mono" dir="ltr">{card.correct_answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── Quiz ───
const QuizPage = () => {
  const { user } = useAuth();
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [activeQuiz, setActiveQuiz] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    supabase.from('quizzes').select('id, title, description, time_limit_minutes, curricula(title)').eq('is_published', true).then(({ data }) => setQuizzes(data || []));
  }, []);

  const startQuiz = async (quiz: any) => {
    const { data } = await supabase.from('quiz_questions').select('*').eq('quiz_id', quiz.id).order('order_index');
    setQuestions(data || []);
    setActiveQuiz(quiz);
    setCurrentQ(0); setScore(0); setFinished(false); setSelected(null);
  };

  const submitAnswer = () => {
    if (!selected) return;
    const q = questions[currentQ];
    const isCorrect = selected === q.correct_answer;
    if (isCorrect) setScore(s => s + q.points);

    if (currentQ + 1 < questions.length) {
      setCurrentQ(c => c + 1);
      setSelected(null);
    } else {
      setFinished(true);
      if (user && activeQuiz) {
        const finalScore = Math.round(((score + (isCorrect ? q.points : 0)) / questions.reduce((s: number, q: any) => s + q.points, 0)) * 100);
        supabase.from('student_progress').insert({ student_id: user.id, quiz_id: activeQuiz.id, status: 'completed', score: finalScore, completed_at: new Date().toISOString() });
      }
    }
  };

  if (activeQuiz && !finished && questions.length > 0) {
    const q = questions[currentQ];
    const options = Array.isArray(q.options) ? q.options as string[] : [];
    return (
      <div className="max-w-2xl space-y-6">
        <button onClick={() => setActiveQuiz(null)} className="text-sm text-muted-foreground hover:text-foreground">← العودة للاختبارات</button>
        <div className="bg-card rounded-2xl border border-border p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full">السؤال {currentQ + 1} من {questions.length}</span>
            <span className="text-xs text-muted-foreground">{activeQuiz.title}</span>
          </div>
          <h3 className="text-lg font-bold mb-6">{q.question_text}</h3>
          <div className="space-y-3">
            {options.map((opt: string, i: number) => (
              <button key={i} onClick={() => setSelected(opt)} className={`w-full text-right p-4 rounded-xl border transition-all ${selected === opt ? "border-primary bg-primary/5 text-primary font-medium" : "border-border hover:border-primary/30"}`}>
                {opt}
              </button>
            ))}
          </div>
          <div className="mt-6 flex justify-end">
            <button onClick={submitAnswer} disabled={!selected} className="bg-gradient-hero text-primary-foreground px-6 py-2.5 rounded-xl text-sm font-medium disabled:opacity-50">
              {currentQ + 1 < questions.length ? 'التالي ←' : 'إنهاء الاختبار'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (finished) {
    const total = questions.reduce((s: number, q: any) => s + q.points, 0);
    const pct = Math.round((score / total) * 100);
    return (
      <div className="max-w-md mx-auto text-center space-y-6">
        <div className="bg-card rounded-2xl border border-border p-8">
          <span className="text-6xl block mb-4">{pct >= 80 ? '🏆' : pct >= 60 ? '⭐' : '📝'}</span>
          <h2 className="text-2xl font-black mb-2">النتيجة: {pct}%</h2>
          <p className="text-muted-foreground">{score} من {total} نقاط</p>
          <button onClick={() => setActiveQuiz(null)} className="mt-6 bg-gradient-hero text-primary-foreground px-6 py-2.5 rounded-xl text-sm font-medium">العودة للاختبارات</button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <p className="text-muted-foreground">اختبارات متعددة الخيارات لتقييم فهمك</p>
      {quizzes.length === 0 ? (
        <div className="bg-card rounded-2xl border border-border p-8 text-center">
          <p className="text-muted-foreground">لا توجد اختبارات منشورة بعد</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {quizzes.map((q: any) => (
            <div key={q.id} className="bg-card rounded-2xl border border-border p-6 hover-lift">
              <h3 className="font-bold mb-1">{q.title}</h3>
              <p className="text-xs text-muted-foreground mb-3">{(q.curricula as any)?.title} {q.time_limit_minutes ? `· ${q.time_limit_minutes} دقيقة` : ''}</p>
              {q.description && <p className="text-sm text-muted-foreground mb-4">{q.description}</p>}
              <button onClick={() => startQuiz(q)} className="bg-gradient-hero text-primary-foreground px-4 py-2 rounded-xl text-sm font-medium w-full">ابدأ الاختبار</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── Exercises ───
const ExercisePractice = () => (
  <div className="max-w-2xl space-y-6">
    <p className="text-muted-foreground">حل التمارين خطوة بخطوة</p>
    <div className="bg-card rounded-2xl border border-border p-6">
      <span className="text-xs bg-secondary/10 text-secondary px-3 py-1 rounded-full">تمرين تطبيقي</span>
      <h3 className="text-lg font-bold mt-4 mb-2">حل المعادلة التالية:</h3>
      <div className="bg-muted rounded-xl p-4 text-center text-xl font-mono my-4" dir="ltr">3x² - 12x + 9 = 0</div>
      <div className="space-y-3">
        <div>
          <label className="text-sm font-medium mb-1 block">الخطوة ١: استخرج العامل المشترك</label>
          <input className="w-full bg-background border border-input rounded-xl px-4 py-3 text-sm" placeholder="اكتب الخطوة الأولى..." />
        </div>
        <div>
          <label className="text-sm font-medium mb-1 block">الخطوة ٢: حلل إلى عوامل</label>
          <input className="w-full bg-background border border-input rounded-xl px-4 py-3 text-sm" placeholder="اكتب الخطوة الثانية..." />
        </div>
      </div>
      <button className="mt-4 bg-gradient-hero text-primary-foreground px-6 py-2.5 rounded-xl text-sm font-medium">تحقق من الإجابة</button>
    </div>
  </div>
);

// ─── Badges ───
const BadgesPage = () => {
  const { user } = useAuth();
  const [completedCount, setCompletedCount] = useState(0);

  useEffect(() => {
    if (!user) return;
    supabase.from('student_progress').select('*', { count: 'exact', head: true }).eq('student_id', user.id).eq('status', 'completed').then(({ count }) => setCompletedCount(count || 0));
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
          <div key={b.name} className={`bg-card rounded-2xl border p-6 text-center ${b.earned ? 'border-secondary/50' : 'border-border opacity-50'}`}>
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

const StudentDashboard = () => (
  <DashboardLayout title="لوحة الطالب" navItems={navItems} accentColor="bg-primary" roleName="طالب">
    <Routes>
      <Route index element={<DashboardHome />} />
      <Route path="path" element={<LearningPath />} />
      <Route path="flashcards" element={<FlashcardReview />} />
      <Route path="quiz" element={<QuizPage />} />
      <Route path="exercises" element={<ExercisePractice />} />
      <Route path="badges" element={<BadgesPage />} />
      <Route path="*" element={<Navigate to="/student" replace />} />
    </Routes>
  </DashboardLayout>
);

export default StudentDashboard;

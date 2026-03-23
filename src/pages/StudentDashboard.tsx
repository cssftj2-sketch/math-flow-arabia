import { Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import StatCard from "@/components/StatCard";
import {
  LayoutDashboard, Route as RoutePath, BookOpen, Brain, Trophy,
  CreditCard, Target, Star, Flame, CheckCircle2, Clock, BarChart3
} from "lucide-react";

const navItems = [
  { path: "/student", label: "لوحة التحكم", icon: LayoutDashboard },
  { path: "/student/path", label: "مسار التعلم", icon: RoutePath },
  { path: "/student/flashcards", label: "البطاقات", icon: CreditCard },
  { path: "/student/quiz", label: "الاختبارات", icon: Target },
  { path: "/student/exercises", label: "التمارين", icon: Brain },
  { path: "/student/badges", label: "الشارات", icon: Trophy },
];

const topicsProgress = [
  { name: "الجبر", progress: 75, lessons: 12, completed: 9 },
  { name: "الهندسة", progress: 45, lessons: 10, completed: 4 },
  { name: "الإحصاء", progress: 20, lessons: 8, completed: 2 },
  { name: "حساب المثلثات", progress: 60, lessons: 6, completed: 4 },
];

const recentBadges = [
  { emoji: "🏅", name: "متعلم نشط", desc: "أكملت 7 أيام متتالية" },
  { emoji: "⭐", name: "نجم الجبر", desc: "أتقنت 10 مفاهيم" },
  { emoji: "🔥", name: "سلسلة حارقة", desc: "5 اختبارات متتالية بدون أخطاء" },
];

const DashboardHome = () => (
  <div className="space-y-8">
    {/* Stats */}
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard title="نقاط الخبرة" value="٢,٤٥٠" subtitle="XP" icon={<Star className="w-5 h-5 text-primary-foreground" />} colorClass="bg-primary" />
      <StatCard title="أيام متتالية" value="١٢" subtitle="🔥 سلسلة" icon={<Flame className="w-5 h-5 text-primary-foreground" />} colorClass="bg-secondary" />
      <StatCard title="دروس مكتملة" value="٣٧" icon={<CheckCircle2 className="w-5 h-5 text-primary-foreground" />} colorClass="bg-success" />
      <StatCard title="وقت التعلم" value="٢٤ س" subtitle="هذا الشهر" icon={<Clock className="w-5 h-5 text-primary-foreground" />} colorClass="bg-info" />
    </div>

    {/* Learning Path Progress */}
    <div className="bg-card rounded-2xl border border-border p-6">
      <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
        <BarChart3 className="w-5 h-5 text-primary" />
        تقدم المواضيع
      </h2>
      <div className="space-y-4">
        {topicsProgress.map((topic) => (
          <div key={topic.name}>
            <div className="flex justify-between items-center mb-1.5">
              <span className="font-medium text-sm">{topic.name}</span>
              <span className="text-xs text-muted-foreground">{topic.completed}/{topic.lessons} درس</span>
            </div>
            <div className="w-full h-2.5 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-hero rounded-full transition-all duration-500"
                style={{ width: `${topic.progress}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Recent Badges */}
    <div className="bg-card rounded-2xl border border-border p-6">
      <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
        <Trophy className="w-5 h-5 text-secondary" />
        آخر الشارات
      </h2>
      <div className="grid sm:grid-cols-3 gap-4">
        {recentBadges.map((badge) => (
          <div key={badge.name} className="flex items-center gap-3 bg-muted/50 rounded-xl p-4">
            <span className="text-3xl">{badge.emoji}</span>
            <div>
              <p className="font-bold text-sm">{badge.name}</p>
              <p className="text-xs text-muted-foreground">{badge.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const LearningPath = () => (
  <div className="space-y-4">
    <p className="text-muted-foreground mb-6">مسار التعلم المخصص لك بناءً على التقييم التشخيصي</p>
    {topicsProgress.map((topic, i) => (
      <div key={topic.name} className={`bg-card rounded-2xl border border-border p-6 hover-lift ${i === 0 ? 'ring-2 ring-primary/30' : ''}`}>
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-primary-foreground ${i === 0 ? 'bg-primary' : 'bg-muted text-muted-foreground'}`}>
            {i + 1}
          </div>
          <div className="flex-1">
            <h3 className="font-bold">{topic.name}</h3>
            <p className="text-sm text-muted-foreground">{topic.completed} من {topic.lessons} درس مكتمل</p>
            <div className="w-full h-2 bg-muted rounded-full mt-2 overflow-hidden">
              <div className="h-full bg-gradient-hero rounded-full" style={{ width: `${topic.progress}%` }} />
            </div>
          </div>
          <span className="text-lg font-bold text-primary">{topic.progress}%</span>
        </div>
      </div>
    ))}
  </div>
);

const FlashcardReview = () => {
  const cards = [
    { front: "ما هي صيغة حل المعادلة التربيعية؟", back: "x = (-b ± √(b²-4ac)) / 2a" },
    { front: "ما هو مجموع زوايا المثلث؟", back: "١٨٠ درجة" },
    { front: "قانون فيثاغورس", back: "a² + b² = c²" },
  ];

  return (
    <div className="space-y-6">
      <p className="text-muted-foreground">راجع البطاقات التعليمية — نظام التكرار المتباعد</p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((card, i) => (
          <div key={i} className="bg-card rounded-2xl border border-border p-6 hover-lift cursor-pointer group min-h-[200px] flex flex-col justify-between">
            <div>
              <span className="text-xs text-muted-foreground mb-2 block">بطاقة {i + 1}</span>
              <p className="font-bold text-lg">{card.front}</p>
            </div>
            <div className="mt-4 pt-4 border-t border-border opacity-0 group-hover:opacity-100 transition-opacity">
              <p className="text-sm text-primary font-medium font-mono" dir="ltr">{card.back}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const QuizPage = () => (
  <div className="max-w-2xl space-y-6">
    <p className="text-muted-foreground">اختبارات متعددة الخيارات لتقييم فهمك</p>
    <div className="bg-card rounded-2xl border border-border p-6">
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full">السؤال ١ من ١٠</span>
        <span className="text-xs text-muted-foreground">الجبر</span>
      </div>
      <h3 className="text-lg font-bold mb-6">ما هي قيمة x في المعادلة: 2x + 6 = 14؟</h3>
      <div className="space-y-3">
        {["x = 3", "x = 4", "x = 5", "x = 8"].map((opt, i) => (
          <button
            key={i}
            className={`w-full text-right p-4 rounded-xl border transition-all ${
              i === 1
                ? "border-primary bg-primary/5 text-primary font-medium"
                : "border-border hover:border-primary/30 hover:bg-muted/50"
            }`}
          >
            <span className="text-muted-foreground ml-3">{String.fromCharCode(1571 + i)}.</span>
            <span dir="ltr">{opt}</span>
          </button>
        ))}
      </div>
      <div className="mt-6 flex justify-between">
        <button className="text-sm text-muted-foreground">تخطي</button>
        <button className="bg-gradient-hero text-primary-foreground px-6 py-2.5 rounded-xl text-sm font-medium">
          التالي ←
        </button>
      </div>
    </div>
  </div>
);

const ExercisePractice = () => (
  <div className="max-w-2xl space-y-6">
    <p className="text-muted-foreground">حل التمارين خطوة بخطوة</p>
    <div className="bg-card rounded-2xl border border-border p-6">
      <span className="text-xs bg-secondary/10 text-secondary px-3 py-1 rounded-full">تمرين تطبيقي</span>
      <h3 className="text-lg font-bold mt-4 mb-2">حل المعادلة التالية:</h3>
      <div className="bg-muted rounded-xl p-4 text-center text-xl font-mono my-4" dir="ltr">
        3x² - 12x + 9 = 0
      </div>
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
      <button className="mt-4 bg-gradient-hero text-primary-foreground px-6 py-2.5 rounded-xl text-sm font-medium">
        تحقق من الإجابة
      </button>
    </div>
  </div>
);

const BadgesPage = () => {
  const allBadges = [
    { emoji: "🏅", name: "متعلم نشط", desc: "أكمل 7 أيام متتالية", earned: true },
    { emoji: "⭐", name: "نجم الجبر", desc: "أتقن 10 مفاهيم", earned: true },
    { emoji: "🔥", name: "سلسلة حارقة", desc: "5 اختبارات بدون أخطاء", earned: true },
    { emoji: "🎯", name: "القناص", desc: "10 إجابات صحيحة متتالية", earned: false },
    { emoji: "🏆", name: "بطل الهندسة", desc: "أتقن جميع دروس الهندسة", earned: false },
    { emoji: "💎", name: "الماسي", desc: "اجمع 5000 نقطة خبرة", earned: false },
  ];
  return (
    <div className="space-y-6">
      <p className="text-muted-foreground">شاراتك وإنجازاتك</p>
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

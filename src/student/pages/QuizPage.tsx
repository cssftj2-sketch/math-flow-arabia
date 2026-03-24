import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import MathText from "@/shared/components/MathText";

const QuizPage = () => {
  const { user } = useAuth();
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [activeQuiz, setActiveQuiz] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [finalPct, setFinalPct] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    supabase
      .from("quizzes")
      .select("id, title, description, time_limit_minutes, curricula(title)")
      .eq("is_published", true)
      .then(({ data }) => setQuizzes(data ?? []));
  }, []);

  const startQuiz = async (quiz: any) => {
    const { data } = await supabase
      .from("quiz_questions")
      .select("*")
      .eq("quiz_id", quiz.id)
      .order("order_index");

    if (!data || data.length === 0) {
      toast.error("هذا الاختبار لا يحتوي على أسئلة بعد");
      return;
    }

    setQuestions(data);
    setActiveQuiz(quiz);
    setCurrentQ(0);
    setScore(0);
    setFinished(false);
    setSelected(null);
    setFinalPct(0);
  };

  const submitAnswer = async () => {
    if (!selected || submitting) return;
    setSubmitting(true);

    const q = questions[currentQ];
    const isCorrect = selected === q.correct_answer;
    const newScore = isCorrect ? score + q.points : score;
    setScore(newScore);

    const isLastQuestion = currentQ + 1 >= questions.length;

    if (!isLastQuestion) {
      setCurrentQ((c) => c + 1);
      setSelected(null);
      setSubmitting(false);
    } else {
      const totalPoints = questions.reduce((sum: number, q: any) => sum + q.points, 0);
      const pct = totalPoints > 0 ? Math.round((newScore / totalPoints) * 100) : 0;
      setFinalPct(pct);
      setFinished(true);

      if (user && activeQuiz) {
        await supabase.from("student_progress").insert({
          student_id: user.id,
          quiz_id: activeQuiz.id,
          status: "completed",
          score: pct,
          completed_at: new Date().toISOString(),
        });
      }
      setSubmitting(false);
    }
  };

  if (finished) {
    return (
      <div className="max-w-md mx-auto text-center space-y-6">
        <div className="bg-card rounded-2xl border border-border p-8">
          <span className="text-6xl block mb-4">
            {finalPct >= 80 ? "🏆" : finalPct >= 60 ? "⭐" : "📝"}
          </span>
          <h2 className="text-2xl font-black mb-2">النتيجة: {finalPct}%</h2>
          <p className="text-muted-foreground">
            {finalPct >= 80 ? "أداء ممتاز! استمر على هذا المستوى" : finalPct >= 60 ? "جيد! يمكنك التحسين بمزيد من المراجعة" : "تحتاج إلى مراجعة إضافية لهذا الموضوع"}
          </p>
          <button onClick={() => setActiveQuiz(null)} className="mt-6 bg-gradient-hero text-primary-foreground px-6 py-2.5 rounded-xl text-sm font-medium w-full">
            العودة للاختبارات
          </button>
        </div>
      </div>
    );
  }

  if (activeQuiz && questions.length > 0) {
    const q = questions[currentQ];
    const options: string[] = Array.isArray(q.options) ? (q.options as string[]) : [];
    const progress = ((currentQ) / questions.length) * 100;

    return (
      <div className="max-w-2xl space-y-6">
        <button onClick={() => setActiveQuiz(null)} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
          ← العودة للاختبارات
        </button>
        <div className="bg-card rounded-2xl border border-border p-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full">
              السؤال {currentQ + 1} من {questions.length}
            </span>
            <span className="text-xs text-muted-foreground">{activeQuiz.title}</span>
          </div>
          <div className="h-1.5 bg-muted rounded-full mb-6">
            <div className="h-full bg-primary rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>
          <MathText text={q.question_text} className="text-lg font-bold mb-6" />
          <div className="space-y-3">
            {options.map((opt, i) => (
              <button key={i} onClick={() => setSelected(opt)} className={`w-full text-right p-4 rounded-xl border-2 transition-all ${selected === opt ? "border-primary bg-primary/5 text-primary font-medium" : "border-border hover:border-primary/30"}`}>
                <MathText text={opt} />
              </button>
            ))}
          </div>
          <div className="mt-6 flex justify-end">
            <button onClick={submitAnswer} disabled={!selected || submitting} className="bg-gradient-hero text-primary-foreground px-6 py-2.5 rounded-xl text-sm font-medium disabled:opacity-50 flex items-center gap-2">
              {submitting && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
              {currentQ + 1 < questions.length ? "التالي ←" : "إنهاء الاختبار"}
            </button>
          </div>
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
              <p className="text-xs text-muted-foreground mb-3">
                {(q.curricula as any)?.title}
                {q.time_limit_minutes ? ` · ${q.time_limit_minutes} دقيقة` : ""}
              </p>
              {q.description && <p className="text-sm text-muted-foreground mb-4">{q.description}</p>}
              <button onClick={() => startQuiz(q)} className="bg-gradient-hero text-primary-foreground px-4 py-2 rounded-xl text-sm font-medium w-full">
                ابدأ الاختبار
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default QuizPage;

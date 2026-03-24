import { useState } from "react";
import MathText from "@/shared/components/MathText";

const ExercisePractice = () => {
  const [answers, setAnswers] = useState({ step1: "", step2: "" });
  const [checked, setChecked] = useState(false);
  const [correct, setCorrect] = useState<boolean | null>(null);

  const checkAnswer = () => {
    const step1Ok = answers.step1.includes("3") && answers.step1.includes("x");
    const step2Ok = answers.step2.includes("x") && (answers.step2.includes("3") || answers.step2.includes("1"));
    setCorrect(step1Ok && step2Ok);
    setChecked(true);
  };

  return (
    <div className="max-w-2xl space-y-6">
      <p className="text-muted-foreground">حل التمارين خطوة بخطوة</p>
      <div className="bg-card rounded-2xl border border-border p-6">
        <span className="text-xs bg-secondary/10 text-secondary px-3 py-1 rounded-full">تمرين تطبيقي</span>
        <h3 className="text-lg font-bold mt-4 mb-2">حل المعادلة التالية:</h3>
        <MathText text="$$3x^2 - 12x + 9 = 0$$" className="bg-muted rounded-xl p-4 text-center text-xl my-4" />
        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium mb-1 block">الخطوة ١: استخرج العامل المشترك</label>
            <input value={answers.step1} onChange={(e) => { setAnswers((a) => ({ ...a, step1: e.target.value })); setChecked(false); }} className="w-full bg-background border border-input rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" placeholder="مثال: 3(x² - 4x + 3) = 0" dir="ltr" />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">الخطوة ٢: حلل إلى عوامل</label>
            <input value={answers.step2} onChange={(e) => { setAnswers((a) => ({ ...a, step2: e.target.value })); setChecked(false); }} className="w-full bg-background border border-input rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" placeholder="مثال: 3(x-1)(x-3) = 0 → x=1 أو x=3" dir="ltr" />
          </div>
        </div>
        {checked && (
          <div className={`mt-4 p-3 rounded-xl text-sm ${correct ? "bg-success/10 text-success border border-success/20" : "bg-destructive/10 text-destructive border border-destructive/20"}`}>
            {correct ? "✅ إجابة صحيحة! عمل ممتاز" : "❌ الإجابة غير كاملة. الحل: 3(x-1)(x-3)=0 → x=1 أو x=3"}
          </div>
        )}
        <button onClick={checkAnswer} disabled={!answers.step1.trim() || !answers.step2.trim()} className="mt-4 bg-gradient-hero text-primary-foreground px-6 py-2.5 rounded-xl text-sm font-medium disabled:opacity-50">
          تحقق من الإجابة
        </button>
      </div>
    </div>
  );
};

export default ExercisePractice;

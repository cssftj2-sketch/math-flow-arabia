import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import MathText from "@/shared/components/MathText";

const FlashcardReview = () => {
  const [questions, setQuestions] = useState<any[]>([]);
  const [flipped, setFlipped] = useState<Set<number>>(new Set());

  useEffect(() => {
    supabase
      .from("quiz_questions")
      .select("question_text, correct_answer, quizzes(title)")
      .limit(12)
      .then(({ data }) => setQuestions(data ?? []));
  }, []);

  const toggleFlip = (i: number) => {
    setFlipped((prev) => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });
  };

  const defaultCards = [
    {
      question_text: "ما هي صيغة حل المعادلة التربيعية؟",
      correct_answer: "x = (-b ± √(b²-4ac)) / 2a",
    },
    {
      question_text: "ما هو مجموع زوايا المثلث؟",
      correct_answer: "١٨٠ درجة",
    },
    { question_text: "قانون فيثاغورس", correct_answer: "a² + b² = c²" },
  ];

  const cards = questions.length > 0 ? questions : defaultCards;

  return (
    <div className="space-y-6">
      <p className="text-muted-foreground">
        اضغط على البطاقة لكشف الإجابة — نظام التكرار المتباعد
      </p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((card: any, i: number) => (
          <button
            key={i}
            onClick={() => toggleFlip(i)}
            className="bg-card rounded-2xl border border-border p-6 hover-lift text-right min-h-[200px] flex flex-col justify-between w-full"
          >
            <div>
              <span className="text-xs text-muted-foreground mb-2 block">
                {(card.quizzes as any)?.title ?? `بطاقة ${i + 1}`}
              </span>
              <MathText text={card.question_text} className="font-bold text-lg" />
            </div>
            {flipped.has(i) && (
              <div className="mt-4 pt-4 border-t border-border">
                <MathText
                  text={card.correct_answer}
                  className="text-sm text-primary font-medium"
                />
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default FlashcardReview;

import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Link2 } from "lucide-react";
import { toast } from "sonner";

const ParentLink = () => {
  const { user } = useAuth();
  const [code, setCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const generateCode = async () => {
    if (!user) return;
    setLoading(true);
    const newCode = Math.floor(100000 + Math.random() * 900000).toString();
    
    const { error } = await supabase
      .from("student_join_codes" as any)
      .upsert({
        student_id: user.id,
        code: newCode,
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      }, { onConflict: 'student_id' });

    if (error) { toast.error("فشل في إنشاء الرمز: " + error.message); }
    else { setCode(newCode); toast.success("تم إنشاء الرمز بنجاح"); }
    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto space-y-6">
      <div className="bg-card rounded-2xl border border-border p-8 text-center">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
          <Link2 className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-xl font-bold mb-2">ربط حساب ولي الأمر</h2>
        <p className="text-muted-foreground text-sm mb-8 leading-relaxed">
          قم بإنشاء رمز مكون من 6 أرقام وقم بمشاركته مع ولي أمرك ليتمكن من متابعة تقدمك الدراسي.
        </p>

        {code ? (
          <div className="space-y-4">
            <div className="bg-muted rounded-2xl p-6 border-2 border-dashed border-primary/30">
              <p className="text-xs text-muted-foreground mb-2 uppercase tracking-widest">رمز الربط الخاص بك</p>
              <p className="text-4xl font-black tracking-[0.2em] text-primary">{code}</p>
            </div>
            <p className="text-xs text-warning">الرمز صالح لمدة 24 ساعة فقط</p>
            <button onClick={() => setCode(null)} className="text-sm text-muted-foreground hover:text-foreground underline">إخفاء الرمز</button>
          </div>
        ) : (
          <button onClick={generateCode} disabled={loading} className="bg-gradient-hero text-primary-foreground px-8 py-3.5 rounded-xl font-bold text-lg w-full flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50">
            {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : "إنشاء رمز جديد"}
          </button>
        )}
      </div>
      <div className="bg-warning/5 border border-warning/20 rounded-2xl p-4 text-xs text-warning flex gap-3 italic">
        <span className="text-base">⚠️</span>
        <p>مشاركة هذا الرمز تمنح ولي أمرك حق الوصول إلى درجاتك، نقاطك، والشارات التي اكتسبتها.</p>
      </div>
    </div>
  );
};

export default ParentLink;

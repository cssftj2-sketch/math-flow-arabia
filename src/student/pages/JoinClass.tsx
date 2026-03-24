import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import {
  Users,
  Search,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";

const JoinClass = () => {
  const { user } = useAuth();
  const [code, setCode] = useState("");
  const [joining, setJoining] = useState(false);
  const [enrolledClasses, setEnrolledClasses] = useState<any[]>([]);

  const loadEnrollments = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase
      .from("class_enrollments" as any)
      .select("class:classes(id, name, join_code, teacher:profiles(full_name))")
      .eq("student_id", user.id);
    setEnrolledClasses(data?.map((d: any) => d.class) || []);
  }, [user]);

  useEffect(() => {
    loadEnrollments();
  }, [loadEnrollments]);

  const handleJoin = async () => {
    if (!user || !code.trim()) {
      toast.error("يرجى إدخال رمز الفصل");
      return;
    }

    setJoining(true);
    // 1. Find the class
    const { data: classData, error: classError } = await supabase
      .from("classes" as any)
      .select("id, name")
      .eq("join_code", code.trim().toUpperCase())
      .maybeSingle() as any;

    if (classError || !classData) {
      toast.error("لم يتم العثور على فصل بهذا الرمز");
      setJoining(false);
      return;
    }

    // 2. Enroll the student
    const { error: enrollError } = await supabase
      .from("class_enrollments" as any)
      .insert({
        class_id: classData.id,
        student_id: user.id
      });

    setJoining(false);

    if (enrollError) {
      if (enrollError.code === "23505") {
        toast.info("أنت مسجل بالفعل في هذا الفصل");
      } else {
        toast.error("فشل في الانضمام للفصل: " + enrollError.message);
      }
      return;
    }

    toast.success(`تم الانضمام بنجاح إلى: ${classData.name}`);
    setCode("");
    loadEnrollments();
  };

  return (
    <div className="space-y-8">
      <div className="max-w-md mx-auto">
        <div className="bg-card rounded-2xl border border-border p-8 text-center">
          <div className="w-16 h-16 rounded-2xl bg-secondary/10 flex items-center justify-center mx-auto mb-6">
            <Users className="w-8 h-8 text-secondary" />
          </div>
          <h2 className="text-xl font-black mb-2">انضم إلى فصلك الدراسي</h2>
          <p className="text-muted-foreground text-sm mb-6">
            أدخل الرمز المكون من 6 أرقام الذي قدمه لك معلمك
          </p>

          <div className="relative mb-4">
            <input
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="مثال: AB12CD"
              className="w-full bg-background border-2 border-border rounded-xl px-4 py-4 text-center text-2xl font-black tracking-[0.2em] focus:border-secondary focus:outline-none transition-colors"
              maxLength={6}
            />
          </div>

          <button
            onClick={handleJoin}
            disabled={joining || code.length < 6}
            className="bg-gradient-hero text-primary-foreground px-8 py-3.5 rounded-xl font-bold text-lg w-full flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {joining ? (
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Search className="w-5 h-5" />
                بحث وانضمام
              </>
            )}
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-bold text-lg flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-success" />
          فصولك الحالية
        </h3>
        {enrolledClasses.length === 0 ? (
          <p className="text-muted-foreground text-sm italic">لم تنضم إلى أي فصل بعد.</p>
        ) : (
          <div className="grid sm:grid-cols-2 gap-4">
            {enrolledClasses.map((c: any) => (
              <div key={c.id} className="bg-card rounded-2xl border border-border p-5 flex items-center justify-between">
                <div>
                  <p className="font-bold">{c.name}</p>
                  <p className="text-xs text-muted-foreground">
                    المعلم: {c.teacher?.full_name || "غير معروف"}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] bg-secondary/10 text-secondary px-2 py-0.5 rounded-full font-bold">
                    {c.join_code}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default JoinClass;

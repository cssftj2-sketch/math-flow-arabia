-- Create the student_join_codes table
CREATE TABLE IF NOT EXISTS public.student_join_codes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    code TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    expires_at TIMESTAMPTZ NOT NULL DEFAULT (now() + interval '24 hours')
);

-- Index for faster lookups by code
CREATE INDEX IF NOT EXISTS idx_student_join_codes_code ON public.student_join_codes(code);

-- Enable RLS
ALTER TABLE public.student_join_codes ENABLE ROW LEVEL SECURITY;

-- Policies
-- Students can manage their own codes
CREATE POLICY "Students can manage their own join codes" 
ON public.student_join_codes
FOR ALL
TO authenticated
USING (auth.uid() = student_id);

-- Parents can view codes to verify them (this is safe because they need to know the code already)
CREATE POLICY "Parents can view join codes by code"
ON public.student_join_codes
FOR SELECT
TO authenticated
USING (EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND role = 'parent'
));

-- Function to cleanup expired codes
CREATE OR REPLACE FUNCTION public.cleanup_expired_join_codes()
RETURNS void AS $$
BEGIN
    DELETE FROM public.student_join_codes WHERE expires_at < now();
END;
$$ LANGUAGE plpgsql;

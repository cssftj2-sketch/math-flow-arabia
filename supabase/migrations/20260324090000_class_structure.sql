-- Create classes table
CREATE TABLE IF NOT EXISTS public.classes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    teacher_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    join_code TEXT NOT NULL UNIQUE,
    curriculum_id UUID REFERENCES public.curricula(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create class_enrollments table
CREATE TABLE IF NOT EXISTS public.class_enrollments (
    class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    enrolled_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (class_id, student_id)
);

-- Enable RLS
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.class_enrollments ENABLE ROW LEVEL SECURITY;

-- Policies for classes
CREATE POLICY "Teachers can manage their own classes"
ON public.classes
FOR ALL
TO authenticated
USING (auth.uid() = teacher_id);

CREATE POLICY "Students can view classes they join"
ON public.classes
FOR SELECT
TO authenticated
USING (EXISTS (
    SELECT 1 FROM public.class_enrollments
    WHERE class_id = public.classes.id AND student_id = auth.uid()
));

-- Policies for enrollments
CREATE POLICY "Teachers can view enrollments for their classes"
ON public.class_enrollments
FOR SELECT
TO authenticated
USING (EXISTS (
    SELECT 1 FROM public.classes
    WHERE id = public.class_enrollments.class_id AND teacher_id = auth.uid()
));

CREATE POLICY "Students can enroll themselves"
ON public.class_enrollments
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Students can view their own enrollments"
ON public.class_enrollments
FOR SELECT
TO authenticated
USING (auth.uid() = student_id);


-- profiles
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL DEFAULT '',
  email TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own profile select" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "own profile update" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);
CREATE POLICY "own profile insert" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

-- quizzes
CREATE TABLE public.quizzes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  subject TEXT NOT NULL DEFAULT 'General',
  difficulty TEXT NOT NULL DEFAULT 'Medium',
  total_questions INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.quizzes TO authenticated;
GRANT ALL ON public.quizzes TO service_role;
ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own quizzes" ON public.quizzes FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE INDEX ON public.quizzes(user_id, created_at DESC);

-- questions
CREATE TABLE public.questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id UUID NOT NULL REFERENCES public.quizzes(id) ON DELETE CASCADE,
  position INT NOT NULL,
  question_text TEXT NOT NULL,
  option_a TEXT NOT NULL,
  option_b TEXT NOT NULL,
  option_c TEXT NOT NULL,
  option_d TEXT NOT NULL,
  correct_answer_index INT NOT NULL CHECK (correct_answer_index BETWEEN 0 AND 3),
  explanation TEXT NOT NULL DEFAULT ''
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.questions TO authenticated;
GRANT ALL ON public.questions TO service_role;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own quiz questions" ON public.questions FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.quizzes q WHERE q.id = quiz_id AND q.user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.quizzes q WHERE q.id = quiz_id AND q.user_id = auth.uid()));
CREATE INDEX ON public.questions(quiz_id, position);

-- attempts
CREATE TABLE public.attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  quiz_id UUID NOT NULL REFERENCES public.quizzes(id) ON DELETE CASCADE,
  score NUMERIC NOT NULL DEFAULT 0,
  time_taken_seconds INT NOT NULL DEFAULT 0,
  attempted_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.attempts TO authenticated;
GRANT ALL ON public.attempts TO service_role;
ALTER TABLE public.attempts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own attempts" ON public.attempts FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE INDEX ON public.attempts(user_id, attempted_at DESC);

-- answers
CREATE TABLE public.answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  attempt_id UUID NOT NULL REFERENCES public.attempts(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
  selected_option_index INT CHECK (selected_option_index BETWEEN 0 AND 3),
  is_correct BOOLEAN NOT NULL DEFAULT false
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.answers TO authenticated;
GRANT ALL ON public.answers TO service_role;
ALTER TABLE public.answers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own answers" ON public.answers FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.attempts a WHERE a.id = attempt_id AND a.user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.attempts a WHERE a.id = attempt_id AND a.user_id = auth.uid()));
CREATE INDEX ON public.answers(attempt_id);

-- handle new user
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'name', ''), NEW.email)
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

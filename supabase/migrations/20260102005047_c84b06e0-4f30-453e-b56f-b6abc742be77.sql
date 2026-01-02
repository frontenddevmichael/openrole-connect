-- Create enum for user roles
CREATE TYPE public.user_role AS ENUM ('student', 'organization');

-- Create enum for internship work type
CREATE TYPE public.work_type AS ENUM ('remote', 'onsite', 'hybrid');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  email TEXT NOT NULL,
  full_name TEXT,
  role user_role NOT NULL,
  field TEXT,
  skills TEXT[],
  cv_url TEXT,
  organization_name TEXT,
  organization_description TEXT,
  organization_website TEXT,
  organization_logo_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create internships table
CREATE TABLE public.internships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  field TEXT NOT NULL,
  location TEXT,
  work_type work_type NOT NULL DEFAULT 'onsite',
  requirements TEXT[],
  duration TEXT,
  is_paid BOOLEAN DEFAULT false,
  stipend TEXT,
  application_deadline TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create applications table
CREATE TABLE public.applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  internship_id UUID NOT NULL REFERENCES public.internships(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  cover_letter TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(internship_id, student_id)
);

-- Create saved internships table
CREATE TABLE public.saved_internships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  internship_id UUID NOT NULL REFERENCES public.internships(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(internship_id, student_id)
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.internships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_internships ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Profiles are viewable by everyone" ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Internships policies
CREATE POLICY "Active internships are viewable by everyone" ON public.internships
  FOR SELECT USING (is_active = true OR organization_id = auth.uid());

CREATE POLICY "Organizations can insert their own internships" ON public.internships
  FOR INSERT WITH CHECK (auth.uid() = organization_id);

CREATE POLICY "Organizations can update their own internships" ON public.internships
  FOR UPDATE USING (auth.uid() = organization_id);

CREATE POLICY "Organizations can delete their own internships" ON public.internships
  FOR DELETE USING (auth.uid() = organization_id);

-- Applications policies
CREATE POLICY "Students can view their own applications" ON public.applications
  FOR SELECT USING (auth.uid() = student_id);

CREATE POLICY "Organizations can view applications for their internships" ON public.applications
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.internships 
      WHERE internships.id = applications.internship_id 
      AND internships.organization_id = auth.uid()
    )
  );

CREATE POLICY "Students can insert their own applications" ON public.applications
  FOR INSERT WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Students can update their own applications" ON public.applications
  FOR UPDATE USING (auth.uid() = student_id);

-- Saved internships policies
CREATE POLICY "Students can view their saved internships" ON public.saved_internships
  FOR SELECT USING (auth.uid() = student_id);

CREATE POLICY "Students can save internships" ON public.saved_internships
  FOR INSERT WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Students can unsave internships" ON public.saved_internships
  FOR DELETE USING (auth.uid() = student_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_internships_updated_at
  BEFORE UPDATE ON public.internships
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_applications_updated_at
  BEFORE UPDATE ON public.applications
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for CVs
INSERT INTO storage.buckets (id, name, public) VALUES ('cvs', 'cvs', true);

-- Storage policies for CVs
CREATE POLICY "Anyone can view CVs" ON storage.objects
  FOR SELECT USING (bucket_id = 'cvs');

CREATE POLICY "Authenticated users can upload CVs" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'cvs' AND auth.role() = 'authenticated');

CREATE POLICY "Users can update their own CVs" ON storage.objects
  FOR UPDATE USING (bucket_id = 'cvs' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own CVs" ON storage.objects
  FOR DELETE USING (bucket_id = 'cvs' AND auth.uid()::text = (storage.foldername(name))[1]);
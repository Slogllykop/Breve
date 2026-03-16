-- Drop the overly permissive insert policy
DROP POLICY IF EXISTS "clicks_insert_anon" ON public.clicks;

-- Create a stricter policy that only allows anon role to insert (not authenticated users bypassing their own RLS)
CREATE POLICY "clicks_insert_anon" ON public.clicks
FOR INSERT
TO anon
WITH CHECK (true);

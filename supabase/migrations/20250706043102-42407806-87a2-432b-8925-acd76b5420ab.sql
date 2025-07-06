
-- Remove admin role and update existing data
UPDATE public.profiles SET role = 'inventory_manager' WHERE role = 'admin';

-- Drop the existing user_role enum and recreate without admin
DROP TYPE IF EXISTS public.user_role CASCADE;
CREATE TYPE public.user_role AS ENUM ('inventory_manager', 'production_worker', 'customer_service');

-- Re-add the role column with the updated enum
ALTER TABLE public.profiles ADD COLUMN temp_role public.user_role;
UPDATE public.profiles SET temp_role = CASE 
  WHEN role::text = 'inventory_manager' THEN 'inventory_manager'::public.user_role
  WHEN role::text = 'production_worker' THEN 'production_worker'::public.user_role
  WHEN role::text = 'customer_service' THEN 'customer_service'::public.user_role
  ELSE 'inventory_manager'::public.user_role
END;
ALTER TABLE public.profiles DROP COLUMN role;
ALTER TABLE public.profiles RENAME COLUMN temp_role TO role;
ALTER TABLE public.profiles ALTER COLUMN role SET DEFAULT 'inventory_manager'::public.user_role;
ALTER TABLE public.profiles ALTER COLUMN role SET NOT NULL;

-- Create production_tasks table for production workers
CREATE TABLE public.production_tasks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES public.products(id) NOT NULL,
  worker_id UUID REFERENCES auth.users(id) NOT NULL,
  task_type TEXT NOT NULL CHECK (task_type IN ('manufacturing', 'quality_check', 'assembly')),
  quantity_target INTEGER NOT NULL,
  quantity_completed INTEGER DEFAULT 0,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'quality_failed')),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  notes TEXT,
  due_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on production_tasks
ALTER TABLE public.production_tasks ENABLE ROW LEVEL SECURITY;

-- Create customer_interactions table for customer service
CREATE TABLE public.customer_interactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID REFERENCES public.customers(id) NOT NULL,
  staff_id UUID REFERENCES auth.users(id) NOT NULL,
  interaction_type TEXT NOT NULL CHECK (interaction_type IN ('support_call', 'email', 'chat', 'order_inquiry')),
  subject TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on customer_interactions
ALTER TABLE public.customer_interactions ENABLE ROW LEVEL SECURITY;

-- Create function to get user role securely
CREATE OR REPLACE FUNCTION public.get_user_role(user_uuid UUID)
RETURNS public.user_role
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
  SELECT role FROM public.profiles WHERE id = user_uuid;
$$;

-- RLS Policies for products (only inventory managers can insert/update)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Everyone can view products" ON public.products
  FOR SELECT USING (true);

CREATE POLICY "Only inventory managers can insert products" ON public.products
  FOR INSERT WITH CHECK (
    public.get_user_role(auth.uid()) = 'inventory_manager'
  );

CREATE POLICY "Only inventory managers can update products" ON public.products
  FOR UPDATE USING (
    public.get_user_role(auth.uid()) = 'inventory_manager'
  );

-- RLS Policies for production_tasks (only production workers)
CREATE POLICY "Production workers can view all production tasks" ON public.production_tasks
  FOR SELECT USING (
    public.get_user_role(auth.uid()) = 'production_worker'
  );

CREATE POLICY "Production workers can create production tasks" ON public.production_tasks
  FOR INSERT WITH CHECK (
    public.get_user_role(auth.uid()) = 'production_worker' AND
    worker_id = auth.uid()
  );

CREATE POLICY "Production workers can update their own tasks" ON public.production_tasks
  FOR UPDATE USING (
    public.get_user_role(auth.uid()) = 'production_worker' AND
    worker_id = auth.uid()
  );

-- RLS Policies for customer_interactions (only customer service)
CREATE POLICY "Customer service can view all interactions" ON public.customer_interactions
  FOR SELECT USING (
    public.get_user_role(auth.uid()) = 'customer_service'
  );

CREATE POLICY "Customer service can create interactions" ON public.customer_interactions
  FOR INSERT WITH CHECK (
    public.get_user_role(auth.uid()) = 'customer_service' AND
    staff_id = auth.uid()
  );

CREATE POLICY "Customer service can update interactions" ON public.customer_interactions
  FOR UPDATE USING (
    public.get_user_role(auth.uid()) = 'customer_service' AND
    staff_id = auth.uid()
  );

-- RLS Policies for customers (only customer service can manage)
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Customer service can view all customers" ON public.customers
  FOR SELECT USING (
    public.get_user_role(auth.uid()) = 'customer_service'
  );

CREATE POLICY "Customer service can update customers" ON public.customers
  FOR UPDATE USING (
    public.get_user_role(auth.uid()) = 'customer_service'
  );

-- Update production_logs to require production worker role
ALTER TABLE public.production_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Production workers can view production logs" ON public.production_logs
  FOR SELECT USING (
    public.get_user_role(auth.uid()) = 'production_worker'
  );

CREATE POLICY "Production workers can create production logs" ON public.production_logs
  FOR INSERT WITH CHECK (
    public.get_user_role(auth.uid()) = 'production_worker'
  );

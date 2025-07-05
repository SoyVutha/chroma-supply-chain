
-- Create enum for user roles
CREATE TYPE public.user_role AS ENUM ('inventory_manager', 'production_worker', 'customer_service', 'admin');

-- Add role column to profiles table
ALTER TABLE public.profiles ADD COLUMN role public.user_role DEFAULT 'inventory_manager';

-- Update existing profiles to have a default role (if any exist)
UPDATE public.profiles SET role = 'inventory_manager' WHERE role IS NULL;

-- Create workers table for ERP system
CREATE TABLE public.workers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now()
);

-- Create products table
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC NOT NULL,
  stock_quantity INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now()
);

-- Create customers table
CREATE TABLE public.customers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  password TEXT NOT NULL,
  registered BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now()
);

-- Create orders table
CREATE TABLE public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID REFERENCES public.customers(id),
  status TEXT DEFAULT 'Pending',
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now()
);

-- Create order_items table
CREATE TABLE public.order_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES public.orders(id),
  product_id UUID REFERENCES public.products(id),
  quantity INTEGER NOT NULL,
  price NUMERIC NOT NULL
);

-- Create production_logs table
CREATE TABLE public.production_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES public.products(id),
  worker_id UUID REFERENCES public.workers(id),
  quantity_produced INTEGER NOT NULL,
  quality_checked BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now()
);

-- Create support_tickets table
CREATE TABLE public.support_tickets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID REFERENCES public.customers(id),
  issue TEXT NOT NULL,
  status TEXT DEFAULT 'Open',
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now()
);

-- Create payments table
CREATE TABLE public.payments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES public.orders(id),
  amount NUMERIC NOT NULL,
  payment_method TEXT,
  status TEXT DEFAULT 'Pending',
  processed_at TIMESTAMP WITHOUT TIME ZONE
);

-- Insert some sample data for testing
INSERT INTO public.products (name, description, price, stock_quantity) VALUES
('Steel Widget Type A', 'High-quality steel widget for industrial use', 45.99, 150),
('Aluminum Component B', 'Lightweight aluminum component', 28.50, 23),
('Plastic Assembly C', 'Durable plastic assembly', 15.75, 0),
('Electronic Module D', 'Advanced electronic control module', 125.00, 89),
('Rubber Gasket E', 'Weather-resistant rubber gasket', 8.25, 15);

INSERT INTO public.workers (name, role) VALUES
('John Smith', 'Production Manager'),
('Sarah Johnson', 'Quality Control'),
('Mike Davis', 'Assembly Line Worker'),
('Lisa Wilson', 'Inventory Specialist');

INSERT INTO public.customers (name, email, password, registered) VALUES
('Acme Manufacturing Corp', 'orders@acme.com', 'hashed_password', true),
('Global Tech Solutions', 'procurement@globaltech.com', 'hashed_password', true),
('Midwest Assembly LLC', 'contact@midwestasm.com', 'hashed_password', false);

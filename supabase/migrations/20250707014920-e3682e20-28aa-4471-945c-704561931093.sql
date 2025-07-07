
-- First, let's clean up any admin roles and ensure proper ERP role structure
DELETE FROM worker_profiles WHERE role = 'admin';

-- Update the ERP role constraint to only allow the three specified roles
ALTER TABLE worker_profiles DROP CONSTRAINT IF EXISTS worker_profiles_role_check;
ALTER TABLE worker_profiles ADD CONSTRAINT worker_profiles_role_check 
CHECK (role IN ('inventory_manager', 'production_worker', 'customer_service'));

-- Create production tasks table for production workers
CREATE TABLE IF NOT EXISTS production_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_name TEXT NOT NULL,
  product_id UUID REFERENCES products(id),
  assigned_worker_id UUID REFERENCES worker_profiles(id),
  quantity_target INTEGER NOT NULL DEFAULT 0,
  quantity_completed INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'on_hold')),
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  due_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS policies for production tasks
ALTER TABLE production_tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Production workers can manage their tasks" ON production_tasks
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM worker_profiles 
    WHERE user_id = auth.uid() 
    AND role = 'production_worker'
    AND (id = production_tasks.assigned_worker_id OR assigned_worker_id IS NULL)
  )
);

CREATE POLICY "Inventory managers can view all production tasks" ON production_tasks
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM worker_profiles 
    WHERE user_id = auth.uid() 
    AND role IN ('inventory_manager', 'production_worker')
  )
);

-- Create function to automatically decrease stock when order is completed
CREATE OR REPLACE FUNCTION decrease_product_stock()
RETURNS TRIGGER AS $$
BEGIN
  -- Only decrease stock when order status changes to 'completed' or 'delivered'
  IF NEW.status IN ('completed', 'delivered') AND OLD.status NOT IN ('completed', 'delivered') THEN
    -- Decrease stock for each item in the order
    UPDATE products 
    SET stock_quantity = stock_quantity - oi.quantity
    FROM order_items oi
    WHERE products.id = oi.product_id 
    AND oi.order_id = NEW.id;
    
    -- Check if any product went to negative stock
    IF EXISTS (
      SELECT 1 FROM products p
      JOIN order_items oi ON p.id = oi.product_id
      WHERE oi.order_id = NEW.id AND p.stock_quantity < 0
    ) THEN
      RAISE EXCEPTION 'Insufficient stock for order %', NEW.id;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for stock decrease
DROP TRIGGER IF EXISTS trigger_decrease_stock ON orders;
CREATE TRIGGER trigger_decrease_stock
  AFTER UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION decrease_product_stock();

-- Enable realtime subscriptions for better sync
ALTER TABLE products REPLICA IDENTITY FULL;
ALTER TABLE orders REPLICA IDENTITY FULL;
ALTER TABLE production_tasks REPLICA IDENTITY FULL;

-- Add tables to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE products;
ALTER PUBLICATION supabase_realtime ADD TABLE orders;
ALTER PUBLICATION supabase_realtime ADD TABLE production_tasks;

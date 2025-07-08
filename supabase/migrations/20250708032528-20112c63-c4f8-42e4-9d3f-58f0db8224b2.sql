
-- Fix the order status constraint to match what the application is using
ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_status_check;

-- Add the correct constraint with valid status values
ALTER TABLE orders ADD CONSTRAINT orders_status_check 
CHECK (status IN ('pending', 'processing', 'completed', 'cancelled'));

-- Update any existing orders with invalid status to 'pending'
UPDATE orders SET status = 'pending' WHERE status NOT IN ('pending', 'processing', 'completed', 'cancelled');

-- Remove production_worker role from worker_profiles and update role constraint
DELETE FROM worker_profiles WHERE role = 'production_worker';

-- Update the role constraint to only allow the remaining roles
ALTER TABLE worker_profiles DROP CONSTRAINT IF EXISTS worker_profiles_role_check;
ALTER TABLE worker_profiles ADD CONSTRAINT worker_profiles_role_check 
CHECK (role IN ('inventory_manager', 'customer_service', 'admin'));

-- Update production_logs policies to only allow inventory_manager
DROP POLICY IF EXISTS "Inventory managers can view production logs" ON production_logs;
DROP POLICY IF EXISTS "Production workers can manage production logs" ON production_logs;

CREATE POLICY "Inventory managers can manage production logs" 
ON production_logs FOR ALL 
USING (get_user_role(auth.uid()) = 'inventory_manager');

-- Ensure customers table has proper indexes for ERP queries
CREATE INDEX IF NOT EXISTS idx_customers_created_at ON customers(created_at);
CREATE INDEX IF NOT EXISTS idx_customers_registered ON customers(registered);

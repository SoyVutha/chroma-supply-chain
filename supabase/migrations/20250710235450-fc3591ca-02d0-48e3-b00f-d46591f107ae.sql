-- Fix automatic stock deduction when orders are completed
-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS trigger_decrease_stock ON orders;

-- Create or replace the function to decrease product stock when order is completed
CREATE OR REPLACE FUNCTION public.decrease_product_stock()
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

-- Create trigger for stock decrease when order is completed
CREATE TRIGGER trigger_decrease_stock
  AFTER UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION decrease_product_stock();

-- Also ensure we have a function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
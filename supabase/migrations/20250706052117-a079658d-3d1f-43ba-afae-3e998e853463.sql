
-- Create function to update product stock when order items are inserted
CREATE OR REPLACE FUNCTION update_product_stock()
RETURNS TRIGGER AS $$
BEGIN
  -- Decrease stock quantity when order item is inserted
  UPDATE products 
  SET stock_quantity = stock_quantity - NEW.quantity
  WHERE id = NEW.product_id;
  
  -- Check if stock went negative and handle it
  IF (SELECT stock_quantity FROM products WHERE id = NEW.product_id) < 0 THEN
    RAISE EXCEPTION 'Insufficient stock for product ID: %', NEW.product_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create function to restore product stock when order items are deleted
CREATE OR REPLACE FUNCTION restore_product_stock()
RETURNS TRIGGER AS $$
BEGIN
  -- Increase stock quantity when order item is deleted
  UPDATE products 
  SET stock_quantity = stock_quantity + OLD.quantity
  WHERE id = OLD.product_id;
  
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic stock management
CREATE TRIGGER trigger_update_stock_on_insert
  AFTER INSERT ON order_items
  FOR EACH ROW
  EXECUTE FUNCTION update_product_stock();

CREATE TRIGGER trigger_restore_stock_on_delete
  AFTER DELETE ON order_items
  FOR EACH ROW
  EXECUTE FUNCTION restore_product_stock();

-- Enable realtime for products table so changes are immediately visible
ALTER TABLE products REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE products;

-- Enable realtime for orders and order_items tables
ALTER TABLE orders REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE orders;

ALTER TABLE order_items REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE order_items;

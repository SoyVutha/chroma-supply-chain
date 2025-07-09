-- Clear existing unrelated product data and replace with manufacturing-relevant items
DELETE FROM order_items;
DELETE FROM production_logs;
DELETE FROM products;

-- Insert manufacturing and industrial-relevant products
INSERT INTO public.products (name, description, price, stock_quantity) VALUES
-- Steel Products
('Steel Sheet - Grade A36', 'High-quality carbon steel sheet, 4x8 ft, 1/4 inch thick', 245.99, 50),
('Steel Rod - Round Bar', 'Carbon steel round bar, 1 inch diameter, 20 ft length', 89.50, 75),
('Stainless Steel Pipe', '304 stainless steel pipe, 2 inch diameter, schedule 40', 156.75, 30),
('Steel Angle Iron', 'Structural steel angle, 2x2x1/4 inch, 20 ft length', 67.25, 45),

-- Aluminum Products  
('Aluminum Sheet - 6061-T6', 'Aircraft grade aluminum sheet, 4x8 ft, 1/8 inch thick', 189.99, 40),
('Aluminum Extrusion', 'T-slot aluminum extrusion, 40x40mm profile, 3 meter length', 78.50, 60),
('Aluminum Round Tube', '6063 aluminum round tube, 2 inch OD, 1/8 wall thickness', 95.75, 35),
('Aluminum Angle Bar', 'Structural aluminum angle, 2x2x1/8 inch, 12 ft length', 45.25, 55),

-- Plastic Components
('HDPE Plastic Sheet', 'High-density polyethylene sheet, natural color, 1/2 inch thick', 124.99, 25),
('Nylon Rod - Type 6', 'Nylon 6 round rod, 1 inch diameter, machinable grade', 67.50, 40),
('Polycarbonate Panel', 'Clear polycarbonate sheet, 24x48 inch, 1/4 inch thick', 145.75, 20),
('PVC Pipe', 'Schedule 40 PVC pipe, 4 inch diameter, 10 ft length', 34.99, 80),

-- Electronic Components
('Industrial Controller PLC', 'Programmable logic controller, 16 I/O, modular design', 1250.00, 15),
('AC Motor - 3 Phase', '5 HP three-phase induction motor, 1800 RPM, TEFC', 875.50, 12),
('Proximity Sensor', 'Inductive proximity sensor, M18, 12-24VDC, PNP output', 89.99, 45),
('Variable Frequency Drive', '3 HP VFD, 480V input, vector control, RS485 communication', 945.75, 8),

-- Fasteners and Hardware
('Hex Bolts - Grade 8', 'High-strength hex bolts, 1/2-13 x 3 inch, zinc plated (box of 100)', 156.25, 200),
('Socket Head Cap Screws', 'Alloy steel SHCS, M10 x 50mm, black oxide finish (box of 50)', 78.99, 150),
('Industrial Washers', 'Hardened steel flat washers, 1/2 inch ID (box of 500)', 45.50, 300),
('Lock Nuts - Nylon Insert', 'Grade 8 nylon insert lock nuts, 1/2-13 thread (box of 100)', 89.75, 180),

-- Industrial Tools and Equipment
('Precision Measuring Caliper', 'Digital caliper, 0-6 inch range, 0.0005 resolution, IP54 rated', 145.99, 25),
('Industrial Drill Bits', 'HSS twist drill bit set, 1/16 to 1/2 inch, 135-degree point', 234.50, 30),
('Cutting Fluid - Synthetic', 'Water-soluble cutting fluid concentrate, 5-gallon pail', 178.25, 20),
('Safety Glasses - Industrial', 'ANSI Z87.1 safety glasses, anti-fog coating (case of 12)', 67.99, 50),

-- Raw Materials
('Copper Wire - 12 AWG', 'Solid copper wire, 12 AWG, THHN insulation, 500 ft spool', 189.50, 35),
('Rubber Gasket Material', 'Neoprene rubber sheet, 1/8 inch thick, 36x36 inch', 89.25, 40),
('Industrial Adhesive', 'Two-part epoxy adhesive, structural grade, 1-gallon kit', 156.75, 25),
('Abrasive Grinding Wheels', 'Aluminum oxide grinding wheels, 7 inch diameter (pack of 10)', 134.99, 60);
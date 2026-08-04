-- Create Audit Logs Table
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  action_type TEXT NOT NULL, -- e.g., 'CREATE', 'UPDATE', 'DELETE', 'LOGIN'
  entity_type TEXT NOT NULL, -- e.g., 'Hospital', 'User', 'Subscription', 'System'
  user_email TEXT NOT NULL,
  details TEXT NOT NULL,
  ip_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert some mock initial logs for demonstration
INSERT INTO audit_logs (action_type, entity_type, user_email, details, ip_address)
VALUES 
  ('LOGIN', 'System', 'admin@medidoc.com', 'Super Admin logged into the dashboard successfully.', '192.168.1.1'),
  ('UPDATE', 'Subscription', 'admin@medidoc.com', 'Changed price of Pro Plan from ₹4999 to ₹5999.', '192.168.1.1'),
  ('CREATE', 'Hospital', 'sales@medidoc.com', 'Onboarded a new hospital: Apollo Care.', '10.0.0.45'),
  ('DELETE', 'User', 'admin@medidoc.com', 'Removed inactive user account: test@medidoc.com.', '192.168.1.1'),
  ('LOGIN', 'System', 'sales@medidoc.com', 'Sales representative logged in.', '10.0.0.45');

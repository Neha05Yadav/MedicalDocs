-- Create Super Admin Notifications Table
CREATE TABLE super_admin_notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'info', -- 'info', 'success', 'warning', 'error'
  is_read BOOLEAN DEFAULT false,
  action_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert some mock initial notifications so the dashboard is not empty
INSERT INTO super_admin_notifications (title, message, type, is_read, action_url)
VALUES 
  ('New Hospital Onboarded', 'Apollo Care has registered on the platform and is waiting for KYC verification.', 'success', false, '/management/super-admin/facilities'),
  ('High Server Latency', 'The Reporting API is experiencing unusually high latency (>2000ms).', 'warning', false, '/management/super-admin/analytics'),
  ('Subscription Payment Failed', 'Stripe webhook reported a failed payment for City Hospital Pro Plan.', 'error', false, '/management/super-admin/subscriptions'),
  ('System Backup Successful', 'Daily automated database backup completed successfully at 02:00 AM.', 'info', true, NULL);

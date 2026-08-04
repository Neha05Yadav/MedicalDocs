-- Create Subscription Plans Table
CREATE TABLE subscription_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  price NUMERIC NOT NULL,
  target TEXT,
  features JSONB NOT NULL DEFAULT '[]',
  popular BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Hospital Subscriptions Table
CREATE TABLE hospital_subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  hospital_id UUID REFERENCES hospitals(id) ON DELETE CASCADE,
  plan_id UUID REFERENCES subscription_plans(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'active',
  start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  end_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Optional: Insert a default Free Plan
INSERT INTO subscription_plans (name, price, target, features, popular)
VALUES ('Beta Free', 0, 'For new hospitals testing the platform', '["Up to 2 Doctors", "Basic Reports", "Email Support"]', false);

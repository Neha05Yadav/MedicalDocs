-- Create Platform Settings Table
CREATE TABLE platform_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  website_name TEXT NOT NULL DEFAULT 'Medidoc Platform',
  logo_url TEXT NOT NULL DEFAULT '/assets/logo.png',
  support_email TEXT NOT NULL DEFAULT 'support@medidoc.com',
  maintenance_mode BOOLEAN NOT NULL DEFAULT false,
  require_complex_password BOOLEAN NOT NULL DEFAULT true,
  password_expiry_days INTEGER NOT NULL DEFAULT 90,
  require_2fa BOOLEAN NOT NULL DEFAULT true,
  session_timeout_minutes INTEGER NOT NULL DEFAULT 30,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert a single row for global settings
INSERT INTO platform_settings (website_name) VALUES ('Medidoc Platform');

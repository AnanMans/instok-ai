-- Run this in the Supabase SQL editor (Database → SQL editor → New query)
ALTER TABLE stores ADD COLUMN IF NOT EXISTS business_phone TEXT;
ALTER TABLE stores ADD COLUMN IF NOT EXISTS bit_phone_override TEXT;

-- Migrate existing data: fill business_phone from whatsapp_number
UPDATE stores
SET business_phone = whatsapp_number
WHERE business_phone IS NULL
  AND whatsapp_number IS NOT NULL
  AND whatsapp_number != '';

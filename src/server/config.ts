/**
 * Barmantra — Central Environment & Secrets Configuration
 */

import dotenv from 'dotenv';

// Load .env file variables
dotenv.config();

/**
 * Reads a required environment variable.
 * Throws a clear Error immediately if missing or empty.
 */
export function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value || value.trim() === '') {
    throw new Error(`Missing required environment variable: ${name}. Set it in .env before starting the server.`);
  }
  return value.trim();
}

/**
 * Reads an optional environment variable for non-secret feature flags or sandbox config.
 * Returns defaultValue if missing or empty.
 */
export function optionalEnv(name: string, defaultValue: string = ''): string {
  const value = process.env[name];
  if (!value || value.trim() === '') {
    return defaultValue;
  }
  return value.trim();
}

// Required Application Secrets (Must be set in .env)
export const JWT_ACCESS_SECRET = requireEnv('JWT_ACCESS_SECRET');
export const JWT_REFRESH_SECRET = requireEnv('JWT_REFRESH_SECRET');

// Optional Feature Integration Keys (Sandbox mode active if omitted)
export const RAZORPAY_KEY_ID = optionalEnv('RAZORPAY_KEY_ID', '');
export const RAZORPAY_KEY_SECRET = optionalEnv('RAZORPAY_KEY_SECRET', '');
export const STRIPE_SECRET_KEY = optionalEnv('STRIPE_SECRET_KEY', '');
export const WHATSAPP_PHONE_NUMBER_ID = optionalEnv('WHATSAPP_PHONE_NUMBER_ID', '');
export const WHATSAPP_ACCESS_TOKEN = optionalEnv('WHATSAPP_ACCESS_TOKEN', '');
export const WHATSAPP_ADMIN_NUMBER = optionalEnv('WHATSAPP_ADMIN_NUMBER', '+917357652737');
export const GEMINI_API_KEY = optionalEnv('GEMINI_API_KEY', '');

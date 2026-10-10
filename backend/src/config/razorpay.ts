/**
 * @file razorpay.ts
 * @description Centralized Razorpay client initialization and signature verification utility.
 */

import Razorpay from 'razorpay';
import crypto from 'crypto';
import { env } from './env.js';

export const isRazorpayConfigured = Boolean(env.RAZORPAY_KEY_ID && env.RAZORPAY_KEY_SECRET);

export const razorpayInstance = isRazorpayConfigured
  ? new Razorpay({
      key_id: env.RAZORPAY_KEY_ID!,
      key_secret: env.RAZORPAY_KEY_SECRET!,
    })
  : null;

/**
 * Verify Razorpay HMAC SHA256 payment signature.
 */
export const verifyRazorpaySignature = (
  orderId: string,
  paymentId: string,
  signature: string
): boolean => {
  if (!env.RAZORPAY_KEY_SECRET) return false;
  const generatedSignature = crypto
    .createHmac('sha256', env.RAZORPAY_KEY_SECRET)
    .update(`${orderId}|${paymentId}`)
    .digest('hex');
  return generatedSignature === signature;
};

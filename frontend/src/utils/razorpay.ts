/**
 * @file razorpay.ts
 * @description Razorpay Checkout integration helper for React frontend.
 */

export interface RazorpayCheckoutOptions {
  key: string;
  amount: number; // in paise
  currency?: string;
  name: string;
  description: string;
  order_id: string;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  theme?: {
    color?: string;
  };
  notes?: Record<string, any>;
}

export interface RazorpaySuccessResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

export const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if ((window as any).Razorpay) {
      return resolve(true);
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

/**
 * Triggers the official Razorpay Checkout popup modal and returns the verified payment identifiers.
 */
export const openRazorpayModal = async (
  options: RazorpayCheckoutOptions
): Promise<RazorpaySuccessResponse> => {
  const isLoaded = await loadRazorpayScript();
  if (!isLoaded || !(window as any).Razorpay) {
    throw new Error('Razorpay Checkout SDK failed to load. Please verify your connection.');
  }

  return new Promise((resolve, reject) => {
    const rzp = new (window as any).Razorpay({
      ...options,
      currency: options.currency || 'INR',
      theme: options.theme || { color: '#0284c7' },
      handler: (response: RazorpaySuccessResponse) => {
        resolve(response);
      },
      modal: {
        ondismiss: () => {
          reject(new Error('Checkout cancelled by user.'));
        },
      },
    });

    rzp.on('payment.failed', (response: any) => {
      reject(new Error(response.error?.description || 'Payment transaction failed.'));
    });

    rzp.open();
  });
};

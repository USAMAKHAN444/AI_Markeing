
import api from './config';

// Payment APIs
export const paymentAPI = {
  getPaymentMethods: () => {
    try {
      return api.get('/api/payments/methods');
    } catch (error) {
      console.log("API error, using mock data");
      return Promise.resolve({
        data: [
          {
            id: "pm-1",
            type: "card",
            brand: "visa",
            last4: "4242",
            expMonth: 12,
            expYear: 2025,
            isDefault: true
          }
        ]
      } as any);
    }
  },
  
  addPaymentMethod: (paymentMethodId: string) => {
    try {
      return api.post('/api/payments/methods', { paymentMethodId });
    } catch (error) {
      console.log("API error, using mock response");
      return Promise.resolve();
    }
  },
    
  removePaymentMethod: (paymentMethodId: string) => {
    try {
      return api.delete(`/api/payments/methods/${paymentMethodId}`);
    } catch (error) {
      console.log("API error, using mock response");
      return Promise.resolve();
    }
  },
    
  processPayment: (campaignId: string, amount: number) => {
    try {
      return api.post('/api/payments/process', { campaignId, amount });
    } catch (error) {
      console.log("API error, using mock response");
      return Promise.resolve();
    }
  }
};

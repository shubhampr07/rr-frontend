
interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
  }
  
  export interface Metrics {
    totalCustomers: number;
    customerSuccessRate: {
      referralWelcomePopup: number;
      extension: number;
      referralForm: number;
      whatsappWhitelabeled: number;
      whatsappFollowUps: number;
      emailWhitelabeled: number;
      emailFollowUps: number;
      qualityOffer: number;
      allCustomersCanUseCode: number;
      overall: number;
    };
    successBreakdown: Array<{
      customerId: string;
      customerName: string;
      successRate: number;
    }>;
  }
  

  const API_BASE_URL = import.meta.env.REACT_APP_API_URL || 'https://rr-backend-h3f5.onrender.com/api';
  
  /**
   * Fetches success metrics from the API
   * @returns Promise with the metrics data
   */
  export const getSuccessMetrics = async (): Promise<Metrics> => {
    try {
      const response = await fetch(`${API_BASE_URL}/metrics/success`);
      const data: ApiResponse<Metrics> = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || "Failed to fetch metrics");
      }
      
      return data.data as Metrics;
    } catch (error) {
      console.error("Error fetching metrics:", error);
      throw error;
    }
  };
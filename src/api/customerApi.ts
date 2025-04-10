
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

interface Customer {
  _id: string;
  name: string;
  note: string;
  pointOfContact: {
    name: string;
    email: string[];
    phone: string[];
  }
  offer: {
    discount: string;
    cashback: number;
    allCustomersCanUseCode: boolean;
  };
  touchpoints: {
    referralWelcomePopup: boolean;
    extension: boolean;
    referralForm: boolean;
    whatsapp: {
      whitelabeled: boolean;
      followUps: {
        enabled: boolean;
        followUpDays: number[];
        nudgeCount: number;
        lastNudgeDate: Date;
      };
    };
    email: {
      whitelabeled: boolean;
      followUps: {
        enabled: boolean;
        followUpDays: number[];
        nudgeCount: number;
        lastNudgeDate: Date;
      };
    };
    sms: boolean;
    abandonedCart: {
      email: boolean;
      whatsapp: boolean;
    };
  };
}

const API_BASE_URL = import.meta.env.REACT_APP_API_URL || 'https://rr-backend-h3f5.onrender.com/api';

/**
 * Fetches all customers from the API
 * @returns Promise with the customer data
 */
export const getCustomers = async (): Promise<Customer[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/customers`);
    const data: ApiResponse<Customer[]> = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || "Failed to fetch customers");
    }
    
    return data.data || [];
  } catch (error) {
    console.error("Error fetching customers:", error);
    throw error;
  }
};

/**
 * Saves a note for a specific customer
 * @param customerId - The ID of the customer
 * @param note - The note text to save
 * @returns Promise with the save result
 */
export const saveCustomerNote = async (customerId: string, note: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/customers/notes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      customerId,
      note
    }),
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.error || 'Failed to save note');
  }
  
  return;
};

/**
 * Updates a specific touchpoint for a customer.
 * @param customerId - The ID of the customer.
 * @param touchpointKey - The key of the touchpoint (e.g., "referralWelcomePopup", "extension", etc.).
 * @param newValue - The new boolean value for the touchpoint.
 * @returns Promise that resolves if the update was successful.
 */
export const updateCustomerTouchpoint = async (
  customerId: string,
  touchpointKey: string,
  newValue: boolean
): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/customers/${customerId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        // Dynamically update the right touchpoint key
        [`touchpoints.${touchpointKey}`]: newValue,
      }),
    });
    
    const data: ApiResponse<Customer> = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || "Failed to update touchpoint");
    }
  } catch (error) {
    console.error("Error updating touchpoint:", error);
    throw error;
  }
};
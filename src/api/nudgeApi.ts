

const API_BASE_URL = import.meta.env.REACT_APP_API_URL || 'https://rr-backend-h3f5.onrender.com/api';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface NudgeLog {
  _id: string;
  touchpoint: string;
  channel: string;
  sentAt: string;
  success: boolean;
  errorMessage?: string;
}

/**
 * Sends a nudge to selected contacts.
 *
 * @param customerId 
 * @param touchpoint 
 * @param channel 
 * @param recipients
 */
export const sendNudge = async (
  customerId: string,
  touchpoint: string,
  channel: string,
  recipients: string[]
): Promise<void> => {
  const response = await fetch(
    `${API_BASE_URL}/nudge/${customerId}/${touchpoint}/${channel}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ recipients }),
    }
  );

  const data: ApiResponse<any> = await response.json();
  if (!data.success) {
    throw new Error(data.error || "Failed to send nudge");
  }
};

/**
 * Adds a new email contact for the customer.
 *
 * @param customerId - The customer's id.
 * @param email - The email address to add.
 * @returns A promise that resolves with the contact id.
 */
export const addEmailContact = async (customerId: string, email: string): Promise<string> => {
  const response = await fetch(
    `${API_BASE_URL}/customers/${customerId}/contact/email`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    }
  );

  const data: ApiResponse<{ contactId?: string }> = await response.json();
  if (!data.success) {
    throw new Error(data.error || "Failed to add email contact");
  }
  return data.data?.contactId || `email-${Date.now()}`;
};

/**
 * Adds a new phone contact for the customer.
 *
 * @param customerId - The customer's id.
 * @param phone - The phone number to add.
 * @returns A promise that resolves with the contact id.
 */
export const addPhoneContact = async (customerId: string, phone: string): Promise<string> => {
  const response = await fetch(
    `${API_BASE_URL}/customers/${customerId}/contact/phone`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone }),
    }
  );

  const data: ApiResponse<{ contactId?: string }> = await response.json();
  if (!data.success) {
    throw new Error(data.error || "Failed to add phone contact");
  }
  return data.data?.contactId || `phone-${Date.now()}`;
};

/**
 * Deletes a contact (email or phone) for the customer.
 *
 * @param customerId - The customer's id.
 * @param contactType - Either "email" or "phone".
 * @param contactValue - The value of the contact to delete.
 * @returns A promise that resolves if the deletion was successful.
 */
export const deleteContact = async (
  customerId: string,
  contactType: "email" | "phone",
  contactValue: string
): Promise<void> => {

  const endpoint =
    contactType === "email"
      ? `${API_BASE_URL}/customers/${customerId}/contact/email`
      : `${API_BASE_URL}/customers/${customerId}/contact/phone`;

  const requestBody = contactType === "email"
    ? { emails: [contactValue] }
    : { phones: [contactValue] };

  const response = await fetch(endpoint, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(requestBody),
  });

  const data: ApiResponse<any> = await response.json();
  if (!data.success) {
    throw new Error(data.error || `Failed to delete ${contactType}`);
  }
};

/**
 * Fetches nudge logs for a specific customer.
 *
 * @param customerId - The customer's id.
 * @returns A promise with an array of nudge logs.
 */
export const getNudgeLogs = async (customerId: string): Promise<NudgeLog[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/nudge/logs/${customerId}`);
    const data: ApiResponse<NudgeLog[]> = await response.json();

    if (!data.success) {
      throw new Error(data.error || "Failed to fetch nudge logs");
    }

    return data.data || [];
  } catch (error) {
    console.error("Error fetching nudge logs:", error);
    throw error;
  }
};

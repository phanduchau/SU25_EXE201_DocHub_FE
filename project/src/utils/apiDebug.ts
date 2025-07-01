// src/utils/apiDebug.ts - Debug utilities for API responses

export const logApiResponse = (endpoint: string, response: any) => {
  if (process.env.NODE_ENV === 'development') {
    console.group(`🔍 API Response: ${endpoint}`);
    console.log('Full Response:', response);
    console.log('Response Data:', response?.data);
    console.log('Is Success:', response?.data?.isSuccess);
    console.log('Result:', response?.data?.result);
    console.log('Error Messages:', response?.data?.errorMessages);
    console.groupEnd();
  }
};

export const validatePaymentResponse = (response: any): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!response) {
    errors.push('Response is null or undefined');
    return { isValid: false, errors };
  }

  if (!response.data) {
    errors.push('Response.data is missing');
    return { isValid: false, errors };
  }

  if (!response.data.isSuccess) {
    errors.push(`API returned isSuccess: ${response.data.isSuccess}`);
    if (response.data.errorMessages?.length > 0) {
      errors.push(`Error messages: ${response.data.errorMessages.join(', ')}`);
    }
  }

  if (response.data.isSuccess && !response.data.result) {
    errors.push('API success but result is missing');
  }

  if (response.data.result) {
    const result = response.data.result;
    
    // Validate required fields for VietQR payment response
    const requiredFields = [
      'paymentRequestId',
      'transferCode', 
      'qrCodeUrl',
      'amount',
      'planName',
      'billingCycle',
      'expiresAt',
      'expiresInMinutes',
      'bankAccount'
    ];

    for (const field of requiredFields) {
      if (result[field] === undefined || result[field] === null) {
        errors.push(`Required field '${field}' is missing in result`);
      }
    }

    // Validate bankAccount object
    if (result.bankAccount) {
      const bankRequiredFields = ['accountNo', 'accountName', 'bankCode', 'bankName'];
      for (const field of bankRequiredFields) {
        if (!result.bankAccount[field]) {
          errors.push(`Required bank field '${field}' is missing`);
        }
      }
    }

    // Validate data types
    if (result.paymentRequestId && typeof result.paymentRequestId !== 'number') {
      errors.push('paymentRequestId should be a number');
    }

    if (result.amount && typeof result.amount !== 'number') {
      errors.push('amount should be a number');
    }

    if (result.expiresInMinutes && typeof result.expiresInMinutes !== 'number') {
      errors.push('expiresInMinutes should be a number');
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};


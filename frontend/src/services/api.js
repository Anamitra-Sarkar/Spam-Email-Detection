/**
 * API Service for Spam Email Detection
 * Handles all communication with the FastAPI backend
 */

import axios from 'axios';

// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging
apiClient.interceptors.request.use(
  (config) => {
    console.log(`[API Request] ${config.method.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('[API Request Error]', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    console.log(`[API Response] ${response.config.url} - Status: ${response.status}`);
    return response;
  },
  (error) => {
    console.error('[API Response Error]', error.response?.data || error.message);
    
    // Handle specific error cases
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      
      if (status === 503) {
        throw new Error('Service temporarily unavailable. Model is loading...');
      } else if (status === 400) {
        throw new Error(data.detail || 'Invalid request');
      } else if (status === 500) {
        throw new Error(data.detail || 'Server error occurred');
      }
    } else if (error.request) {
      // Request made but no response received
      throw new Error('Cannot connect to server. Please ensure the backend is running.');
    }
    
    throw error;
  }
);

/**
 * API Service Object
 */
const apiService = {
  /**
   * Health check endpoint
   * @returns {Promise<Object>} Health status
   */
  async checkHealth() {
    try {
      const response = await apiClient.get('/health');
      return response.data;
    } catch (error) {
      console.error('Health check failed:', error);
      throw error;
    }
  },

  /**
   * Predict if a single email is spam
   * @param {string} emailText - The email content to analyze
   * @returns {Promise<Object>} Prediction result
   */
  async predictEmail(emailText) {
    try {
      const response = await apiClient.post('/api/predict', {
        email_text: emailText,
      });
      
      return {
        isSpam: response.data.is_spam,
        prediction: response.data.prediction,
        confidence: response.data.confidence,
        message: response.data.message,
        detectedPatterns: response.data.detected_patterns,
        timestamp: response.data.timestamp,
      };
    } catch (error) {
      console.error('Email prediction failed:', error);
      throw error;
    }
  },

  /**
   * Predict multiple emails in batch
   * @param {string[]} emails - Array of email texts to analyze
   * @returns {Promise<Object>} Batch prediction results
   */
  async predictBatch(emails) {
    try {
      const response = await apiClient.post('/api/predict/batch', {
        emails: emails,
      });
      
      return {
        results: response.data.results.map(result => ({
          isSpam: result.is_spam,
          prediction: result.prediction,
          confidence: result.confidence,
          message: result.message,
          detectedPatterns: result.detected_patterns,
          timestamp: result.timestamp,
        })),
        totalEmails: response.data.total_emails,
        spamCount: response.data.spam_count,
        safeCount: response.data.safe_count,
      };
    } catch (error) {
      console.error('Batch prediction failed:', error);
      throw error;
    }
  },

  /**
   * Process an MBOX file
   * @param {File} file - The MBOX file to process
   * @param {Function} onUploadProgress - Progress callback
   * @returns {Promise<Object>} MBOX processing results
   */
  async processMboxFile(file, onUploadProgress) {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await apiClient.post('/api/predict/mbox', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: onUploadProgress,
      });

      return response.data;
    } catch (error) {
      console.error('MBOX processing failed:', error);
      throw error;
    }
  },

  /**
   * Get API information
   * @returns {Promise<Object>} API info
   */
  async getApiInfo() {
    try {
      const response = await apiClient.get('/');
      return response.data;
    } catch (error) {
      console.error('Failed to get API info:', error);
      throw error;
    }
  },
};

export default apiService;

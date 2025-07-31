// networkApi/Constants.js

// Base URL configuration
const isDevelopment = process.env.NODE_ENV === 'development';
const isLocalhost = typeof window !== 'undefined' && window.location.hostname === 'localhost';

// Multiple environment support
const ENVIRONMENTS = {
  development: "https://pre-backend-ghulambari.worldcitizenconsultants.com/public",
  staging: "https://pre-backend-ghulambari.worldcitizenconsultants.com/public", 
  production: "https://api.gbrmchn.com"
};

// Get current environment
const getCurrentEnvironment = () => {
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return 'development';
    }
    if (hostname.includes('staging') || hostname.includes('pre')) {
      return 'staging';
    }
  }
  return process.env.NODE_ENV === 'production' ? 'production' : 'development';
};

// Base URL selection
const baseURL = ENVIRONMENTS[getCurrentEnvironment()];
// const baseURL = "https://api.gbrmchn.com";
export const apiPrefix = baseURL + "/api";

// Log current configuration
console.log('API Configuration:', {
  environment: getCurrentEnvironment(),
  baseURL,
  apiPrefix,
  isDevelopment,
  isLocalhost
});

// API Endpoints
export const endpoints = {
  // Authentication
  login: apiPrefix + "/login",
  user: apiPrefix + "/user",
  
  // Master Data
  banks: apiPrefix + "/bank",
  seasons: apiPrefix + "/season_summary",
  products: apiPrefix + "/product",
  customers: apiPrefix + "/customer",
  packings: apiPrefix + "/packing",
  suppliers: apiPrefix + "/supplier",
  investors: apiPrefix + "/investor",
  party: apiPrefix + "/party",
  
  // Financial
  expenseCat: apiPrefix + "/expense_category",
  expense: apiPrefix + "/expense",
  paymentIn: apiPrefix + "/payment_in",
  selfPayment: apiPrefix + "/self_payment",
  bankCheque: apiPrefix + "/advance_cheque",
  
  // Inventory
  stocks: apiPrefix + "/product_stock",
  companyProduct: apiPrefix + "/company_product_stock",
  
  // Books
  purchaseBook: apiPrefix + "/purchase_book",
  saleBook: apiPrefix + "/sale_book",
  
  // Ledgers
  partyLedger: apiPrefix + "/party_ledger",
  supplierLedger: apiPrefix + "/supplier_ledger",
  investorLedger: apiPrefix + "/investor_ledger",
  companyLedger: apiPrefix + "/company_ledger",
  
  // Reports
  dashboard: apiPrefix + "/dashboard",
  getAmountReceives: apiPrefix + "/received_party_amount",
  getSupplierPaidAmounts: apiPrefix + "/paid_party_amount",
  debitTrial: apiPrefix + "/dr/api",
  creditTrial: apiPrefix + "/cr/api",
};

// Legacy exports for backward compatibility
export const banks = endpoints.banks;
export const seasons = endpoints.seasons;
export const products = endpoints.products;
export const customers = endpoints.customers;
export const packings = endpoints.packings;
export const expenseCat = endpoints.expenseCat;
export const expense = endpoints.expense;
export const payment_In = endpoints.paymentIn;
export const stocks = endpoints.stocks;
export const suppliers = endpoints.suppliers;
export const investors = endpoints.investors;
export const party = endpoints.party;
export const partyLedger = endpoints.partyLedger;
export const supplierLedger = endpoints.supplierLedger;
export const investorLedger = endpoints.investorLedger;
export const login = endpoints.login;
export const user = endpoints.user;
export const purchaseBook = endpoints.purchaseBook;
export const saleBook = endpoints.saleBook;
export const bankCheque = endpoints.bankCheque;
export const companyLedger = endpoints.companyLedger;
export const dashboard = endpoints.dashboard;
export const getAmountReceives = endpoints.getAmountReceives;
export const getSupplierPaidAmounts = endpoints.getSupplierPaidAmounts;
export const debitTrial = endpoints.debitTrial;
export const creditTrial = endpoints.creditTrial;
export const selfPayment = endpoints.selfPayment;
export const companyProduct = endpoints.companyProduct;

// Utility functions
export const getLocalStorage = (key) => {
  if (typeof window !== "undefined") {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return localStorage.getItem(key); // Return raw string if JSON parsing fails
    }
  }
  return null;
};

export const setLocalStorage = (key, value) => {
  if (typeof window !== "undefined") {
    try {
      const serializedValue = typeof value === 'string' ? value : JSON.stringify(value);
      localStorage.setItem(key, serializedValue);
      return true;
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
      return false;
    }
  }
  return false;
};

export const removeLocalStorage = (key) => {
  if (typeof window !== "undefined") {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
      return false;
    }
  }
  return false;
};

// API Response helpers
export const handleApiResponse = (response) => {
  if (response?.success) {
    return {
      success: true,
      data: response.data,
      message: response.message || 'Success'
    };
  }
  
  throw new Error(response?.message || 'API request failed');
};

export const handleApiError = (error) => {
  console.error('API Error:', error);
  
  return {
    success: false,
    message: error?.response?.data?.message || error?.message || 'An error occurred',
    errors: error?.response?.data?.errors || null,
    status: error?.response?.status || 500
  };
};

// Request interceptor helper
export const createAuthHeaders = () => {
  const token = getLocalStorage('access_token');
  return {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

export default {
  apiPrefix,
  endpoints,
  baseURL,
  getLocalStorage,
  setLocalStorage,
  removeLocalStorage,
  handleApiResponse,
  handleApiError,
  createAuthHeaders
};
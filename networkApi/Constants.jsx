const baseURL = "https://backend-ghulambari.worldcitizenconsultants.com";
const apiPrefix = baseURL + "/api";

export const banks = apiPrefix + "/bank";

export const products = apiPrefix + "/product";

export const customers = apiPrefix + "/customer";

export const packings = apiPrefix + "/packing";

export const expenseCat = apiPrefix + "/expense_category";

export const expense = apiPrefix + "/expense";

export const payment_In = apiPrefix + "/payment_in";

export const stocks = apiPrefix + "/product_stock";

export const suppliers = apiPrefix + "/supplier";

export const buyer = apiPrefix + "/buyer";

export const buyerLedger = apiPrefix + "/buyer_ledger";

export const supplierLedger = apiPrefix + "/supplier_ledger";

export const login = apiPrefix + "/login";

export const purchaseBook = apiPrefix + "/purchase_book";

export const saleBook = apiPrefix + "/sale_book";

export const bankCheque = apiPrefix + "/advance_cheque";

export const companyLedger = apiPrefix + "/company_ledger";

export const dashboard = apiPrefix + "/dashboard";

export const getAmountReceives = apiPrefix + "/received_buyer_amount";

export const getSupplierPaidAmounts = apiPrefix + "/get_supplier_paid_amount";

export const debitTrial = apiPrefix + "/dr/api";

export const creditTrial = apiPrefix + "/cr/api";

export const getLocalStorage = (key) => {
  if (typeof window !== "undefined") {
    return localStorage.getItem(key);
  }
  return null;
};

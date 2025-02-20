// const baseURL = "https://backend-ghulambari.worldcitizenconsultants.com";
const baseURL = "https://pre-backend-ghulambari.worldcitizenconsultants.com/public";
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

export const investors = apiPrefix + "/investor";

export const party = apiPrefix + "/party";

export const partyLedger = apiPrefix + "/party_ledger";

export const supplierLedger = apiPrefix + "/supplier_ledger";

export const investorLedger = apiPrefix + "/investor_ledger";

export const login = apiPrefix + "/login";

export const purchaseBook = apiPrefix + "/purchase_book";

export const saleBook = apiPrefix + "/sale_book";

export const bankCheque = apiPrefix + "/advance_cheque";

export const companyLedger = apiPrefix + "/company_ledger";

export const dashboard = apiPrefix + "/dashboard";

export const getAmountReceives = apiPrefix + "/received_party_amount";

export const getSupplierPaidAmounts = apiPrefix + "/paid_party_amount";

export const debitTrial = apiPrefix + "/dr/api";

export const creditTrial = apiPrefix + "/cr/api";

export const selfPayment = apiPrefix + "/self_payment";

export const getLocalStorage = (key) => {
  if (typeof window !== "undefined") {
    return localStorage.getItem(key);
  }
  return null;
};

const baseURL = "https://petscontrol.accuratesap.com/admin/public";
const apiPrefix = baseURL + "/api";

export const login = apiPrefix + "/login";
export const getCountriesURL = apiPrefix + "/get_countries";
export const addSupplier = apiPrefix + "/add-supplier";
export const getAllSuppliers = apiPrefix + "/get_suppliers";
export const getAllBrandNames = apiPrefix + "/get_brands";
export const addBrand = apiPrefix + "/add-brand";

// Add Client
export const addClient = apiPrefix + "/add-client";

// Add address
export const addAddress = apiPrefix + "/add_client_addressess";

// add employee
export const addEmployee = apiPrefix + "/add-employee";

export const getServiceAgreements = apiPrefix + "/get_services";

export const addServiceAgreements = apiPrefix + "/add-agreement";

export const addVendor = apiPrefix + "/add-vendor";

export const getVendorsUrl = apiPrefix + "/get_vendors";

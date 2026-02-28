import { APIClient, setAuthorization, setRequestMeta } from './api_helper';
import { LeadSourceAPIClient, setLeadSourceAuth } from './leadsource_api_helper';
import * as url from './url_helpers/index';
import * as lsUrl from './url_helpers/leadsource';

const api = new APIClient();
const leadsourceApi = new LeadSourceAPIClient();
// Gets the logged in user data from local session

const authToken = localStorage.getItem('authToken');
if (authToken) {
  setAuthorization(authToken);
} else {
  setRequestMeta();
}

// Gets the logged in user data from local session
export const getLoggedInUser = () => {
  const user = localStorage.getItem('user');
  if (user) return JSON.parse(user);
  return null;
};

// //is user is logged in
export const isUserAuthenticated = () => {
  return getLoggedInUser() !== null;
};

//Login
export const getUserRnP = (data) => api.create(url.GET_USER_RNP, data);

//Login
export const getUserProfile = (data) => api.get(url.GET_USER_PROFILE, data);

//Consent
export const getUserConsent = () => api.get(url.NOTICE_CONSENT_STATUS, {});

//Consent
export const registerUserConsent = () => api.create(url.NOTICE_CONSENT_STATUS, {});

//Login
export const getUserSecretToken = (data) => api.create(url.GET_USER_STOKEN, data);

//Login
export const postLogin = (data) => api.create(url.NEW_LOGIN, data);

//Login
export const postLogout = (data) => api.create(url.NEW_LOGOUT, data);

//Verification
export const postVerification = (data) => api.create(url.POST_VERIFICATION, data);

//UpdateAccoutn
export const postUpdateAccount = (data) => api.create(url.UPDATE_ACCOUNT, data);

//Register
export const postRegister = (data) => api.create(url.POST_REGISTER, data);

//Register
export const getCurrencyList = (data) => api.get(url.GET_CURRENCY, data);

//Forgot Password
export const postForgotPass = (data) => api.create(url.POST_FORGOT_PASS, data);

//Reset Password
export const postResetPass = (data) => api.create(url.RESET_PASSWORD, data);

//Get WABA List
export const getWabaList = (data) => api.create(url.GET_WABA_LIST, data);

//Get WABA List
export const getWabaStat = (data) => api.create(url.GET_WABA_STAT, data);

//Get Single WABA
export const getSingleWaba = (data) => api.create(url.GET_SINGLE_WABA, data);

//Get WABA Webhook
export const getWabaWebhook = (data) => api.create(url.GET_WABA_WEBHOOK, data);

//Post WABA Webhook
export const postWabaWebhook = (data) => api.create(url.POST_WABA_WEBHOOK, data);

//Update WABA Webhook
export const updateWabaWebhook = (data) => api.create(url.UPDATE_WABA_WEBHOOK, data);

//Delete WABA Webhook
export const deleteWabaWebhook = (data) => api.create(url.DELETE_WABA_WEBHOOK, data);

//Get WABA Conversation
export const getWabaConversation = (data) => api.create(url.GET_WABA_CONVERSATION, data);

//Get WABA Conversation
export const getWabaTemplates = (data) => api.create(url.GET_WABA_TEMPLATES, data);

//Get WABA Conversation
export const postWabaTemplate = (data) => api.create(url.POST_WABA_TEMPLATE, data);

//Get WABA Conversation
export const getWabaCompliance = (data) => api.create(url.GET_WABA_COMPLIANCE, data);

//Get WABA Conversation
export const postWabaCompliance = (data) => api.create(url.POST_WABA_COMPLIANCE, data);

//Delete WABA Template
export const deleteWabaTemplate = (data) => api.create(url.DELETE_WABA_TEMPLATE, data);

//Get WABA Profile
export const getWabaProfile = (data) => api.create(url.GET_WABA_PROFILE, data);

//Get WABA About
export const getWabaAbout = (data) => api.create(url.GET_WABA_PROFILE_ABOUT, data);

//Get WABA Image
export const getWabaProfileImage = (data) => api.create(url.GET_WABA_PROFILE_IMAGE, data);

//Post WABA Image
export const postWabaProfile = (data) => api.create(url.POST_WABA_PROFILE, data);

//Post WABA Image
export const postWabaAbout = (data) => api.create(url.POST_WABA_PROFILE_ABOUT, data);

//Post WABA Image
export const postWabaProfileImage = (data) => api.create(url.POST_WABA_PROFILE_IMAGE, data);

//GET Redeem History
export const getRedeemHistory = (data) => api.create(url.GET_REDEEM_HISTORY, data);

//Redeem New Key
export const postRedeemKey = (data) => api.create(url.POST_REDEEM_KEY, data);

//Rename WABA
export const postWabaRename = (data) => api.create(url.POST_WABA_RENAME, data);

//Validate WABA BSP API Key
export const postWabaValidateBspKey = (data) => api.create(url.POST_WABA_VALIDATE_BSP_KEY, data);

//Update WABA BSP API Key
export const postWabaUpdateBspKey = (data) => api.create(url.POST_WABA_UPDATE_BSP_KEY, data);

//Update WABA Add Balance
export const postWabaAddBalance = (data) => api.create(url.POST_WABA_ADD_BALANCE, data);

//Update WABA Add Balance
export const postWabaAgencyMargin = (data) => api.create(url.POST_WABA_AGENCY_MARGIN, data);

//Update WABA
export const postWabaUpdateBillingVisibility = (data) => api.create(url.POST_WABA_UPDATE_BILLING_VISIBILITY, data);

//Update WABA Share
export const postWabaShare = (data) => api.create(url.POST_WABA_SHARE, data);

//Update WABA Share
export const postWabaRevoke = (data) => api.create(url.POST_WABA_REVOKE, data);

//Update WABA Share
export const postWabaRegenApikey = (data) => api.create(url.POST_WABA_REGEN_APIKEY, data);

//Update WABA Share
export const postWabaResetWebhook = (data) => api.create(url.POST_WABA_RESET_WEBHOOK, data);

//Clear WABA Connection
export const clearWabaConnection = (data) => api.create(url.CLEAR_WABA_CONNECTION, data);

//Clear WABA Connection
export const deregisterWaba = (data) => api.create(url.DEREGSITER_WABA, data);

//Update WABA Share
export const getPanelSettings = (data) => api.create(url.GET_PANEL_SETTINGS, data);

//Update WABA Share
export const postPanelSettings = (data) => api.create(url.POST_PANEL_SETTINGS, data);

//Update WABA Share
export const getThemeSettings = (data) => api.create(url.GET_THEME_SETTINGS, data);

//Update WABA Share
export const postThemeSettings = (data) => api.create(url.POST_THEME_SETTINGS, data);

//Update WABA Share
export const getConversationReport = (data) => api.create(url.GET_CONVERSATION_REPORT, data);

//Update WABA Share
export const postTestEmail = (data) => api.create(url.POST_TEST_EMAIL, data);

//Get User List
export const getUserList = (data) => api.create(url.GET_USER_LIST, data);

//Get WABA Conversation
export const fetchWabaCommerceSettings = (data) => api.create(url.FETCH_COMMERCE_SETTING, data);
export const postWabaCommerceSettings = (data) => api.create(url.POST_COMMERCE_SETTING, data);

//Workspace User Role API Call Function Start Here

export const getUserRoles = (data) => api.create(url.GET_USER_ROLES, data);

export const postUserRoles = (data) => api.create(url.POST_USER_ROLES, data);

export const updateUserRoles = (data) => api.update(url.UPDATE_USER_ROLES, data);

export const deleteUserRoles = (data) => api.delete(url.DELETE_USER_ROLES + '/' + data);

//Workspace User Role API Call Function End Here
//------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------

//------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------
//Workspace Panel User API Call Function Start Here

export const getPanelUser = (data) => api.create(url.GET_PANEL_USER, data);

export const exportPanelUser = (data) => api.create(url.EXPORT_PANEL_USER, data);

export const loginAs = (data) => api.create(url.LOGIN_AS, data);

//Workspace Panel User API Call Function End Here
//------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------

//------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------
//CRM Subscription API Call Function Start Here

export const getSubChannel = (data) => api.create(url.GET_SUBS_CHANNEL, data);

export const getSubChannelChild = (data) => api.create(url.GET_SUBS_CHANNEL_CHILD, data);

export const shareSubChannel = (data) => api.update(url.SHARE_SUBS_CHANNEL, data);

export const addSubChannel = (data) => api.update(url.ADD_SUBS_CHANNEL, data);

export const revokeSubChannel = (data) => api.create(url.REVOKE_SUBS_CHANNEL, data);

export const getSubCustomer = (data) => api.create(url.GET_SUBS_CUSTOMER, data);

export const getSubCustomerChild = (data) => api.create(url.GET_SUBS_CUSTOMER_CHILD, data);

export const shareSubCustomer = (data) => api.update(url.SHARE_SUBS_CUSTOMER, data);

export const addSubCustomer = (data) => api.create(url.ADD_SUBS_CUSTOMER, data);

export const revokeSubCustomer = (data) => api.create(url.REVOKE_SUBS_CUSTOMER, data);

export const getSubCO = (data) => api.create(url.GET_SUBS_CO, data);

export const getSubCOChild = (data) => api.create(url.GET_SUBS_CO_CHILD, data);

export const shareSubCO = (data) => api.update(url.SHARE_SUBS_CO, data);

export const addSubCO = (data) => api.create(url.ADD_SUBS_CO, data);

export const revokeSubCO = (data) => api.create(url.REVOKE_SUBS_CO, data);

export const getSubAccount = (data) => api.create(url.GET_AGENCY_SUBACCOUNT, data);

//CRM Subscription Team Member API Call Function End Here

export const getWalletBalance = (data) => api.get(url.WALLET_BALANCE, data);
export const getWalletLog = (data) => api.get(url.WALLET_LOG, data);
export const listPlan = (data) => api.get(url.PLAN, data);
export const listPlanWaba = (data) => api.get(url.GET_PLAN_WABA, data);
export const listAddon = (data) => api.get(url.ADD_ON, data);
export const getPamentLink = (data) => api.get(url.PAYMENT_LINK, data);
export const activePlan = (data) => api.get(url.ACTIVE_PLAN, data);
export const subscribePlan = (data) => api.create(url.SUBSCRIBE_PLAN, data);
export const autoRenewPlan = (data) => api.create(url.RENEW_PLAN, data);
export const subscribeAddon = (data) => api.create(url.ADD_ON, data);

export const getPanelMenu = (data) => api.get(data.url, {});

//DIG
export const createImageExp = (data) => api.create(url.IMAGE_EXP, data);
export const fetchImageExp = (data) => api.get(`${url.IMAGE_EXP}/${data.image}`, {});
export const listImageExp = (data) => api.get(url.IMAGE_EXP, data);
export const updateImageExp = (data) => api.update(`${url.IMAGE_EXP}/${data.image}`, data.update);
export const deleteImageExp = (data) => api.delete(`${url.IMAGE_EXP}/${data.image}`, data);

//pdf
export const createPdfExp = (data) => api.create(url.PDF_EXP, data);
export const fetchPdfExp = (data) => api.get(`${url.PDF_EXP}/${data.pdf}`, {});
export const listPdfExp = (data) => api.get(url.PDF_EXP, data);
export const updatePdfExp = (data) => api.update(`${url.PDF_EXP}/${data.pdf}`, data.update);
export const deletePdfExp = (data) => api.delete(`${url.PDF_EXP}/${data.pdf}`, data);

export const fetchPdfCredit = (data) => api.get(url.PDF_CREDIT, data);

export const generateApiKey = (data) => api.create(url.API_KEY_GENERATE, data);
export const getApiKey = (data) => api.create(url.API_KEY_GET, data);

export const getStorageCreds = (data) => api.get(url.API_STORAGE_GET, data);
export const createStorageCreds = (data) => api.create(url.API_STORAGE_GET, data);


export const getStorageFiles = (data) => api.get(url.STORAGE_FILES, data);
// export const getStorageFilesByPath = (data) => api.get(url.STORAGE_FILES_BY_PATH, data);
// export const getStorageStats = (data) => api.get(url.STORAGE_STATS, data);
export const deleteStorageFile = (data) => api.delete(`${url.STORAGE_FILE_DELETE}/${data.file_id}`, data);
export const bulkDeleteStorageFiles = (data) => api.create(url.STORAGE_BULK_DELETE, data);

export const getCreditHistory = (data) => api.get(url.CREDIT_HISTORY, data);

export const getWalletCoinBalance = (data) => api.get(url.DIG_WALLET_BALANCE, data);
export const purchaseCreditsWithCoins = (data) => api.create(url.DIG_WALLET_PURCHASE, data);

// Lead Source
setLeadSourceAuth('a869bd5a-01b1-40a9-9862-8ea3c28f501b', '69959f58b78f675bcd3f7f66');
export const listConnections = (data) => leadsourceApi.get(lsUrl.LEAD_CONNECTIONS, data);

// === voice agent===
// export const createVoiceConfig = (data) => api.create(url.VOICE_CONFIG, data);
// export const fetchVoiceConfig = (data) => api.get(`${url.VOICE_CONFIG}/${data.id}`, {});
// export const listVoiceConfigs = (data) => api.get(url.VOICE_CONFIGS, data);
// export const updateVoiceConfig = (data) => api.update(`${url.VOICE_CONFIG}/${data.id}`, data.update);
// export const deleteVoiceConfig = (data) => api.delete(`${url.VOICE_CONFIG}/${data.id}`, data);
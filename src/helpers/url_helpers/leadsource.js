export const LEADSOURCE_BASE_URL = 'https://mapi.1automations.com/api/lead-source';

// Lead Source APIs
export const LEAD_CONNECTIONS = '/api/auth/connections';
export const DELETE_CONNECTION = '/api/auth/facebook';
export const SAVE_CONNECTION = '/api/auth/facebook/save-selection';
export const FACEBOOK_PAGES = '/api/auth/facebook/pages-by-connection';
export const FACEBOOK_FORMS = '/api/auth/facebook/forms';
export const WEBHOOK_GET_ALL = '/api/auth/webhook';
export const WEBHOOK_CREATE = '/api/auth/webhook/create';
export const WEBHOOK_EDIT = '/api/auth/webhook/edit';
export const WEBHOOK_DELETE = '/api/auth/webhook/delete';
export const WEBHOOK_LOGS = '/webhook/logs';
// IndiaMART APIs
export const INDIAMART_CONNECT = '/api/auth/indiamart/connect';
export const INDIAMART_CONNECT_UPDATE = '/api/auth/indiamart/connection';
export const INDIAMART_CONNECTION = '/api/auth/indiamart/connection';
export const INDIAMART_DELETE = '/api/auth/indiamart';
export const INDIAMART_PULL_LEADS = '/api/auth/indiamart/pull-leads?secret=4abbfe3a-f598-404c-8447-f57639f15a40';
export const INDIAMART_GET_FIELD_LIST = '/api/auth/indiamart/get-field-list';

// Zoho CRM APIs
export const ZOHO_CONNECT = '/api/auth/zoho/connect';
export const ZOHO_CONNECTION = '/api/auth/zoho/connection';
export const ZOHO_DELETE = '/api/auth/zoho';
export const ZOHO_GET_FIELD_LIST = '/api/auth/zoho/get-field-list';
export const ZOHO_REGIONS = '/api/auth/zoho/regions';
export const ZOHO_PULL_LEADS = '/api/auth/zoho/pull-leads?secret=3d7624da-131c-4406-87c0-0b70a907b598';

// Generic Webhook APIs
export const GENERIC_WEBHOOK_CONNECT = '/api/auth/generic_webhook/connect';
export const GENERIC_WEBHOOK_CONNECTION = '/api/auth/generic_webhook/connection';
export const GENERIC_WEBHOOK_DELETE = '/api/auth/generic_webhook';
export const GENERIC_WEBHOOK_GET_FIELD_LIST = '/api/auth/generic_webhook/get-field-list';

// Phone Contact APIs
export const PHONE_CONTACT_CONNECT = '/api/auth/call_connect/connect';
export const PHONE_CONTACT_CONNECTION = '/api/auth/call_connect/connection';
export const PHONE_CONTACT_DELETE = '/api/auth/call_connect';
export const PHONE_CONTACT_GET_FIELD_LIST = '/api/auth/call_connect/get-field-list';
export const PHONE_CONTACT_UPLOAD_URL = '/api/auth/call_connect/upload-url';
export const PHONE_CONTACT_PROCESS_FILE = '/api/auth/call_connect/process-file';
export const PHONE_CONTACT_UPLOAD_JSON = '/api/auth/call_connect/upload-json';

// Contact Book APIs
export const CONTACT_BOOK_CONNECT = '/api/auth/contact_book/connect';
export const CONTACT_BOOK_CONNECTION = '/api/auth/contact_book/connection';
export const CONTACT_BOOK_DELETE = '/api/auth/contact_book';
export const CONTACT_BOOK_GET_FIELD_LIST = '/api/auth/contact_book/get-field-list';
export const CONTACT_BOOK_UPLOAD_URL = '/api/auth/contact_book/upload-url';
export const CONTACT_BOOK_PROCESS_FILE = '/api/auth/contact_book/process-file';
export const CONTACT_BOOK_UPLOAD_JSON = '/api/auth/contact_book/upload-json';

// OCR App APIs
export const OCR_APP_CONNECT = '/api/auth/ocr_app/connect';
export const OCR_APP_CONNECTION = '/api/auth/ocr_app/connection';
export const OCR_APP_GET_FIELD_LIST = '/api/auth/ocr_app/get-field-list';
export const OCR_APP_DELETE = '/api/auth/ocr_app';

// JotForm APIs
export const JOTFORM_CONNECT = '/api/auth/jotform/connect';
export const JOTFORM_CONNECTION = '/api/auth/jotform/connection';
export const JOTFORM_GET_FIELD_LIST = '/api/auth/jotform/get-field-list';
export const JOTFORM_DELETE = '/api/auth/jotform';

// Contact Form 7 APIs
export const CONTACT_FORM_7_CONNECT = '/api/auth/contactform7/connect';
export const CONTACT_FORM_7_CONNECTION = '/api/auth/contactform7/connection';
export const CONTACT_FORM_7_GET_FIELD_LIST = '/api/auth/contactform7/get-field-list';
export const CONTACT_FORM_7_DELETE = '/api/auth/contactform7';

// Google Forms APIs
export const GOOGLE_FORMS_CONNECT = '/api/auth/google_forms/connect';
export const GOOGLE_FORMS_CONNECTION = '/api/auth/google_forms/connection';
export const GOOGLE_FORMS_GET_FIELD_LIST = '/api/auth/google_forms/get-field-list';
export const GOOGLE_FORMS_APPS_SCRIPT = '/api/auth/google_forms/apps-script';
export const GOOGLE_FORMS_DELETE = '/api/auth/google_forms';

// Typeform APIs
export const TYPEFORM_CONNECT = '/api/auth/typeform/connect';
export const TYPEFORM_CALLBACK = '/api/auth/typeform/callback';
export const TYPEFORM_FORMS = '/api/auth/typeform/forms';
export const TYPEFORM_SAVE_SELECTION = '/api/auth/typeform/save-selection';
export const TYPEFORM_CONNECTION = '/api/auth/typeform/connection';
export const TYPEFORM_GET_FIELD_LIST = '/api/auth/typeform/get-field-list';
export const TYPEFORM_DELETE = '/api/auth/typeform';
export const TYPEFORM_WEBHOOK_CONNECT = '/api/auth/typeform/webhook-connect';

// HubSpot CRM APIs
export const HUBSPOT_CONNECTION = '/api/auth/hubspot/connection';
export const HUBSPOT_FORMS = '/api/auth/hubspot/forms';
export const HUBSPOT_SAVE_SELECTION = '/api/auth/hubspot/save-selection';
export const HUBSPOT_GET_FIELD_LIST = '/api/auth/hubspot/get-field-list';
export const HUBSPOT_DELETE = '/api/auth/hubspot';

// Analytics APIs
export const ANALYTICS_LEADS_BY_SOURCE = '/api/analytics/leads-by-source';

export const CRM_FIELDS = 'https://mapi.1automations.com/api/v2/crm/fields';
export const FIELD_MAPPING = '/api/auth/field-mapping';
export const FIELD_MAPPING_UPSERT = '/api/auth/field-mapping/upsert';
export const SESSION_TOKEN = '/api/auth/generate-session';

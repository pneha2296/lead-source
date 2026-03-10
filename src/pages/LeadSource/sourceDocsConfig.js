/**
 * Centralized documentation config for all lead sources.
 *
 * Each key matches a source's `key` from allSources.
 * Each entry contains:
 *   - title:       Guide heading
 *   - description: Brief overview
 *   - videoUrl:    (optional) YouTube embed URL
 *   - steps:       Array of { title, description, image?, tip? }
 *   - features:    Array of feature strings shown at the bottom
 *
 * Images: Use relative paths from /assets/docs/ or full URLs.
 *         Set image to null if not yet available — the step renders without it.
 *
 * To add docs for a new source, add a new key here. No component changes needed.
 */
const SOURCE_DOCS = {
  facebookLeadAds: {
    title: 'Facebook Lead Ads',
    description: 'Connect your Facebook account to automatically capture leads from your Facebook Lead Ad forms.',
    videoUrl: null,
    steps: [
      {
        title: 'Click "Create Connection"',
        description: 'Go to Lead Sources, find Facebook Lead Ads and click the Create Connection button. A connect modal will open.',
        image: '/leadsource/assets/leadsource/fb_connect.png',
      },
      {
        title: 'Connect with Facebook',
        description: 'Click "Connect with Facebook" and authorize the app. Grant permissions to access your pages and lead forms.',
        image: '/leadsource/assets/leadsource/fb_connect_with.png',
      },
      {
        title: 'Select Page & Form',
        description: 'After connecting, open Configure to choose the Facebook Page and the Lead Form you want to capture leads from.',
        image: '/leadsource/assets/leadsource/fb_select_page_form.png',
      },
      {
        title: 'Set Up Field Mapping',
        description: 'Map your Facebook form fields to your CRM fields. This ensures leads are stored with the correct data in each field.',
        image: '/leadsource/assets/leadsource/fb_field_mapping.png',
      },
      {
        title: 'Add Webhook (Optional)',
        description: 'Attach a webhook to receive real-time notifications when a new lead arrives. Configure the webhook URL and events.',
        image: '/leadsource/assets/leadsource/fb_webhook.png',
      },
      {
        title: 'View Logs & Monitor',
        description: 'Use the Logs section to track incoming leads, view sync history, and debug any issues.',
        image: '/leadsource/assets/leadsource/fb_logs.png',
      },
    ],
    features: [
      'Auto-capture leads from Facebook Lead Ad forms',
      'Map Facebook form fields to CRM fields',
      'Real-time webhook notifications',
      'View detailed sync logs',
      'Configure multiple pages and forms',
    ],
  },

  indiaMart: {
    title: 'IndiaMART',
    description: 'Connect your IndiaMART seller account to automatically pull enquiry leads into your CRM.',
    videoUrl: null,
    steps: [
      {
        title: 'Get Your CRM Key',
        description: 'Log in to your IndiaMART Seller Dashboard. Navigate to CRM Settings and copy your CRM Key.',
        image: null,
        tip: 'The CRM Key is found under Lead Manager > CRM Settings in your IndiaMART dashboard.',
      },
      {
        title: 'Create Connection',
        description: 'Click "Create Connection" on the IndiaMART source card. Enter your Account Name and CRM Key.',
        image: ['/leadsource/assets/leadsource/indiamart_create_connection.png', '/leadsource/assets/leadsource/indiamart_connect.png'],
      },
      {
        title: 'Edit Configuration',
        description: 'Review and adjust the configuration settings as needed.',
        image: '/leadsource/assets/leadsource/indiamart_edit_config.png',
      },
      {
        title: 'Configure Field Mapping',
        description: 'Map IndiaMART lead fields (name, phone, email, city, product, etc.) to your CRM fields for proper data storage.',
        image: '/leadsource/assets/leadsource/indiamart_field_mapping.png',
      },
      {
        title: 'Sync Leads',
        description: 'Click the Sync Leads button to manually pull leads, or wait for the automated cron schedule to fetch them periodically.',
        image: '/leadsource/assets/leadsource/indiamart_sync_manual.png',
      },
      {
        title: 'Add Webhook & View Logs',
        description: 'Optionally attach a webhook for real-time alerts. Use the Logs section to monitor all imported leads.',
        image: ['/leadsource/assets/leadsource/indiamart_webhook.png', '/leadsource/assets/leadsource/indiamart_logs.png'],
      },
    ],
    features: [
      'Auto-pull leads from IndiaMART enquiries',
      'Historical lead import (up to 365 days)',
      'Manual sync with one-click',
      'Automated periodic sync via cron',
      'Map IndiaMART fields to CRM fields',
    ],
  },

  zohoCrm: {
    title: 'Zoho CRM',
    description: 'Connect your Zoho CRM account via OAuth to sync leads between Zoho and your CRM.',
    videoUrl: null,
    steps: [
      {
        title: 'Click "Create Connection"',
        description: 'Find the Zoho CRM card in Lead Sources and click the "Create Connection" button to begin the setup process.',
        image: '/leadsource/assets/leadsource/zoho_connect.png',
      },
      {
        title: 'Select Region & Connect',
        description: 'Choose your Data Center Region (e.g. India, US, EU), enter a friendly Account Name, and click "Connect with Zoho CRM". A popup window will open for Zoho authentication.',
        image: '/leadsource/assets/leadsource/zoho_connect_with.png',
        tip: 'Select the region where your Zoho account is hosted. The popup will close automatically after successful authorization.',
      },
      {
        title: 'Authorize the Application',
        description: 'In the Zoho popup, review the permissions requested (manage leads data, retrieve user data, CRUD operations on modules). Check the consent checkbox and click "Accept" to authorize.',
        image: '/leadsource/assets/leadsource/zoho_authorized.png',
        tip: 'Make sure to check "I allow COM.BOT to access the above data from my Zoho account" before clicking Accept.',
      },
      {
        title: 'Set Up Field Mapping',
        description: 'Open Field Mapping to map your CRM fields to Zoho form fields. Use the dropdown to select the matching Zoho field for each CRM field. Toggle "Auto-create Contact" to automatically create a CRM contact when a new lead arrives. Click "Save Mappings" when done.',
        image: '/leadsource/assets/leadsource/zoho_fieldmapping.png',
      },
      {
        title: 'Sync Leads',
        description: 'Once connected, your Zoho account details (name, email) will appear on the connection card. Click the Sync Leads button to manually pull leads from Zoho on demand, or let the automated schedule handle it.',
        image: '/leadsource/assets/leadsource/zoho_sync.png',
      },
      {
        title: 'Add Webhooks',
        description: 'Navigate to Webhooks to add webhook URLs that receive real-time notifications when new leads arrive. Enter your endpoint URL and click "+ Add". You can add multiple webhooks and manage them with edit or delete options.',
        image: '/leadsource/assets/leadsource/zoho_webhooks.png',
      },
      {
        title: 'View Logs',
        description: 'Use the Logs section to monitor all imported leads. Each log entry shows the source, status, Leadgen ID, full payload data, and the sync date. This helps you verify leads are syncing correctly and debug any issues.',
        image: '/leadsource/assets/leadsource/zoho_logs.png',
      },
    ],
    features: [
      'Secure OAuth 2.0 connection',
      'Auto-refresh tokens',
      'Pull leads from Zoho CRM modules',
      'Map Zoho fields to CRM fields',
      'Automated periodic sync',
      'Real-time webhook support',
    ],
  },
  webhooks: {
    title: 'Custom Webhook',
    description: 'Create a custom inbound webhook URL to receive leads from any external source — Google Sheets, Zapier, custom apps, or any system that can send HTTP POST requests.',
    videoUrl: null,
    steps: [
      {
        title: 'Create a Webhook Connection',
        description: 'Find the Webhook card in Lead Sources and click "Create Connection". Enter a name for your connection and optionally specify a type (e.g. googlesheet, zapier).',
        image: '/leadsource/assets/leadsource/webhook_connect.png',
      },
      {
        title: 'Copy Your Webhook URL',
        description: 'After creation, you\'ll receive a unique inbound webhook URL. Copy this URL — you\'ll use it to send lead data from your external source.',
        image: '/leadsource/assets/leadsource/webhook_create.png',
        tip: 'Keep your webhook URL private. Anyone with the URL can send leads to your account.',
      },
      {
        title: 'Send Leads via POST Request',
        description: 'Send a POST request with JSON body containing lead data (name, email, phone, etc.) to your webhook URL. The system will automatically save the lead.',
        image: '/leadsource/assets/leadsource/webhook_configure.png',
        tip: 'Set Content-Type header to application/json when sending requests.',
      },
      {
        title: 'Set Up Field Mapping',
        description: 'Open Field Mapping to map the incoming webhook fields to your CRM fields. This ensures each lead field is stored correctly in your CRM.',
        image: '/leadsource/assets/leadsource/webhook_field_mapping.png',
      },
      {
        title: 'Add Outbound Webhooks',
        description: 'Optionally configure outbound webhooks to forward incoming leads to other systems in real-time. Navigate to the Webhooks section on your connection card.',
        image: '/leadsource/assets/leadsource/webhook_webhooks.png',
      },
      {
        title: 'View Logs',
        description: 'Use the Logs section to monitor all received leads. Each log entry shows the status, payload data, and timestamp for debugging.',
        image: '/leadsource/assets/leadsource/webhook_logs.png',
      },
    ],
    features: [
      'Unique inbound webhook URL per connection',
      'Accept leads from any HTTP POST source',
      'Auto-save leads and create CRM contacts',
      'Forward to outbound webhooks in real-time',
      'Map incoming fields to CRM fields',
      'Detailed logs for monitoring and debugging',
    ],
  },
  typeform: {
    title: 'Typeform',
    description: 'Connect Typeform to capture form responses as leads. Two methods available: OAuth (automatic) or Custom Webhook (manual setup via Typeform settings).',
    videoUrl: null,
    steps: [
      {
        title: 'Click "Create Connection"',
        description: 'Find the Typeform card in Lead Sources and click "Create Connection". A popup window will open for Typeform OAuth authentication.',
        image: '/leadsource/assets/leadsource/typeform_connect.png',
      },
      {
        title: 'Authorize the Application (OAuth)',
        description: 'In the Typeform popup, review the permissions requested and click "Allow" to authorize the app. The popup will close automatically after successful authorization.',
        image: '/leadsource/assets/leadsource/typeform_oauth.png',
        tip: 'Make sure you are logged in to the correct Typeform account before authorizing.',
      },
      {
        title: 'Select a Form',
        description: 'Open Configure on your connection card. Choose the Typeform form you want to capture responses from using the dropdown, then click "Save Selection". A webhook is automatically registered on the selected form.',
        image: '/leadsource/assets/leadsource/typeform_select_form.png',
        tip: 'A webhook is automatically registered on the selected form to receive real-time responses.',
      },
      {
        title: 'Set Up Field Mapping',
        description: 'Open Field Mapping to map your Typeform form fields to your CRM fields. This ensures each response field (name, email, phone, etc.) is stored correctly in the right CRM field.',
        image: '/leadsource/assets/leadsource/typeform_fieldmapping.png',
      },
      {
        title: 'Add Outbound Webhooks (Optional)',
        description: 'Navigate to Webhooks to add additional outbound webhook URLs that receive real-time notifications when new Typeform responses arrive.',
        image: '/leadsource/assets/leadsource/typeform_webhook.png',
      },
      {
        title: 'View Logs & Monitor',
        description: 'Use the Logs section to monitor all captured responses. Each log entry shows the source, status, payload data, and timestamp for easy debugging.',
        image: '/leadsource/assets/leadsource/typeform_logs.png',
      },
    ],
    features: [
      'Two connection methods: OAuth or Custom Webhook',
      'Secure OAuth 2.0 connection with Typeform',
      'Auto-register webhook on selected form (OAuth)',
      'Manual webhook setup via Typeform settings (Custom)',
      'Capture form responses in real-time',
      'Map Typeform fields to CRM fields',
      'Auto-cleanup webhook on disconnection',
      'Detailed response logs for monitoring',
    ],
  },
  phoneContact: {
    title: 'Phone Contact',
    description: 'Import contacts from your phone by uploading a VCF/vCard file or syncing directly via JSON from your mobile app.',
    videoUrl: null,
    steps: [
      {
        title: 'Create a Connection',
        description: 'Find the Phone Contact card in Lead Sources and click "Create Connection". Enter a name for your connection (e.g. "My Phone Contacts").',
        image: '/leadsource/assets/leadsource/phone_connect.png',
      },
      {
        title: 'Export Contacts from Phone',
        description: 'On your phone, go to Contacts and export all contacts as a .vcf (vCard) file. On Android: Contacts > Settings > Export. On iPhone: use iCloud or a contacts export app.',
        image: '/leadsource/assets/leadsource/phone_export.png',
        tip: 'Most phones support exporting all contacts as a single .vcf file. Check your phone\'s Contacts settings.',
      },
      {
        title: 'Upload VCF File',
        description: 'Open Configure on your connection card, select the "Upload VCF File" tab, choose your .vcf file, and click "Upload & Import". The system will parse and import all contacts automatically.',
        image: '/leadsource/assets/leadsource/phone_upload.png',
      },
      {
        title: 'Or Sync via JSON (Mobile App)',
        description: 'For mobile app integrations, switch to the "JSON Sync" tab and paste a JSON array of contacts, or use the API endpoint to POST contacts directly from your app.',
        image: '/leadsource/assets/leadsource/phone_json.png',
        tip: 'Use the upload-json API endpoint for automated syncing from mobile apps.',
      },
      {
        title: 'Set Up Field Mapping',
        description: 'Open Field Mapping to map phone contact fields (name, phone, email) to your CRM fields. Toggle "Auto-create Contact" to automatically create CRM contacts for each imported lead.',
        image: '/leadsource/assets/leadsource/phone_field_mapping.png',
      },
      {
        title: 'View Logs',
        description: 'Use the Logs section to monitor all imported contacts. Each log entry shows the status, payload data, and import timestamp.',
        image: '/leadsource/assets/leadsource/phone_logs.png',
      },
    ],
    features: [
      'Import contacts via VCF/vCard file upload',
      'Direct JSON sync for mobile app integration',
      'Pre-signed S3 upload for secure file transfer',
      'Auto-parse VCF files and extract contact data',
      'Map phone fields to CRM fields',
      'Auto-create CRM contacts on import',
      'Detailed import logs for tracking',
    ],
  },
};

/**
 * Get documentation for a source key.
 * Returns source-specific docs or a default guide.
 */
export const getSourceDocs = (sourceKey) => {
  return SOURCE_DOCS[sourceKey] || null;
};

export default SOURCE_DOCS;

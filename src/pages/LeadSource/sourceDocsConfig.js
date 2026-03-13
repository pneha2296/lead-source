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
  googleForm: {
    title: 'Google Forms',
    description: 'Connect Google Forms to automatically capture form responses as leads using a simple Apps Script integration.',
    videoUrl: null,
    steps: [
      {
        title: 'Create a Connection',
        description: 'Find the Google Form card in Lead Sources and click "Create Connection". Enter a name for your connection (e.g. "Contact Form Leads").',
        image: '/leadsource/assets/leadsource/google_form_connect.png',
      },
      {
        title: 'Copy the Apps Script',
        description: 'After creation, you will see a webhook URL and a ready-to-use Google Apps Script code. Click "Copy Script" to copy the script to your clipboard.',
        image: '/leadsource/assets/leadsource/google_form_script.png',
        tip: 'Keep your webhook URL private. Anyone with the URL can send leads to your account.',
      },
      {
        title: 'Open Google Forms Script Editor',
        description: 'Open your Google Form in edit mode. Click the three-dot menu (More options) at the top-right corner, then select "Script editor". This opens the Google Apps Script editor for your form.',
        image: '/leadsource/assets/leadsource/google_form_create_app_script.png',
      },
      {
        title: 'Paste the Apps Script',
        description: 'In the Script editor, select all the default code and replace it with the Apps Script you copied. Click the Save icon (or press Ctrl+S) to save the script.',
        image: '/leadsource/assets/leadsource/google_form_add_script.png',
        tip: 'Make sure to replace ALL the default code — do not append it at the bottom.',
      },
      {
        title: 'Set Up the Trigger',
        description: 'In the Script editor, click the clock icon (Triggers) in the left sidebar. Click "+ Add Trigger", set the function to "onFormSubmit", the event source to "From form", and the event type to "On form submit". Click Save and authorize the script when prompted.\nYou only need to set up the trigger once. It will automatically fire for every new form submission.',
        image: [
          '/leadsource/assets/leadsource/google_form_trigger.png', 
          '/leadsource/assets/leadsource/google_form_add_new_trigger.png',
          '/leadsource/assets/leadsource/google_form_trigger_setting.png'
        ],
        note: 'You may need to authorize the script to run when you first set up the trigger.'
      },
      {
        title: 'Set Up Field Mapping',
        description: 'Back in Lead Sources, open Field Mapping on your Google Forms connection card. Map the Google Form question fields to your CRM fields. Toggle "Auto-create Contact" to automatically create CRM contacts for each form response.',
        image: '/leadsource/assets/leadsource/google_form_fieldmapping.png',
        note: 'You need to send example data to get form field names for the field mapping.',
      },
      {
        title: 'Add Webhooks (Optional)',
        description: 'Navigate to Webhooks on your connection card to add outbound webhook URLs. These will receive real-time notifications when a new Google Forms response is captured as a lead.',
        image: '/leadsource/assets/leadsource/google_form_webhook.png',
      },
      {
        title: 'View Logs & Monitor',
        description: 'Use the Logs section to monitor all captured form responses. Each log entry shows the source, status, payload data, and timestamp for easy debugging.',
        image: '/leadsource/assets/leadsource/google_form_logs.png',
      },
    ],
    features: [
      'Simple Apps Script integration — no OAuth required',
      'Auto-detect form fields from incoming responses',
      'Capture form responses in real-time',
      'Map Google Form fields to CRM fields',
      'Auto-create CRM contacts on new submissions',
      'Forward leads to outbound webhooks',
      'Detailed response logs for monitoring',
      'Works with any Google Form',
    ],
  },
  jotForm: {
    title: 'JotForm',
    description: 'Connect JotForm to automatically capture form submissions as leads using JotForm\'s built-in webhook integration.',
    videoUrl: null,
    steps: [
      {
        title: 'Create a Connection',
        description: 'Find the JotForm card in Lead Sources and click "Create Connection". Enter a name for your connection (e.g. "Contact Form Leads").',
        image: ['/leadsource/assets/leadsource/jotform_connect.png', '/leadsource/assets/leadsource/jotform_create.png'],
      },
      {
        title: 'Copy the Webhook URL',
        description: 'After creation, you will see a unique inbound webhook URL. Click the copy button to copy it to your clipboard.',
        image: '/leadsource/assets/leadsource/jotform_copy_webhook.png',
        note: 'Keep your webhook URL private. Anyone with the URL can send data to your account.',
      },
      {
        title: 'Open Your Form in JotForm',
        description: 'Log in to your JotForm account and open the form you want to connect. Click on the "Edit" option on the particular form.',
        image: '/leadsource/assets/leadsource/jotform_formlist.png',
      },
      {
        title: 'Go to Settings',
        description: 'In the Settings panel, click on "Integrations" in the left sidebar to view available integrations and Search for "WebHooks" in the search bar. and select it.',
        image: '/leadsource/assets/leadsource/jotform_integrations.png',
      },
      {
        title: 'Add Webhook Integration',
        description: 'Paste the webhook URL you copied earlier into the Webhook URL field. Click "Complete Integration" to save. after that you can see message Integration Ready.',
        image: ['/leadsource/assets/leadsource/jotform_webhook_integration.png','/leadsource/assets/leadsource/jotform_webhook_success.png'],
        tip: 'Make sure you paste the full URL including https://.',
      },
      {
        title: 'Send a Test Submission',
        description: 'Now choose "Publish" Tab like show in image. Open that form in new tab or you can copy link and open in new tab. Then submit a test response in your JotForm form. This verifies the webhook connection is working and allows the system to auto-detect your form fields.',
        image: '/leadsource/assets/leadsource/jotform_submit_testform.png',
        note: 'You need to send at least one test submission before field mapping will show available form fields.',
      },
      {
        title: 'Set Up Field Mapping',
        description: 'Back in Lead Sources, open Field Mapping on your JotForm connection card. Map the JotForm fields to your CRM fields. Toggle "Auto-create Contact" to automatically create CRM contacts for each submission.',
        image: '/leadsource/assets/leadsource/jotform_fieldmapping.png',
      },
      {
        title: 'Add Webhooks (Optional)',
        description: 'Navigate to Webhooks on your connection card to add outbound webhook URLs. These will receive real-time notifications when a new JotForm submission is captured as a lead.',
        image: '/leadsource/assets/leadsource/jotform_webhooks.png',
      },
      {
        title: 'View Logs & Monitor',
        description: 'Use the Logs section to monitor all captured form submissions. Each log entry shows the source, status, payload data, and timestamp for easy debugging.',
        image: '/leadsource/assets/leadsource/jotform_logs.png',
      },
    ],
    features: [
      'Simple webhook integration — no coding required',
      'Auto-detect form fields from incoming submissions',
      'Capture form submissions in real-time',
      'Map JotForm fields to CRM fields',
      'Auto-create CRM contacts on new submissions',
      'Forward leads to outbound webhooks',
      'Detailed submission logs for monitoring',
      'Works with any JotForm form',
    ],
  },
  contactform7: {
    title: 'Contact Form 7',
    description: 'Connect Contact Form 7 to automatically capture WordPress form submissions as leads using our custom CF7 Webhook plugin.',
    videoUrl: null,
    steps: [
      {
        title: 'Create a Connection',
        description: 'Find the Contact Form 7 card in Lead Sources and click "Create Connection". Enter a name for your connection (e.g. "WordPress Contact Leads").',
        image: '/leadsource/assets/leadsource/cf7_connect.png',
      },
      {
        title: 'Copy the Webhook URL',
        description: 'After creation, you will see a unique inbound webhook URL. Click the copy button to copy it to your clipboard. You will need this URL in the next steps.',
        image: '/leadsource/assets/leadsource/cf7_config.png',
        note: 'Keep your webhook URL private. Anyone with the URL can send data to your account.',
      },
      {
        title: 'Install Contact Form 7 on WordPress',
        description: 'If you haven\'t already, install and activate the Contact Form 7 plugin on your WordPress site. Go to Plugins > Add New, search for "Contact Form 7", and click Install & Activate.',
        image: ['/leadsource/assets/leadsource/cf7_wordpress_plugin.png', '/leadsource/assets/leadsource/cf7_formlist.png'],
        tip: 'Contact Form 7 is one of the most popular WordPress form plugins with over 5 million active installations.',
      },
      {
        title: 'Download & Install Our WA Notifications for Contact Form 7 Plugin',
        description: 'Download our custom WA Notifications for Contact Form 7 plugin from the link below. In your WordPress dashboard, go to Plugins > Add New > Upload Plugin, select the downloaded .zip file, and click Install Now. Then activate the plugin.',
        image: '/leadsource/assets/leadsource/cf7_uploadzip.png',
        note: 'Download link: https://s3.eu-west-1.wasabisys.com/appcontent/cf7-webhook-plugin.zip',
      },
      {
        title: 'Open WA Notifications for Contact Form 7 Settings',
        description: 'After activating the plugin, you will see a new "WA Notifications for Contact Form 7" option in your WordPress sidebar. Click on it to open the webhook configuration page.',
        image: '/leadsource/assets/leadsource/cf7_wordpress_sidebaroption.png',
      },
      {
        title: 'Paste the Webhook URL',
        description: 'In the WA Notifications for Contact Form 7 settings page, select your Contact Form 7 form from the dropdown, paste the webhook URL you copied earlier into the Webhook URL field, and click Save.',
        image: '/leadsource/assets/leadsource/cf7_wordpress_addwebhook.png',
      },
      {
        title: 'Send a Test Submission (Generate Sample Data)',
        description: 'Go to your WordPress page where the Contact Form 7 form is displayed and submit a test entry with sample data (name, email, phone, message, etc.). This sends the data to the webhook and allows the system to auto-detect your form fields.',
        note: 'You must send at least one test submission before field mapping will show available form fields. Without sample data, the system cannot detect which fields your form has.',
      },
      {
        title: 'Set Up Field Mapping',
        description: 'Back in Lead Sources, open Field Mapping on your Contact Form 7 connection card. You will now see the form fields detected from your test submission. Map each form field (name, email, phone, message, etc.) to the corresponding CRM field. Toggle "Auto-create Contact" to automatically create CRM contacts for each new submission.',
        image: '/leadsource/assets/leadsource/cf7_fieldmapping.png',
      },
      {
        title: 'Add Webhooks (Optional)',
        description: 'Navigate to Webhooks on your connection card to add outbound webhook URLs. These will receive real-time notifications when a new Contact Form 7 submission is captured as a lead.',
        image: '/leadsource/assets/leadsource/cf7_webhook.png',
      },
      {
        title: 'View Logs & Monitor',
        description: 'Use the Logs section to monitor all captured form submissions. Each log entry shows the source, status, payload data, and timestamp for easy debugging. Verify that your test submission appears in the logs.',
        image: '/leadsource/assets/leadsource/cf7_logs.png',
      },
    ],
    features: [
      'Custom CF7 Webhook plugin — easy one-click install',
      'Auto-detect form fields from incoming submissions',
      'Capture form submissions in real-time',
      'Map Contact Form 7 fields to CRM fields',
      'Auto-create CRM contacts on new submissions',
      'Forward leads to outbound webhooks',
      'Detailed submission logs for monitoring',
      'Works with any Contact Form 7 form',
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
  hubspotCrm: {
    title: 'HubSpot CRM',
    description: 'Connect your HubSpot account to automatically capture leads from HubSpot forms and contacts.',
    videoUrl: null,
    steps: [
      {
        title: 'Click "Create Connection"',
        description: 'Go to Lead Sources, find HubSpot CRM and click the Create Connection button. A HubSpot authorization window will open.',
        image: '/leadsource/assets/leadsource/hubspot_create_connection.png',
      },
      {
        title: 'Authorize HubSpot Account',
        description: 'Sign in to your HubSpot account and authorize the application. Grant the required permissions to access your contacts and forms.',
        image: '/leadsource/assets/leadsource/hubspot_authorize_account.png',
      },
      {
        title: 'Connection Created',
        description: 'After authorization, you will be redirected back and your HubSpot connection will appear in the list automatically.',
        image: '/leadsource/assets/leadsource/hubspot_connection_created.png',
      },
      {
        title: 'Create Contact on Hobspot',
        description: 'Sidebar see option CRM -> Contacts and create new contact.',
        image: '/leadsource/assets/leadsource/hubspot_create_contact.png',
      },
      {
        title: 'Set Up Field Mapping',
        description: 'Click "Field Mapping" on the connection card to map HubSpot contact properties to your CRM fields.',
        image: '/leadsource/assets/leadsource/hubspot_field_mapping.png',
        tip: 'HubSpot contact properties like firstname, lastname, email, phone are automatically available for mapping.',
      },
      {
        title: 'Configure Webhooks (Optional)',
        description: 'Click "Webhooks" to set up custom webhook notifications for new leads received from HubSpot.',
        image: '/leadsource/assets/leadsource/hubspot_webhooks.png',
      },
      {
        title: 'View Logs',
        description: 'Click "View Logs" to see all incoming leads and their processing status from HubSpot.',
        image: '/leadsource/assets/leadsource/hubspot_view_logs.png',
      },
    ],
    features: [
      'OAuth-based secure connection — no API keys needed',
      'Automatic HubSpot form list sync',
      'Real-time lead capture from HubSpot form submissions',
      'Map HubSpot contact properties to CRM fields',
      'Webhook notifications for new leads',
      'Detailed logs for tracking incoming leads',
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

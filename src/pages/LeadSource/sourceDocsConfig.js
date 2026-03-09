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
        description: 'Find Zoho CRM in Lead Sources and click Create Connection. A popup window will open for Zoho authentication.',
        image: null,
      },
      {
        title: 'Authorize with Zoho',
        description: 'Sign in to your Zoho account and authorize the application. Select your organization and grant the required permissions.',
        image: null,
        tip: 'The popup will close automatically after successful authorization.',
      },
      {
        title: 'Verify Connection',
        description: 'Once connected, your Zoho account details (name, email, region) will appear on the connection card. Click Configure to verify.',
        image: null,
      },
      {
        title: 'Set Up Field Mapping',
        description: 'Map Zoho CRM lead fields to your local CRM fields. This controls how data flows from Zoho into your system.',
        image: null,
      },
      {
        title: 'Sync Leads',
        description: 'Use the Sync Leads button to pull leads from Zoho on demand, or let the automated schedule handle it.',
        image: null,
      },
      {
        title: 'Add Webhook & View Logs',
        description: 'Set up webhooks for real-time lead notifications. Monitor all activity through the Logs section.',
        image: null,
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
};

/**
 * Get documentation for a source key.
 * Returns source-specific docs or a default guide.
 */
export const getSourceDocs = (sourceKey) => {
  return SOURCE_DOCS[sourceKey] || null;
};

export default SOURCE_DOCS;

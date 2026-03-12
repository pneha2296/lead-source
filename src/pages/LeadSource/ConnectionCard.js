import React from 'react';
import { useHistory } from 'react-router-dom';
import { BsGearWideConnected } from 'react-icons/bs';
import { MdOutlineWebhook } from 'react-icons/md';
import { BiLink } from 'react-icons/bi';
import { FiFileText } from 'react-icons/fi';
import { FaTrashCan } from 'react-icons/fa6';
import { LuRefreshCw } from 'react-icons/lu';

// --- Action registry: all possible action buttons ---
const ACTION_REGISTRY = {
  configure: {
    icon: <BsGearWideConnected size={15} />,
    title: 'Configure',
    bg: '#f1f5f9',
    color: '#475569',
    hoverBg: '#334155',
    hoverColor: '#fff',
  },
  webhooks: {
    icon: <MdOutlineWebhook size={15} />,
    title: 'Webhooks',
    bg: '#eff6ff',
    color: '#3b82f6',
    hoverBg: '#3b82f6',
    hoverColor: '#fff',
  },
  fieldMapping: {
    icon: <BiLink size={15} />,
    title: 'Field Mapping',
    bg: '#f5f3ff',
    color: '#7c3aed',
    hoverBg: '#7c3aed',
    hoverColor: '#fff',
  },
  logs: {
    icon: <FiFileText size={15} />,
    title: 'View Logs',
    bg: '#ecfdf5',
    color: '#059669',
    hoverBg: '#059669',
    hoverColor: '#fff',
  },
  syncLeads: {
    icon: <LuRefreshCw size={15} />,
    title: 'Sync Leads',
    bg: '#fef9c3',
    color: '#a16207',
    hoverBg: '#ca8a04',
    hoverColor: '#fff',
  },
  delete: {
    icon: <FaTrashCan size={14} />,
    title: 'Remove',
    bg: '#fef2f2',
    color: '#dc2626',
    hoverBg: '#dc2626',
    hoverColor: '#fff',
  },
};

// --- Title resolvers ---
const TITLE_RESOLVERS = {
  pageForm: (c) => {
    const page = c?.configuration?.pageName || c.source;
    const form = c?.configuration?.formName || c.source;
    return `${page} - ${form}`;
  },
  genericWebhook: (c) => `${c?.configuration?.name} (${c?.configuration?.webhookType})`,
  zohoAccount: (c) => c?.configuration?.accountName,
  typeForm: (c) => c?.configuration?.formName,
  googleForm: (c) => c?.configuration?.formTitle || c?.configuration?.name,
  contactform7: (c) => `${c?.configuration?.formTitle} (${c?.configuration?.formId})` || c?.configuration?.name,
  accountName: (c) => c?.configuration?.accountName || c.name || c.source,
  connectionName: (c) => c?.configuration?.connectionName || c.name || c.source,
  defaultTitle: (c) => c.name || c.source,
};

// --- Provider config: define title + actions per provider ---
// Keys match both camelCase and snake_case provider values from API
const PROVIDER_CONFIG = {
  // Facebook
  facebook_leadgen: {
    getTitle: TITLE_RESOLVERS.pageForm,
    actions: ['configure', 'webhooks', 'fieldMapping', 'logs', 'delete'],
  },

  // IndiaMART
  indiamart: {
    getTitle: TITLE_RESOLVERS.accountName,
    actions: ['configure', 'webhooks', 'syncLeads', 'fieldMapping', 'logs', 'delete'],
  },

  //Zoho
  zoho: {
    getTitle: TITLE_RESOLVERS.zohoAccount,
    getSubTitle: (c) => `${c?.configuration?.zohoUserName} ${c?.configuration?.zohoUserEmail}`,
    actions: ['configure', 'webhooks', 'syncLeads', 'fieldMapping', 'logs', 'delete'],
  },

  // Webhook
  webhook: {
    getTitle: TITLE_RESOLVERS.connectionName,
    actions: ['configure', 'webhooks', 'fieldMapping', 'logs', 'delete'],
  },

  // Generic Webhook
  generic_webhook: {
    getTitle: TITLE_RESOLVERS.genericWebhook,
    actions: ['configure', 'webhooks', 'fieldMapping', 'logs', 'delete'],
  },

  // Google Forms
  google_forms: {
    getTitle: TITLE_RESOLVERS.googleForm,
    actions: ['configure', 'webhooks', 'fieldMapping', 'logs', 'delete'],
  },

  // JotForm
  jotform: {
    getTitle: TITLE_RESOLVERS.googleForm,
    actions: ['configure', 'webhooks', 'fieldMapping', 'logs', 'delete'],
  },

  // Contact Form 7
  contactform7: {
    getTitle: TITLE_RESOLVERS.contactform7,
    actions: ['configure', 'webhooks', 'fieldMapping', 'logs', 'delete'],
  },

  // Google Ads
  google_ads: {
    getTitle: TITLE_RESOLVERS.connectionName,
    actions: ['configure', 'webhooks', 'fieldMapping', 'logs', 'delete'],
  },

  // LinkedIn
  linkedin_leadgen: {
    getTitle: TITLE_RESOLVERS.pageForm,
    actions: ['configure', 'webhooks', 'fieldMapping', 'logs', 'delete'],
  },

  // Typeform
  typeform: {
    getTitle: TITLE_RESOLVERS.typeForm,
    getSubTitle: (c) => c?.configuration?.email,
    actions: ['configure', 'webhooks', 'fieldMapping', 'logs', 'delete'],
  },

  // Landing Page
  landing_page: {
    getTitle: TITLE_RESOLVERS.connectionName,
    actions: ['configure', 'webhooks', 'logs', 'delete'],
  },

  // Phone Contact
  phone_connect: {
    getTitle: TITLE_RESOLVERS.accountName,
    actions: ['configure', 'webhooks', 'logs', 'delete'],
  },

  // OCR App
  ocr_app: {
    getTitle: TITLE_RESOLVERS.connectionName,
    actions: ['configure', 'logs', 'delete'],
  },

  zohoCrm: {
    getTitle: TITLE_RESOLVERS.connectionName,
    actions: ['configure', 'webhooks', 'syncLeads', 'fieldMapping', 'logs', 'delete'],
  },

  hubspot_crm: {
    getTitle: TITLE_RESOLVERS.connectionName,
    actions: ['configure', 'webhooks', 'fieldMapping', 'logs', 'delete'],
  },

  salesforce: {
    getTitle: TITLE_RESOLVERS.connectionName,
    actions: ['configure', 'webhooks', 'fieldMapping', 'logs', 'delete'],
  },

  // Marketplace Providers
  trade_india: {
    getTitle: TITLE_RESOLVERS.connectionName,
    actions: ['configure', 'webhooks', 'logs', 'delete'],
  },

  tradeIndia: {
    getTitle: TITLE_RESOLVERS.connectionName,
    actions: ['configure', 'webhooks', 'logs', 'delete'],
  },

  magic_bricks: {
    getTitle: TITLE_RESOLVERS.connectionName,
    actions: ['configure', 'webhooks', 'logs', 'delete'],
  },

  zomato: {
    getTitle: TITLE_RESOLVERS.connectionName,
    actions: ['configure', 'webhooks', 'logs', 'delete'],
  },
};

const DEFAULT_CONFIG = {
  getTitle: TITLE_RESOLVERS.defaultTitle,
  actions: ['configure', 'webhooks', 'fieldMapping', 'logs', 'delete'],
};

const getProviderConfig = (connection) => {
  return PROVIDER_CONFIG[connection.provider]
    || PROVIDER_CONFIG[connection.source]
    || PROVIDER_CONFIG[connection.key]
    || DEFAULT_CONFIG;
};

// --- ActionButton sub-component ---
const ActionButton = ({ actionKey, onClick }) => {
  const config = ACTION_REGISTRY[actionKey];
  if (!config) return null;

  return (
    <button
      className='btn btn-sm d-flex align-items-center justify-content-center'
      title={config.title}
      style={{
        width: '34px',
        height: '34px',
        borderRadius: '8px',
        backgroundColor: config.bg,
        color: config.color,
        transition: 'all 0.2s',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = config.hoverBg;
        e.currentTarget.style.color = config.hoverColor;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = config.bg;
        e.currentTarget.style.color = config.color;
      }}
      onClick={onClick}
    >
      {config.icon}
    </button>
  );
};

// --- Main ConnectionCard component ---
const ConnectionCard = ({ connection, icon, onConfigure, onWebhooks, onFieldMapping, onLogs, onSyncLeads, onDelete }) => {
  const history = useHistory();
  const config = getProviderConfig(connection);
  const title = config.getTitle(connection);
  const subTitle = config.getSubTitle?.(connection);
  const connectionId = connection._id || connection.id;

  const actionHandlers = {
    configure: () => onConfigure(connection),
    webhooks: () => history.push(`/settings/${connectionId}/webhook`),
    fieldMapping: () => onFieldMapping(connection),
    logs: () => onLogs(connection),
    syncLeads: () => onSyncLeads(connection),
    delete: () => onDelete(connection),
  };

  return (
    <div className='col-md-6 col-lg-4 col-xl-3'>
      <div
        className='card border-1 mb-1'
        style={{
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          transition: 'all 0.2s',
          cursor: 'pointer',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.15)';
          e.currentTarget.style.transform = 'translateY(-2px)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
          e.currentTarget.style.transform = 'translateY(0)';
        }}
      >
        <div className='card-body p-3'>
          <div className='d-flex align-items-start mb-2'>
            <div
              className='me-2'
              style={{
                fontSize: '1.5rem',
                background: '#f1f5f9',
                borderRadius: '6px',
                padding: '0.4rem',
                width: '45px',
                height: '45px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {icon}
            </div>
            <div className='flex-grow-1'>
              <h6
                className='card-title mb-1'
                style={{ color: '#1e293b', fontWeight: '600', fontSize: '0.95rem' }}
              >
                {title}
              </h6> 
              {subTitle && (
                <span className='d-block text-muted mt-1' style={{ fontSize: '0.7rem' }}>
                  {subTitle}
                </span>
              )}             
              {connection?.configuration?.lastApiCallAt && (connection.provider === 'indiamart' || connection.source === 'indiamart' || connection.provider === 'zoho' || connection.provider === 'zoho_crm' || connection.source === 'zoho_crm') && (
                <span className='d-block text-muted mt-1' style={{ fontSize: '0.7rem' }}>
                  Last Sync: {new Date(connection.configuration.lastApiCallAt).toLocaleString()}
                </span>
              )}
              <span
                className='badge'
                style={{
                  backgroundColor: connection.status === 'active' ? '#22c55e' : '#f59e0b',
                  color: 'white',
                  fontSize: '0.7rem',
                  fontWeight: '500',
                  padding: '0.15rem 0.5rem',
                }}
              >
                {connection.status || 'active'}
              </span>
            </div>
          </div>
          <p
            className='card-text text-muted mb-2'
            style={{ fontSize: '0.8rem', lineHeight: '1.4' }}
          >
            {connection.description || connection.source}
          </p>
          <div className='d-flex align-items-center justify-content-evenly mt-1'>
            {config.actions.map((actionKey) => (
              <ActionButton
                key={actionKey}
                actionKey={actionKey}
                onClick={actionHandlers[actionKey]}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConnectionCard;

import React, { useState, useEffect, useCallback } from 'react';
import { withRouter } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import {
  Container,
  Spinner,
  Alert,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';
import BreadCrumb from '../../Components/Common/BreadCrumb';
import MetaTag from '../../Components/Common/Meta';
import { useHistory } from 'react-router-dom';
import {
  listConnections,
  deleteConnection,
  deleteIndiamartConnection,
  deleteZohoConnection,
  deleteGenericWebhookConnection,
  deletePhoneContactConnection,
  deleteTypeformConnection,
  deleteGoogleFormsConnection,
  deleteJotFormConnection,
  deleteContactForm7Connection,
  pullIndiamartLeads,
  pullZohoLeads,
  updateConnections,
  deleteHubspotConnection,
  deleteContactBookConnection,
  deleteShopifyConnection
} from '../../helpers/backend_helper';
import ConfigureModal from './ConfigureModal';
import DeleteConfirmModal from './DeleteConfirmModal';
import StatusToggleModal from './StatusToggleModal';
import FieldMappingModal from './FieldMappingModal';
import ConnectionCard from './ConnectionCard';
import PhoneContactModal from './models/PhoneContactModal';
import WebhookCreationModal from './models/WebhookCreationModal';
import GoogleFormsModal from './models/GoogleFormsModal';
import JotFormModal from './models/JotFormModal';
import ContactForm7Modal from './models/ContactForm7Modal';
import FacebookLeadAdsModal from './models/FacebookLeadAdsModal';
import OcrAppModal from './models/OcrAppModal';
import ContactBookModal from './models/ContactBookModal';

//icons
import { SiGoogleads } from 'react-icons/si';
import { SiLinkedin } from 'react-icons/si';
import { SiShopify } from 'react-icons/si';
import { CgWebsite } from 'react-icons/cg';
import { FaYoutube } from 'react-icons/fa';
import { FiExternalLink } from 'react-icons/fi';
import { BsGearWideConnected } from 'react-icons/bs';
import { ImMobile } from 'react-icons/im';
import { IoQrCodeOutline } from 'react-icons/io5';
import { LiaSalesforce } from 'react-icons/lia';
import { FaHandshake } from 'react-icons/fa';
import { BsBuildingsFill } from 'react-icons/bs';
import { MdRestaurant } from 'react-icons/md';
import { RiContactsBook2Line } from 'react-icons/ri';

// Local icon assets
const ICON_PATH = '/leadsource/assets/icons';
const IconImg = ({ src, alt }) => <img src={src} alt={alt} style={{ width: 32, height: 32, objectFit: 'contain', padding: 0, margin: 0 }} />;
import { getSessionToken } from '../../helpers/backend_helper';
import Preloader from '../../Components/Loaders/Preloader';

const sourceIconMap = {
  // camelCase keys (used in allSources)
  facebookLeadAds: <IconImg src={`${ICON_PATH}/meta-icon.svg`} alt="Meta" />,
  webhook: <IconImg src={`${ICON_PATH}/webhook-icon.svg`} alt="Webhook" />,
  form: <IconImg src={`${ICON_PATH}/google-forms-icon.svg`} alt="Google Forms" />,
  googleForm: <IconImg src={`${ICON_PATH}/google-forms-icon.svg`} alt="Google Forms" />,
  typeform: <IconImg src={`${ICON_PATH}/typeform-icon.svg`} alt="Typeform" />,
  googleAds: <SiGoogleads />,
  linkedinLeadGen: <SiLinkedin />,
  landingPage: <CgWebsite />,
  callConnect: <ImMobile />,
  ocrApp: <IoQrCodeOutline />,
  zohoCrm: <IconImg src={`${ICON_PATH}/zoho-icon.svg`} alt="Zoho" />,
  hubspotCrm: <IconImg src={`${ICON_PATH}/hubspot-icon.svg`} alt="HubSpot" />,
  salesforce: <LiaSalesforce />,
  indiaMart: <IconImg src={`${ICON_PATH}/Indiamart-icon.png`} alt="IndiaMART" />,
  tradeIndia: <FaHandshake />,
  magicBricks: <BsBuildingsFill />,
  zomato: <MdRestaurant />,
  generic_webhook: <IconImg src={`${ICON_PATH}/webhook-icon.svg`} alt="Webhook" />,
  genericWebhook: <IconImg src={`${ICON_PATH}/webhook-icon.svg`} alt="Webhook" />,
  jotForm: <IconImg src={`${ICON_PATH}/JotForm-icon.svg`} alt="JotForm" />,
  jotform: <IconImg src={`${ICON_PATH}/JotForm-icon.svg`} alt="JotForm" />,
  contactform7: <IconImg src={`${ICON_PATH}/contact-form-7-icon.png`} alt="Contact Form 7" />,
  contactBook: <RiContactsBook2Line />,
  // provider keys (returned from API)
  facebook_leadgen: <IconImg src={`${ICON_PATH}/meta-icon.svg`} alt="Meta" />,
  google_forms: <IconImg src={`${ICON_PATH}/google-forms-icon.svg`} alt="Google Forms" />,
  google_ads: <SiGoogleads />,
  linkedin_leadgen: <SiLinkedin />,
  landing_page: <CgWebsite />,
  call_connect: <ImMobile />,
  callConnect: <ImMobile />,
  ocr_app: <IoQrCodeOutline />,
  zoho: <IconImg src={`${ICON_PATH}/zoho-icon.svg`} alt="Zoho" />,
  zoho_crm: <IconImg src={`${ICON_PATH}/zoho-icon.svg`} alt="Zoho" />,
  hubspot: <IconImg src={`${ICON_PATH}/hubspot-icon.svg`} alt="HubSpot" />,
  indiamart: <IconImg src={`${ICON_PATH}/Indiamart-icon.png`} alt="IndiaMART" />,
  trade_india: <FaHandshake />,
  magic_bricks: <BsBuildingsFill />,
  contact_connect: <RiContactsBook2Line />,
  contact_book: <RiContactsBook2Line />,
  shopify: <SiShopify color="#96bf48" />,
  shopifyCrm: <SiShopify color="#96bf48" />,
};

const getSourceIcon = (connection) => {
  return sourceIconMap[connection.provider] || sourceIconMap[connection.source] || sourceIconMap[connection.key] || <BsGearWideConnected />;
};

const LeadSources = (props) => {
  const history = useHistory();

  const queryParams = new URLSearchParams(history.location.search);
  const [activeTab, setActiveTab] = useState(queryParams.get('tab') || 'all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalUrl, setModalUrl] = useState('');

  // Configure, Delete, Logs & Mapping modal state
  const [configureOpen, setConfigureOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [statusToggleOpen, setStatusToggleOpen] = useState(false);
  const [mappingOpen, setMappingOpen] = useState(false);
  const [selectedConnection, setSelectedConnection] = useState(null);

  // Creation modal open states
  const [webhookModalOpen, setWebhookModalOpen] = useState(false);
  const [phoneModalOpen, setPhoneModalOpen] = useState(false);
  const [ocrModalOpen, setOcrModalOpen] = useState(false);
  const [googleFormsModalOpen, setGoogleFormsModalOpen] = useState(false);
  const [jotFormModalOpen, setJotFormModalOpen] = useState(false);
  const [cf7ModalOpen, setCf7ModalOpen] = useState(false);
  const [contactBookModalOpen, setContactBookModalOpen] = useState(false);

  // Installed connections state
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 20,
    totalPages: 0,
  });

  const fetchConnections = useCallback((page = 1) => {
    setLoading(true);
    listConnections({ page, limit: 20 })
      .then((response) => {
        setConnections(response.data || []);
        setPagination(response.pagination || { total: 0, page, limit: 20, totalPages: 0 });
      })
      .catch((err) => {
        console.error('Failed to fetch connections:', err);
        setConnections([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    fetchConnections(currentPage);
  }, [currentPage, fetchConnections]);

  // Listen for messages from the Facebook connect iframe
  const handleIframeMessage = useCallback((event) => {
    if (event.origin !== 'https://oauth.automationsbuilder.com') return;

    if (event.data?.type === 'fb_connect') {
      if (event.data.status === 'success') {
        console.log('Facebook connected successfully:', event.data.data);
        fetchConnections(currentPage);
      } else {
        console.error('Facebook connection failed:', event.data.data);
      }
      setShowModal(false);
      setModalUrl('');
    }
  }, []);

  useEffect(() => {
    window.addEventListener('message', handleIframeMessage);
    return () => window.removeEventListener('message', handleIframeMessage);
  }, [handleIframeMessage]);

  const allSources = [
    {
      id: 1,
      version: '0.0.1',
      name: 'Facebook Lead Ads',
      key: 'facebookLeadAds',
      icon: <IconImg src={`${ICON_PATH}/meta-icon.svg`} alt="Meta" />,
      isConnectShow: true,
      description: 'Capture leads directly from Facebook ads',
    },
    {
      id: 2,
      version: '0.0.1',
      name: 'Webhook',
      key: 'webhooks',
      isConnectShow: true,
      icon: <IconImg src={`${ICON_PATH}/webhook-icon.svg`} alt="Webhook" />,
      description: 'Receive leads via custom webhook',
    },
    {
      id: 3,
      version: '0.0.1',
      name: 'Google Form',
      key: 'googleForm',
      isConnectShow: true,
      icon: <IconImg src={`${ICON_PATH}/google-forms-icon.svg`} alt="Google Forms" />,
      description: 'Sync leads from Google Forms',
    },
    {
      id: 16,
      version: '0.0.1',
      name: 'JotForm',
      key: 'jotForm',
      isConnectShow: true,
      icon: <IconImg src={`${ICON_PATH}/JotForm-icon.svg`} alt="JotForm" />,
      description: 'Capture leads from JotForm submissions',
    },
    {
      id: 4,
      version: '0.0.1',
      name: 'Typeform',
      key: 'typeform',
      isConnectShow: true,
      icon: <IconImg src={`${ICON_PATH}/typeform-icon.svg`} alt="Typeform" />,
      description: 'Connect with Typeform responses',
    },
    {
      id: 10,
      version: '0.0.1',
      name: 'Zoho CRM',
      key: 'zohoCrm',
      isConnectShow: true,
      icon: <IconImg src={`${ICON_PATH}/zoho-icon.svg`} alt="Zoho" />,
      description: 'Sync leads from Zoho CRM',
    },
    {
      id: 11,
      version: '0.0.1',
      name: 'Hubspot CRM',
      key: 'hubspotCrm',
      isConnectShow: true,
      icon: <IconImg src={`${ICON_PATH}/hubspot-icon.svg`} alt="HubSpot" />,
      description: 'Sync leads from Hubspot CRM',
    },
    {
      id: 13,
      version: '0.0.1',
      name: 'India Mart',
      key: 'indiaMart',
      isConnectShow: true,
      icon: <IconImg src={`${ICON_PATH}/Indiamart-icon.png`} alt="IndiaMART" />,
      description: 'Capture leads from IndiaMART enquiries',
    },
    {
      id: 17,
      version: '0.0.1',
      name: 'Contact Form 7',
      key: 'contactform7',
      isConnectShow: true,
      icon: <IconImg src={`${ICON_PATH}/contact-form-7-icon.png`} alt="Contact Form 7" />,
      description: 'Capture leads from WordPress Contact Form 7',
    },
    {
      id: 19,
      version: '0.0.1',
      name: 'Shopify',
      key: 'shopify',
      isConnectShow: true,
      icon: <SiShopify color="#96bf48" size={28} />,
      description: 'Capture leads from Shopify orders and checkouts',
    },
    {
      id: 8,
      version: '0.0.1',
      name: 'Call History Connect',
      key: 'callConnect',
      isConnectShow: true,
      icon: <ImMobile />,
      description: 'Import leads from call history',
    },
    {
      id: 18,
      version: '0.0.1',
      name: 'Contact Book',
      key: 'contactBook',
      isConnectShow: true,
      icon: <RiContactsBook2Line />,
      description: 'Import leads from your phone contact book',
    },
    {
      id: 9,
      version: '0.0.1',
      name: 'OCR App',
      key: 'ocrApp',
      isConnectShow: true,
      icon: <IoQrCodeOutline />,
      description: 'Scan and capture leads via OCR',
    },
    {
      id: 14,
      version: '0.0.1',
      name: 'Magic Bricks',
      key: 'magicBricks',
      isConnectShow: false,
      icon: <BsBuildingsFill />,
      description: 'Capture real estate leads from MagicBricks',
    },
    {
      id: 15,
      version: '0.0.1',
      name: 'Zomato',
      key: 'zomato',
      isConnectShow: false,
      icon: <MdRestaurant />,
      description: 'Import restaurant leads from Zomato',
    },
    {
      id: 12,
      version: '0.0.1',
      name: 'Salesforce',
      key: 'salesforce',
      isConnectShow: false,
      icon: <LiaSalesforce />,
      description: 'Sync leads from Salesforce',
    },
    {
      id: 5,
      version: '0.0.1',
      name: 'Google Ads',
      key: 'googleAds',
      isConnectShow: false,
      icon: <SiGoogleads />,
      description: 'Import leads from Google Ads campaigns',
    },
    {
      id: 6,
      version: '0.0.1',
      name: 'LinkedIn Lead Gen',
      key: 'linkedinLeadGen',
      isConnectShow: false,
      icon: <SiLinkedin />,
      description: 'Capture LinkedIn sponsored leads',
    },
    {
      id: 7,
      version: '0.0.1',
      name: 'Landing Page',
      isConnectShow: false,
      key: 'landingPage',
      icon: <CgWebsite />,
      description: 'Custom landing page forms',
    },
  ];

  const filterSources = (sources) => {
    return sources.filter(
      (source) =>
        source.name.toLowerCase().includes(searchTerm.toLowerCase()) || source.description.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  };

  const filteredAll = filterSources(allSources);

  const handleConfigure = (connection) => {
    setSelectedConnection(connection);
    setConfigureOpen(true);
  };

  const handleConfigureSave = async (id, formData) => {
    // TODO: integrate update API when ready
    console.log('Update connection:', id, formData);
    await updateConnections(formData);
    setConfigureOpen(false);
    setSelectedConnection(null);
    fetchConnections(currentPage);
  };

  const handleDeleteClick = (connection) => {
    setSelectedConnection(connection);
    setDeleteOpen(true);
  };

  const handleToggleStatusClick = (connection) => {
    setSelectedConnection(connection);
    setStatusToggleOpen(true);
  };

  const handleToggleStatusConfirm = async (id, newStatus) => {
    try {
      await updateConnections({ _id: id, status: newStatus });
      setStatusToggleOpen(false);
      setSelectedConnection(null);
      fetchConnections(currentPage);
    } catch (err) {
      console.error('Failed to toggle connection status:', err);
    }
  };

  const handleLogsClick = (connection) => {
    const connId = connection._id || connection.id;
    history.push(`/settings/${connId}/logs?tab=${activeTab}`);
  };

  const handleMappingClick = (connection) => {
    setSelectedConnection(connection);
    setMappingOpen(true);
  };

  const handleDeleteConfirm = async (id) => {
    const provider = selectedConnection?.provider || selectedConnection?.source;
    if (provider === 'india_mart' || provider === 'indiaMart' || provider === 'indiamart') {
      await deleteIndiamartConnection(id);
    } else if (provider === 'zoho' || provider === 'zoho_crm' || provider === 'zohoCrm') {
      await deleteZohoConnection(id);
    } else if (provider === 'generic_webhook' || provider === 'genericWebhook' || provider === 'webhook') {
      await deleteGenericWebhookConnection(id);
    } else if (provider === 'phone_contact' || provider === 'phoneContact' || provider === 'call_connect' || provider === 'callConnect') {
      await deletePhoneContactConnection(id);
    } else if (provider === 'ocr') {
      await deleteOcrConnection(id);
    } else if (provider === 'typeform') {
      await deleteTypeformConnection(id);
    } else if (provider === 'google_forms' || provider === 'googleForm') {
      await deleteGoogleFormsConnection(id);
    } else if (provider === 'jotform' || provider === 'jotForm') {
      await deleteJotFormConnection(id);
    } else if (provider === 'contact_form_7' || provider === 'contactform7') {
      await deleteContactForm7Connection(id);
    } else if (provider === 'hubspot' || provider === 'hubspot_crm' || provider === 'hubspotCrm') {
      await deleteHubspotConnection(id);
    } else if (provider === 'contact_book' || provider === 'contactBook' || provider === 'contact_connect' || provider === 'contactConnect') {
      await deleteContactBookConnection(id);
    } else if (provider === 'shopify') {
      await deleteShopifyConnection(id);
    } else {
      await deleteConnection(id);
    }
    setDeleteOpen(false);
    setSelectedConnection(null);
    fetchConnections(currentPage);
  };

  const handleSyncLeads = async (connection) => {
    const provider = connection?.provider || connection?.source;
    try {
      if (provider === 'zoho') {
        await pullZohoLeads();
      } else {
        await pullIndiamartLeads();
      }
      fetchConnections(currentPage);
    } catch (err) {
      console.error('Failed to sync leads:', err);
    }
  };

  async function handleCreateNewConnection(source) {
    setLoading(true);
    switch (source.key) {
      case 'facebookLeadAds': {
        const token = await getSessionToken({ leadSourceId: 'facebook_leadgen' });
        setLoading(false);
        setModalUrl(`https://oauth.automationsbuilder.com/lead-session?token=${token?.session}`);
        setShowModal(true);
        break;
      }
      case 'zohoCrm': {
        const token = await getSessionToken({ leadSourceId: 'zoho_crm' });
        setLoading(false);
        const zohoUrl = `https://oauth.automationsbuilder.com/zoho-session?token=${token?.session}`;
        const width = 600;
        const height = 700;
        const left = window.screenX + (window.outerWidth - width) / 2;
        const top = window.screenY + (window.outerHeight - height) / 2;
        const popup = window.open(zohoUrl, 'zoho_oauth', `width=${width},height=${height},left=${left},top=${top},scrollbars=yes`);
        if (popup) {
          const pollTimer = setInterval(() => {
            try {
              if (popup.closed) {
                clearInterval(pollTimer);
                fetchConnections(currentPage);
                return;
              }
              if (popup.location.href && popup.location.href.includes('zoho=success')) {
                clearInterval(pollTimer);
                popup.close();
                fetchConnections(currentPage);
              }
            } catch (e) {
              // Cross-origin — ignore until redirect back to same origin or popup closes
            }
          }, 500);
        }
        break;
      }
      case 'webhooks': {
        setWebhookModalOpen(true);
        break;
      }
      case 'phoneContact':
      case 'callConnect': {
        setPhoneModalOpen(true);
        break;
      }
      case 'contactBook': {
        setContactBookModalOpen(true);
        break;
      }
      case 'ocrApp': {
        setOcrModalOpen(true);
        break;
      }
      case 'googleForm': {
        setGoogleFormsModalOpen(true);
        break;
      }
      case 'jotForm': {
        setJotFormModalOpen(true);
        break;
      }
      case 'contactform7': {
        setCf7ModalOpen(true);
        break;
      }
      case 'hubspotCrm': {
        const token = await getSessionToken({ leadSourceId: 'hubspot_crm' });
        setLoading(false);
        const hubspotUrl = `https://oauth.automationsbuilder.com/hubspot-session?token=${token?.session}`;
        const hWidth = 600;
        const hHeight = 700;
        const hLeft = window.screenX + (window.outerWidth - hWidth) / 2;
        const hTop = window.screenY + (window.outerHeight - hHeight) / 2;
        const hubspotPopup = window.open(hubspotUrl, 'hubspot_oauth', `width=${hWidth},height=${hHeight},left=${hLeft},top=${hTop},scrollbars=yes`);
        if (hubspotPopup) {
          const pollTimer = setInterval(() => {
            try {
              if (hubspotPopup.closed) {
                clearInterval(pollTimer);
                fetchConnections(currentPage);
                return;
              }
            } catch (e) {
              // Cross-origin — ignore
            }
          }, 500);
        }
        break;
      }
      case 'shopify': {
        const token = await getSessionToken({ leadSourceId: 'shopify' });
        setLoading(false);
        const shopifyUrl = `https://oauth.automationsbuilder.com/shopify-session?token=${token?.session}`;
        const sWidth = 600;
        const sHeight = 700;
        const sLeft = window.screenX + (window.outerWidth - sWidth) / 2;
        const sTop = window.screenY + (window.outerHeight - sHeight) / 2;
        const shopifyPopup = window.open(shopifyUrl, 'shopify_oauth', `width=${sWidth},height=${sHeight},left=${sLeft},top=${sTop},scrollbars=yes`);
        if (shopifyPopup) {
          const handleShopifyMessage = (event) => {
            if (event.data?.type === 'shopify_connect') {
              window.removeEventListener('message', handleShopifyMessage);
              if (shopifyPopup && !shopifyPopup.closed) shopifyPopup.close();
              if (event.data.status === 'success') {
                fetchConnections(currentPage);
              }
            }
          };
          window.addEventListener('message', handleShopifyMessage);
          const pollTimer = setInterval(() => {
            if (shopifyPopup.closed) {
              clearInterval(pollTimer);
              window.removeEventListener('message', handleShopifyMessage);
              fetchConnections(currentPage);
            }
          }, 500);
        }
        break;
      }
      case 'typeform': {
        const token = await getSessionToken({ leadSourceId: 'typeform' });
        setLoading(false);
        const typeformUrl = `https://oauth.automationsbuilder.com/typeform-session?token=${token?.session}`;
        const width = 600;
        const height = 700;
        const left = window.screenX + (window.outerWidth - width) / 2;
        const top = window.screenY + (window.outerHeight - height) / 2;
        const popup = window.open(
          typeformUrl,
          'typeform-connect',
          `width=${width},height=${height},left=${left},top=${top},scrollbars=yes`,
        );
        const handleMessage = (event) => {
          if (event.data?.type === 'typeform_connect') {
            window.removeEventListener('message', handleMessage);
            if (popup && !popup.closed) popup.close();
            if (event.data.status === 'success') {
              fetchConnections(currentPage);
            }
          }
        };
        window.addEventListener('message', handleMessage);
        if (popup) {
          const pollTimer = setInterval(() => {
            if (popup.closed) {
              clearInterval(pollTimer);
              window.removeEventListener('message', handleMessage);
              fetchConnections(currentPage);
            }
          }, 500);
        }
        break;
      }
      default: {
        const { icon, ...sourceData } = source;
        history.push('/settings/' + source.key, { source: sourceData });
        break;
      }
    }
    setLoading(false);
  }

  const handleConnectionCreated = () => fetchConnections(currentPage);


  return (
    <React.Fragment>
      <div className='page-content'>
        <MetaTag pageTitle='CRM - Lead Source' />
        <Container fluid>
          <BreadCrumb title='Lead Source' pageTitle='CRM' />

          {/* Beta Banner */}
          <Alert color='info' className='d-flex align-items-center mb-4' style={{ borderRadius: '8px' }}>
            <i className='ri-gift-line fs-5 me-2'></i>
            <span>Lead Source is currently in <strong>Beta</strong> and is available <strong>free</strong> for all users during this period.</span>
          </Alert>

          {/* Search Bar & Analytics Button */}
          <div className='row mb-4'>
            <div className='col-md-6'>
              <div className='input-group' style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <span className='input-group-text bg-white border-end-0' style={{ borderColor: '#e2e8f0' }}>
                  <i className='ri-search-line'></i>
                </span>
                <input
                  type='text'
                  className='form-control border-start-0 ps-0'
                  placeholder='Search lead sources...'
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    borderColor: '#e2e8f0',
                    boxShadow: 'none',
                  }}
                />
              </div>
            </div>
          </div>

          {/* Tab Buttons */}
          <div className='mb-4'>
            <div className='btn-group border border-dark-1' role='group'>
              <button
                type='button'
                className='btn btn-sm m-1 rounded-2 fs-13'
                onClick={() => { setActiveTab('installed'); history.replace('?tab=installed'); }}
                style={{
                  backgroundColor: activeTab === 'installed' ? '#3b82f6' : '#f8fafc',
                  color: activeTab === 'installed' ? 'white' : '#64748b',
                  transition: 'all 0.2s',
                }}
              >
                Installed ({pagination.total})
              </button>
              <button
                type='button'
                className='btn btn-sm m-1 rounded-2 fs-13'
                onClick={() => { setActiveTab('all'); history.replace('?tab=all'); }}
                style={{
                  backgroundColor: activeTab === 'all' ? '#3b82f6' : '#f8fafc',
                  color: activeTab === 'all' ? 'white' : '#64748b',
                  transition: 'all 0.2s',
                }}
              >
                All Lead Sources ({allSources.length})
              </button>
            </div>
          </div>

          {/* Installed Tab Content */}
          {activeTab === 'installed' && (
            <div>
              {loading ? (
                <div className='text-center py-5'>
                  <Spinner color='primary' />
                  <p className='text-muted mt-2'>Loading connections...</p>
                </div>
              ) : connections.length === 0 ? (
                <div className='text-center py-5'>
                  <p className='text-muted'>No installed lead sources found</p>
                </div>
              ) : (
                <>
                  <div className='row g-4'>
                    {connections.map((connection) => (
                      <ConnectionCard
                        key={connection._id || connection.id}
                        connection={connection}
                        icon={getSourceIcon(connection)}
                        onConfigure={handleConfigure}
                        onFieldMapping={handleMappingClick}
                        onLogs={handleLogsClick}
                        onSyncLeads={handleSyncLeads}
                        onToggleStatus={handleToggleStatusClick}
                        onDelete={handleDeleteClick}
                      />
                    ))}
                  </div>

                  {/* Pagination */}
                  {pagination.totalPages > 1 && (
                    <div className='d-flex justify-content-between align-items-center mt-4'>
                      <p className='text-muted mb-0' style={{ fontSize: '0.85rem' }}>
                        Showing {(currentPage - 1) * pagination.limit + 1} - {Math.min(currentPage * pagination.limit, pagination.total)} of{' '}
                        {pagination.total} connections
                      </p>
                      <ul className='pagination pagination-sm mb-0'>
                        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                          <button className='page-link' onClick={() => setCurrentPage(1)}>
                            <i className='ri-skip-back-mini-line'></i>
                          </button>
                        </li>
                        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                          <button className='page-link' onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}>
                            <i className='ri-arrow-left-s-line'></i>
                          </button>
                        </li>
                        {(() => {
                          const pages = [];
                          const maxVisible = 5;
                          let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
                          let endPage = Math.min(pagination.totalPages, startPage + maxVisible - 1);
                          if (endPage - startPage + 1 < maxVisible) {
                            startPage = Math.max(1, endPage - maxVisible + 1);
                          }
                          if (startPage > 1) {
                            pages.push(
                              <li key='start-dots' className='page-item disabled'>
                                <span className='page-link'>...</span>
                              </li>,
                            );
                          }
                          for (let i = startPage; i <= endPage; i++) {
                            pages.push(
                              <li key={i} className={`page-item ${currentPage === i ? 'active' : ''}`}>
                                <button className='page-link' onClick={() => setCurrentPage(i)}>
                                  {i}
                                </button>
                              </li>,
                            );
                          }
                          if (endPage < pagination.totalPages) {
                            pages.push(
                              <li key='end-dots' className='page-item disabled'>
                                <span className='page-link'>...</span>
                              </li>,
                            );
                          }
                          return pages;
                        })()}
                        <li className={`page-item ${currentPage === pagination.totalPages ? 'disabled' : ''}`}>
                          <button className='page-link' onClick={() => setCurrentPage((p) => Math.min(pagination.totalPages, p + 1))}>
                            <i className='ri-arrow-right-s-line'></i>
                          </button>
                        </li>
                        <li className={`page-item ${currentPage === pagination.totalPages ? 'disabled' : ''}`}>
                          <button className='page-link' onClick={() => setCurrentPage(pagination.totalPages)}>
                            <i className='ri-skip-forward-mini-line'></i>
                          </button>
                        </li>
                      </ul>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* All Lead Sources Tab Content */}
          {activeTab === 'all' && (
            <div className='row g-4'>
              {filteredAll.length === 0 ? (
                <div className='col-12'>
                  <div className='text-center py-5'>
                    <p className='text-muted'>No lead sources found</p>
                  </div>
                </div>
              ) : (
                filteredAll.map((source) => (
                  <div key={source.id} className='col-md-6 col-lg-4 col-xl-3'>
                    <div
                      className='card border border-dark-1 mb-1'
                      style={{
                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                        transition: 'all 0.2s',
                        cursor: 'pointer',
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
                            {source.icon}
                          </div>
                          <div className='flex-grow-1'>
                            <h6 className='card-title mb-1' style={{ color: '#1e293b', fontWeight: '600', fontSize: '0.95rem' }}>
                              {source.name}
                            </h6>
                            <span
                              className='badge'
                              style={{
                                backgroundColor: '#939393ff',
                                color: 'white',
                                fontSize: '0.7rem',
                                fontWeight: '500',
                                padding: '0.15rem 0.5rem',
                              }}
                            >
                              {source.version}
                            </span>
                          </div>
                        </div>
                        <p className='card-text text-muted mb-2' style={{ fontSize: '0.8rem', lineHeight: '1.4' }}>
                          {source.description}
                        </p>
                        <div className='d-flex flex-wrap align-items-center gap-1'>
                          {source.isConnectShow ? (
                            <>
                              <button
                                className='btn btn-sm btn-outline-primary d-flex align-items-center gap-1 border border-dark-1'
                                style={{ paddingTop: '6px', paddingBottom: '6px' }}
                                onClick={() => handleCreateNewConnection(source)}
                              >
                                <BsGearWideConnected />
                                <span>Create Connection</span>
                              </button>
                              <UncontrolledDropdown>
                                <DropdownToggle
                                  href='#'
                                  className='mx-0 px-2 d-flex align-items-center btn btn-sm btn-outline-primary gap-1 py-1 border border-dark-1'
                                  tag='button'
                                >
                                  <i className='bx bx-file fs-15 btn btn-sm m-0 p-0'></i>
                                  <span>Documentation</span>
                                </DropdownToggle>
                                <DropdownMenu className='dropdown-menu-end'>
                                  <DropdownItem className='dropdown-item d-flex align-items-center gap-2' href='#'>
                                    <FaYoutube />
                                    <span>Tutorial</span>
                                  </DropdownItem>
                                  <DropdownItem
                                    className='dropdown-item d-flex align-items-center gap-2'
                                    href='#'
                                    onClick={() => window.open(`/leadsource/settings/docs/${source.key}`, '_blank')}
                                  >
                                    <FiExternalLink />
                                    <span>Documentation</span>
                                  </DropdownItem>
                                </DropdownMenu>
                              </UncontrolledDropdown>
                            </>
                          ) : (
                            <div
                              className='text-muted fw-medium py-2'
                              style={{
                                fontSize: '0.85rem',
                                letterSpacing: '0.5px',
                                textTransform: 'uppercase'
                              }}
                            >
                              Coming Soon
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
          {/* Configure Modal */}
          <ConfigureModal
            isOpen={configureOpen}
            toggle={() => {
              setConfigureOpen(false);
              setSelectedConnection(null);
            }}
            connection={selectedConnection}
            onSave={handleConfigureSave}
          />

          {/* Field Mapping Modal */}
          <FieldMappingModal
            isOpen={mappingOpen}
            toggle={() => {
              setMappingOpen(false);
              setSelectedConnection(null);
            }}
            connection={selectedConnection}
          />

          {/* Delete Confirm Modal */}
          <DeleteConfirmModal
            isOpen={deleteOpen}
            toggle={() => {
              setDeleteOpen(false);
              setSelectedConnection(null);
            }}
            connection={selectedConnection}
            onConfirm={handleDeleteConfirm}
          />

          {/* Status Toggle Modal */}
          <StatusToggleModal
            isOpen={statusToggleOpen}
            toggle={() => {
              setStatusToggleOpen(false);
              setSelectedConnection(null);
            }}
            connection={selectedConnection}
            onConfirm={handleToggleStatusConfirm}
          />

          {/* Phone Contact Creation Modal */}
          <PhoneContactModal
            isOpen={phoneModalOpen}
            toggle={() => setPhoneModalOpen(false)}
            onSuccess={handleConnectionCreated}
          />

          {/* Contact Book Creation Modal */}
          <ContactBookModal
            isOpen={contactBookModalOpen}
            toggle={() => setContactBookModalOpen(false)}
            onSuccess={handleConnectionCreated}
          />

          {/* OCR App Creation Modal */}
          <OcrAppModal
            isOpen={ocrModalOpen}
            toggle={() => setOcrModalOpen(false)}
            onSuccess={handleConnectionCreated}
          />

          {/* Generic Webhook Creation Modal */}
          <WebhookCreationModal
            isOpen={webhookModalOpen}
            toggle={() => setWebhookModalOpen(false)}
            onSuccess={handleConnectionCreated}
          />

          {/* Google Forms Creation Modal */}
          <GoogleFormsModal
            isOpen={googleFormsModalOpen}
            toggle={() => setGoogleFormsModalOpen(false)}
            onSuccess={handleConnectionCreated}
          />

          {/* JotForm Creation Modal */}
          <JotFormModal
            isOpen={jotFormModalOpen}
            toggle={() => setJotFormModalOpen(false)}
            onSuccess={handleConnectionCreated}
          />

          {/* Contact Form 7 Creation Modal */}
          <ContactForm7Modal
            isOpen={cf7ModalOpen}
            toggle={() => setCf7ModalOpen(false)}
            onSuccess={handleConnectionCreated}
          />

          {/* Facebook Lead Ads Modal */}
          <FacebookLeadAdsModal
            isOpen={showModal}
            toggle={() => setShowModal(false)}
            modalUrl={modalUrl}
          />
        </Container>
        {loading && <Preloader />}
      </div>
    </React.Fragment>
  );
};

LeadSources.propTypes = {
  location: PropTypes.object,
  t: PropTypes.any,
};

export default withRouter(withTranslation()(LeadSources));

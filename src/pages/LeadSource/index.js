import React, { useState, useEffect, useCallback } from 'react';
import { withRouter } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import {
  Container,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Spinner,
  Alert,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';
import { FcBusinessContact } from "react-icons/fc";
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
  connectGenericWebhook,
  connectPhoneContact,
  connectGoogleForms,
  getGoogleFormsAppsScript,
  connectJotForm,
  connectContactForm7,
  deleteHubspotConnection
} from '../../helpers/backend_helper';
import ConfigureModal from './ConfigureModal';
import DeleteConfirmModal from './DeleteConfirmModal';
import LogsModal from './LogsModal';
import FieldMappingModal from './FieldMappingModal';
import ConnectionCard from './ConnectionCard';

//icons
import { FaMeta } from 'react-icons/fa6';
import { MdOutlineWebhook } from 'react-icons/md';
import { SiGoogleads } from 'react-icons/si';
import { SiLinkedin } from 'react-icons/si';
import { SiTypeform } from 'react-icons/si';
import { CgWebsite } from 'react-icons/cg';
import { SiGoogleforms } from 'react-icons/si';
import { FaYoutube } from 'react-icons/fa';
import { FiExternalLink, FiCopy, FiCheck } from 'react-icons/fi';
import { BsGearWideConnected } from 'react-icons/bs';
import { ImMobile } from 'react-icons/im';
import { IoQrCodeOutline } from 'react-icons/io5';
import { SiZoho } from 'react-icons/si';
import { FaHubspot } from 'react-icons/fa';
import { LiaSalesforce } from 'react-icons/lia';
import { FaIndustry } from 'react-icons/fa';
import { FaHandshake } from 'react-icons/fa';
import { BsBuildingsFill } from 'react-icons/bs';
import { MdRestaurant } from 'react-icons/md';
import { RiSurveyLine } from 'react-icons/ri';
import { getSessionToken } from '../../helpers/backend_helper';
import Preloader from '../../Components/Loaders/Preloader';

const sourceIconMap = {
  // camelCase keys (used in allSources)
  facebookLeadAds: <FaMeta />,
  webhook: <MdOutlineWebhook />,
  form: <SiGoogleforms />,
  googleForm: <SiGoogleforms />,
  typeform: <SiTypeform />,
  googleAds: <SiGoogleads />,
  linkedinLeadGen: <SiLinkedin />,
  landingPage: <CgWebsite />,
  phoneContact: <ImMobile />,
  ocrApp: <IoQrCodeOutline />,
  zohoCrm: <SiZoho />,
  hubspotCrm: <FaHubspot />,
  salesforce: <LiaSalesforce />,
  indiaMart: <FaIndustry />,
  tradeIndia: <FaHandshake />,
  magicBricks: <BsBuildingsFill />,
  zomato: <MdRestaurant />,
  generic_webhook: <MdOutlineWebhook />,
  genericWebhook: <MdOutlineWebhook />,
  jotForm: <RiSurveyLine />,
  jotform: <RiSurveyLine />,
  contactform7: <FcBusinessContact />,
  // provider keys (returned from API)
  facebook_leadgen: <FaMeta />,
  google_forms: <SiGoogleforms />,
  google_ads: <SiGoogleads />,
  linkedin_leadgen: <SiLinkedin />,
  landing_page: <CgWebsite />,
  phone_contact: <ImMobile />,
  ocr_app: <IoQrCodeOutline />,
  zoho: <SiZoho />,
  zoho_crm: <SiZoho />,
  hubspot: <FaHubspot />,
  indiamart: <FaIndustry />,
  trade_india: <FaHandshake />,
  magic_bricks: <BsBuildingsFill />,
};

const getSourceIcon = (connection) => {
  return sourceIconMap[connection.provider] || sourceIconMap[connection.source] || sourceIconMap[connection.key] || <BsGearWideConnected />;
};

const LeadSources = (props) => {
  const history = useHistory();

  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalUrl, setModalUrl] = useState('');

  // Configure, Delete, Logs & Mapping modal state
  const [configureOpen, setConfigureOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [logsOpen, setLogsOpen] = useState(false);
  const [mappingOpen, setMappingOpen] = useState(false);
  const [selectedConnection, setSelectedConnection] = useState(null);

  // Generic Webhook creation modal state
  const [webhookModalOpen, setWebhookModalOpen] = useState(false);
  const [webhookName, setWebhookName] = useState('');
  const [webhookType, setWebhookType] = useState('');
  const [webhookCreating, setWebhookCreating] = useState(false);
  const [webhookResult, setWebhookResult] = useState(null);
  const [webhookError, setWebhookError] = useState('');
  const [webhookCopied, setWebhookCopied] = useState(false);

  // Phone Contact creation modal state
  const [phoneModalOpen, setPhoneModalOpen] = useState(false);
  const [phoneName, setPhoneName] = useState('');
  const [phoneCreating, setPhoneCreating] = useState(false);
  const [phoneError, setPhoneError] = useState('');

  // Google Forms creation modal state
  const [googleFormsModalOpen, setGoogleFormsModalOpen] = useState(false);
  const [googleFormsName, setGoogleFormsName] = useState('');
  const [googleFormsCreating, setGoogleFormsCreating] = useState(false);
  const [googleFormsResult, setGoogleFormsResult] = useState(null);
  const [googleFormsError, setGoogleFormsError] = useState('');
  const [googleFormsCopiedUrl, setGoogleFormsCopiedUrl] = useState(false);
  const [googleFormsCopiedScript, setGoogleFormsCopiedScript] = useState(false);

  // JotForm creation modal state
  const [jotFormModalOpen, setJotFormModalOpen] = useState(false);
  const [jotFormName, setJotFormName] = useState('');
  const [jotFormCreating, setJotFormCreating] = useState(false);
  const [jotFormResult, setJotFormResult] = useState(null);
  const [jotFormError, setJotFormError] = useState('');
  const [jotFormCopied, setJotFormCopied] = useState(false);

  // Contact Form 7 creation modal state
  const [cf7ModalOpen, setCf7ModalOpen] = useState(false);
  const [cf7Name, setCf7Name] = useState('');
  const [cf7Creating, setCf7Creating] = useState(false);
  const [cf7Result, setCf7Result] = useState(null);
  const [cf7Error, setCf7Error] = useState('');
  const [cf7Copied, setCf7Copied] = useState(false);

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
      icon: <FaMeta />,
      isConnectShow: true,
      description: 'Capture leads directly from Facebook ads',
    },
    {
      id: 2,
      version: '0.0.1',
      name: 'Webhook',
      key: 'webhooks',
      isConnectShow: true,
      icon: <MdOutlineWebhook />,
      description: 'Receive leads via custom webhook',
    },
    {
      id: 3,
      version: '0.0.1',
      name: 'Google Form',
      key: 'googleForm',
      isConnectShow: true,
      icon: <SiGoogleforms />,
      description: 'Sync leads from Google Forms',
    },
    {
      id: 16,
      version: '0.0.1',
      name: 'JotForm',
      key: 'jotForm',
      isConnectShow: true,
      icon: <RiSurveyLine />,
      description: 'Capture leads from JotForm submissions',
    },
    {
      id: 4,
      version: '0.0.1',
      name: 'Typeform',
      key: 'typeform',
      isConnectShow: true,
      icon: <SiTypeform />,
      description: 'Connect with Typeform responses',
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
    {
      id: 8,
      version: '0.0.1',
      name: 'Phone Contact',
      key: 'phoneContact',
      isConnectShow: false,
      icon: <ImMobile />,
      description: 'Import leads from phone contacts',
    },
    {
      id: 9,
      version: '0.0.1',
      name: 'OCR App',
      key: 'ocrApp',
      isConnectShow: false,
      icon: <IoQrCodeOutline />,
      description: 'Scan and capture leads via OCR',
    },
    {
      id: 10,
      version: '0.0.1',
      name: 'Zoho CRM',
      key: 'zohoCrm',
      isConnectShow: true,
      icon: <SiZoho />,
      description: 'Sync leads from Zoho CRM',
    },
    {
      id: 11,
      version: '0.0.1',
      name: 'Hubspot CRM',
      key: 'hubspotCrm',
      isConnectShow: true,
      icon: <FaHubspot />,
      description: 'Sync leads from Hubspot CRM',
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
      id: 13,
      version: '0.0.1',
      name: 'India Mart',
      key: 'indiaMart',
      isConnectShow: true,
      icon: <FaIndustry />,
      description: 'Capture leads from IndiaMART enquiries',
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
      id: 17,
      version: '0.0.1',
      name: 'Contact Form 7',
      key: 'contactform7',
      isConnectShow: true,
      icon: <FcBusinessContact />,
      description: 'Capture leads from WordPress Contact Form 7',
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

  const handleLogsClick = (connection) => {
    setSelectedConnection(connection);
    setLogsOpen(true);
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
    } else if (provider === 'phone_contact' || provider === 'phoneContact') {
      await deletePhoneContactConnection(id);
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
        setWebhookName('');
        setWebhookType('');
        setWebhookResult(null);
        setWebhookError('');
        setWebhookCopied(false);
        setWebhookModalOpen(true);
        break;
      }
      case 'phoneContact': {
        setPhoneName('');
        setPhoneError('');
        setPhoneModalOpen(true);
        break;
      }
      case 'googleForm': {
        setGoogleFormsName('');
        setGoogleFormsError('');
        setGoogleFormsResult(null);
        setGoogleFormsCopiedUrl(false);
        setGoogleFormsCopiedScript(false);
        setGoogleFormsModalOpen(true);
        break;
      }
      case 'jotForm': {
        setJotFormName('');
        setJotFormError('');
        setJotFormResult(null);
        setJotFormCopied(false);
        setJotFormModalOpen(true);
        break;
      }
      case 'contactform7': {
        setCf7Name('');
        setCf7Error('');
        setCf7Result(null);
        setCf7Copied(false);
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
              if (hubspotPopup.location.href && hubspotPopup.location.href.includes('hubspot=success')) {
                clearInterval(pollTimer);
                hubspotPopup.close();
                fetchConnections(currentPage);
              }
            } catch (e) {
              // Cross-origin — ignore until redirect back to same origin or popup closes
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

  const handleCreateWebhook = async () => {
    if (!webhookName.trim()) {
      setWebhookError('Please enter a connection name.');
      return;
    }
    setWebhookCreating(true);
    setWebhookError('');
    try {
      const res = await connectGenericWebhook({
        type: webhookType.trim() || 'generic',
        name: webhookName.trim(),
      });
      setWebhookResult(res.data || res);
      fetchConnections(currentPage);
    } catch (err) {
      setWebhookError(err?.msg || err?.response?.data?.msg || 'Failed to create webhook connection.');
    } finally {
      setWebhookCreating(false);
    }
  };

  const handleCopyWebhookUrl = () => {
    const url = webhookResult?.webhookUrl;
    if (!url) return;
    navigator.clipboard.writeText(url).then(() => {
      setWebhookCopied(true);
      setTimeout(() => setWebhookCopied(false), 2000);
    });
  };

  const handleCreatePhoneContact = async () => {
    if (!phoneName.trim()) {
      setPhoneError('Please enter a connection name.');
      return;
    }
    setPhoneCreating(true);
    setPhoneError('');
    try {
      await connectPhoneContact({ name: phoneName.trim() });
      setPhoneModalOpen(false);
      fetchConnections(currentPage);
    } catch (err) {
      setPhoneError(err?.msg || err?.response?.data?.msg || 'Failed to create phone contact connection.');
    } finally {
      setPhoneCreating(false);
    }
  };

  const handleCreateGoogleForms = async () => {
    if (!googleFormsName.trim()) {
      setGoogleFormsError('Please enter a connection name.');
      return;
    }
    setGoogleFormsCreating(true);
    setGoogleFormsError('');
    try {
      const res = await connectGoogleForms({ name: googleFormsName.trim() });
      const connectionData = res.data || res;
      const connectionId = connectionData?._id || connectionData?.id || connectionData?.connectionId;

      // Fetch Apps Script code using the new connection ID
      let appsScript = connectionData?.appsScript || '';
      if (!appsScript && connectionId) {
        try {
          const scriptRes = await getGoogleFormsAppsScript(connectionId);
          appsScript = scriptRes?.data?.script || scriptRes?.script || scriptRes?.data?.appsScript || scriptRes?.appsScript || '';
        } catch (e) {
          console.error('Failed to fetch Apps Script:', e);
        }
      }

      setGoogleFormsResult({ ...connectionData, appsScript });
      fetchConnections(currentPage);
    } catch (err) {
      setGoogleFormsError(err?.msg || err?.response?.data?.msg || 'Failed to create Google Forms connection.');
    } finally {
      setGoogleFormsCreating(false);
    }
  };

  const handleCopyGoogleFormsUrl = () => {
    const url = googleFormsResult?.webhookUrl;
    if (!url) return;
    navigator.clipboard.writeText(url).then(() => {
      setGoogleFormsCopiedUrl(true);
      setTimeout(() => setGoogleFormsCopiedUrl(false), 2000);
    });
  };

  const handleCopyGoogleFormsScript = () => {
    const script = googleFormsResult?.appsScript;
    if (!script) return;
    navigator.clipboard.writeText(script).then(() => {
      setGoogleFormsCopiedScript(true);
      setTimeout(() => setGoogleFormsCopiedScript(false), 2000);
    });
  };

  const handleCreateJotForm = async () => {
    if (!jotFormName.trim()) {
      setJotFormError('Please enter a connection name.');
      return;
    }
    setJotFormCreating(true);
    setJotFormError('');
    try {
      const res = await connectJotForm({ name: jotFormName.trim() });
      setJotFormResult(res.data || res);
      fetchConnections(currentPage);
    } catch (err) {
      setJotFormError(err?.msg || err?.response?.data?.msg || 'Failed to create JotForm connection.');
    } finally {
      setJotFormCreating(false);
    }
  };

  const handleCopyJotFormUrl = () => {
    const url = jotFormResult?.webhookUrl;
    if (!url) return;
    navigator.clipboard.writeText(url).then(() => {
      setJotFormCopied(true);
      setTimeout(() => setJotFormCopied(false), 2000);
    });
  };

  const handleCreateContactForm7 = async () => {
    if (!cf7Name.trim()) {
      setCf7Error('Please enter a connection name.');
      return;
    }
    setCf7Creating(true);
    setCf7Error('');
    try {
      const res = await connectContactForm7({ name: cf7Name.trim() });
      setCf7Result(res.data || res);
      fetchConnections(currentPage);
    } catch (err) {
      setCf7Error(err?.msg || err?.response?.data?.msg || 'Failed to create Contact Form 7 connection.');
    } finally {
      setCf7Creating(false);
    }
  };

  const handleCopyCf7Url = () => {
    const url = cf7Result?.webhookUrl;
    if (!url) return;
    navigator.clipboard.writeText(url).then(() => {
      setCf7Copied(true);
      setTimeout(() => setCf7Copied(false), 2000);
    });
  };

  return (
    <React.Fragment>
      <div className='page-content'>
        <MetaTag pageTitle='CRM - Lead Source' />
        <Container fluid>
          <BreadCrumb title='Lead Source' pageTitle='CRM' />
          {/* Search Bar */}
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
                onClick={() => setActiveTab('installed')}
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
                onClick={() => setActiveTab('all')}
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

          {/* Logs Modal */}
          <LogsModal
            isOpen={logsOpen}
            toggle={() => {
              setLogsOpen(false);
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

          {/* Phone Contact Creation Modal */}
          <Modal isOpen={phoneModalOpen} toggle={() => setPhoneModalOpen(false)} size='md' centered>
            <ModalHeader toggle={() => setPhoneModalOpen(false)}>
              <div className='d-flex align-items-center gap-2'>
                <ImMobile style={{ color: '#f59e0b' }} />
                <span>Create Phone Contact Connection</span>
              </div>
            </ModalHeader>
            <ModalBody>
              {phoneError && (
                <Alert color='danger' className='mb-3' style={{ fontSize: '0.85rem' }} toggle={() => setPhoneError('')}>
                  {phoneError}
                </Alert>
              )}
              <div className='mb-3'>
                <label className='form-label fw-medium'>
                  Connection Name <span className='text-danger'>*</span>
                </label>
                <input
                  type='text'
                  className='form-control'
                  placeholder='e.g. My Phone Contacts'
                  value={phoneName}
                  onChange={(e) => setPhoneName(e.target.value)}
                />
              </div>
              <div className='p-3 rounded' style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}>
                <p className='mb-0' style={{ fontSize: '0.8rem', color: '#64748b' }}>
                  After creating the connection, use the Configure button to upload a VCF file or sync contacts via JSON.
                </p>
              </div>
            </ModalBody>
            <ModalFooter>
              <button className='btn btn-sm btn-soft-danger' onClick={() => setPhoneModalOpen(false)}>
                Cancel
              </button>
              <button
                className='btn btn-sm btn-primary d-flex align-items-center gap-2'
                onClick={handleCreatePhoneContact}
                disabled={phoneCreating || !phoneName.trim()}
              >
                {phoneCreating && <span className='spinner-border spinner-border-sm' role='status' aria-hidden='true'></span>}
                <span>{phoneCreating ? 'Creating...' : 'Create Connection'}</span>
              </button>
            </ModalFooter>
          </Modal>

          {/* Generic Webhook Creation Modal */}
          <Modal
            isOpen={webhookModalOpen}
            toggle={() => {
              setWebhookModalOpen(false);
              setWebhookResult(null);
            }}
            size='md'
            centered
          >
            <ModalHeader
              toggle={() => {
                setWebhookModalOpen(false);
                setWebhookResult(null);
              }}
            >
              <div className='d-flex align-items-center gap-2'>
                <MdOutlineWebhook style={{ color: '#6366f1' }} />
                <span>Create Webhook Connection</span>
              </div>
            </ModalHeader>
            <ModalBody>
              {webhookError && (
                <Alert color='danger' className='mb-3' style={{ fontSize: '0.85rem' }} toggle={() => setWebhookError('')}>
                  {webhookError}
                </Alert>
              )}

              {webhookResult ? (
                <>
                  <Alert color='success' className='mb-3' style={{ fontSize: '0.85rem' }}>
                    Webhook connection created successfully!
                  </Alert>
                  <div className='p-3 rounded mb-3' style={{ backgroundColor: '#fefce8', border: '1px solid #fde68a' }}>
                    <div className='fw-medium mb-2' style={{ fontSize: '0.83rem', color: '#a16207' }}>
                      Your Inbound Webhook URL
                    </div>
                    <div className='d-flex align-items-center gap-2'>
                      <code
                        className='flex-grow-1 p-2 rounded'
                        style={{
                          fontSize: '0.75rem',
                          backgroundColor: '#fff',
                          border: '1px solid #e2e8f0',
                          wordBreak: 'break-all',
                          display: 'block',
                        }}
                      >
                        {webhookResult.webhookUrl}
                      </code>
                      <button
                        className='btn btn-sm btn-outline-primary d-flex align-items-center'
                        onClick={handleCopyWebhookUrl}
                        title='Copy URL'
                        style={{ minWidth: '36px' }}
                      >
                        {webhookCopied ? <FiCheck size={14} /> : <FiCopy size={14} />}
                      </button>
                    </div>
                    <p className='mb-0 mt-2' style={{ fontSize: '0.75rem', color: '#64748b' }}>
                      Send a POST request with JSON lead data to this URL to ingest leads automatically.
                    </p>
                  </div>
                  <div className='p-3 rounded' style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}>
                    <div className='fw-medium mb-2' style={{ fontSize: '0.83rem', color: '#475569' }}>
                      Sample Request
                    </div>
                    <pre
                      style={{
                        fontSize: '0.73rem',
                        backgroundColor: '#1e293b',
                        color: '#e2e8f0',
                        padding: '10px',
                        borderRadius: '6px',
                        margin: 0,
                        whiteSpace: 'pre-wrap',
                      }}
                    >
                      {`POST ${webhookResult.webhookUrl}
                        Content-Type: application/json
                        {
                          "name": "John Doe",
                          "email": "john@example.com",
                          "phone": "555-1234"
                        }`
                      }
                    </pre>
                  </div>
                </>
              ) : (
                <>
                  <div className='mb-3'>
                    <label className='form-label fw-medium'>
                      Connection Name <span className='text-danger'>*</span>
                    </label>
                    <input
                      type='text'
                      className='form-control'
                      placeholder='e.g. My Google Sheet Webhook'
                      value={webhookName}
                      onChange={(e) => setWebhookName(e.target.value)}
                    />
                  </div>
                  <div className='mb-3'>
                    <label className='form-label fw-medium'>
                      Type <span className='text-muted fw-normal'>(optional)</span>
                    </label>
                    <input
                      type='text'
                      className='form-control'
                      placeholder='e.g. googlesheet, zapier, custom'
                      value={webhookType}
                      onChange={(e) => setWebhookType(e.target.value)}
                    />
                    <small className='text-muted'>A label to identify the source type. Leave blank for "generic".</small>
                  </div>
                </>
              )}
            </ModalBody>
            <ModalFooter>
              {webhookResult ? (
                <button
                  className='btn btn-sm btn-primary'
                  onClick={() => {
                    setWebhookModalOpen(false);
                    setWebhookResult(null);
                  }}
                >
                  Done
                </button>
              ) : (
                <>
                  <button className='btn btn-sm btn-soft-danger' onClick={() => setWebhookModalOpen(false)}>
                    Cancel
                  </button>
                  <button
                    className='btn btn-sm btn-primary d-flex align-items-center gap-2'
                    onClick={handleCreateWebhook}
                    disabled={webhookCreating || !webhookName.trim()}
                  >
                    {webhookCreating && <span className='spinner-border spinner-border-sm' role='status' aria-hidden='true'></span>}
                    <span>{webhookCreating ? 'Creating...' : 'Create Webhook'}</span>
                  </button>
                </>
              )}
            </ModalFooter>
          </Modal>

          {/* Google Forms Creation Modal */}
          <Modal
            isOpen={googleFormsModalOpen}
            toggle={() => {
              setGoogleFormsModalOpen(false);
              setGoogleFormsResult(null);
            }}
            size='md'
            centered
          >
            <ModalHeader
              toggle={() => {
                setGoogleFormsModalOpen(false);
                setGoogleFormsResult(null);
              }}
            >
              <div className='d-flex align-items-center gap-2'>
                <SiGoogleforms style={{ color: '#673ab7' }} />
                <span>Create Google Forms Connection</span>
              </div>
            </ModalHeader>
            <ModalBody>
              {googleFormsError && (
                <Alert color='danger' className='mb-3' style={{ fontSize: '0.85rem' }} toggle={() => setGoogleFormsError('')}>
                  {googleFormsError}
                </Alert>
              )}

              {googleFormsResult ? (
                <>
                  <Alert color='success' className='mb-3' style={{ fontSize: '0.85rem' }}>
                    Google Forms connection created successfully!
                  </Alert>

                  {/* Webhook URL */}
                  {googleFormsResult.webhookUrl && (
                    <div className='p-3 rounded mb-3' style={{ backgroundColor: '#fefce8', border: '1px solid #fde68a' }}>
                      <div className='fw-medium mb-2' style={{ fontSize: '0.83rem', color: '#a16207' }}>
                        Your Inbound Webhook URL
                      </div>
                      <div className='d-flex align-items-center gap-2'>
                        <code
                          className='flex-grow-1 p-2 rounded'
                          style={{
                            fontSize: '0.75rem',
                            backgroundColor: '#fff',
                            border: '1px solid #e2e8f0',
                            wordBreak: 'break-all',
                            display: 'block',
                          }}
                        >
                          {googleFormsResult.webhookUrl}
                        </code>
                        <button
                          className='btn btn-sm btn-outline-primary d-flex align-items-center'
                          onClick={handleCopyGoogleFormsUrl}
                          title='Copy URL'
                          style={{ minWidth: '36px' }}
                        >
                          {googleFormsCopiedUrl ? <FiCheck size={14} /> : <FiCopy size={14} />}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Apps Script */}
                  {googleFormsResult.appsScript && (
                    <div className='p-3 rounded mb-3' style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}>
                      <div className='d-flex align-items-center justify-content-between mb-2'>
                        <div className='fw-medium' style={{ fontSize: '0.83rem', color: '#475569' }}>
                          Google Apps Script
                        </div>
                        <button
                          className='btn btn-sm btn-outline-secondary d-flex align-items-center gap-1'
                          onClick={handleCopyGoogleFormsScript}
                          style={{ fontSize: '0.75rem' }}
                        >
                          {googleFormsCopiedScript ? <FiCheck size={14} /> : <FiCopy size={14} />}
                          <span>{googleFormsCopiedScript ? 'Copied!' : 'Copy Script'}</span>
                        </button>
                      </div>
                      <pre
                        style={{
                          fontSize: '0.73rem',
                          backgroundColor: '#1e293b',
                          color: '#e2e8f0',
                          padding: '12px',
                          borderRadius: '6px',
                          margin: 0,
                          whiteSpace: 'pre-wrap',
                          maxHeight: '200px',
                          overflowY: 'auto',
                        }}
                      >
                        {googleFormsResult.appsScript}
                      </pre>
                    </div>
                  )}

                  {/* Setup Instructions */}
                  <div className='p-3 rounded' style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}>
                    <div className='fw-medium mb-2' style={{ fontSize: '0.83rem', color: '#475569' }}>
                      Setup Instructions
                    </div>
                    <ol className='mb-0 ps-3' style={{ fontSize: '0.8rem', color: '#64748b' }}>
                      <li className='mb-1'>Open your Google Form in edit mode</li>
                      <li className='mb-1'>Click the three-dot menu and select "Script editor"</li>
                      <li className='mb-1'>Replace the default code with the Apps Script above</li>
                      <li className='mb-1'>Save the script and set up a trigger for "onFormSubmit"</li>
                      <li>Form responses will automatically be sent as leads</li>
                    </ol>
                  </div>
                </>
              ) : (
                <>
                  <div className='mb-3'>
                    <label className='form-label fw-medium'>
                      Connection Name <span className='text-danger'>*</span>
                    </label>
                    <input
                      type='text'
                      className='form-control'
                      placeholder='e.g. My Google Form Leads'
                      value={googleFormsName}
                      onChange={(e) => setGoogleFormsName(e.target.value)}
                    />
                  </div>
                  <div className='p-3 rounded' style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}>
                    <p className='mb-0' style={{ fontSize: '0.8rem', color: '#64748b' }}>
                      After creating the connection, you will receive a webhook URL and an Apps Script code to paste into your Google Form's
                      script editor.
                    </p>
                  </div>
                </>
              )}
            </ModalBody>
            <ModalFooter>
              {googleFormsResult ? (
                <button
                  className='btn btn-sm btn-primary'
                  onClick={() => {
                    setGoogleFormsModalOpen(false);
                    setGoogleFormsResult(null);
                  }}
                >
                  Done
                </button>
              ) : (
                <>
                  <button className='btn btn-sm btn-soft-danger' onClick={() => setGoogleFormsModalOpen(false)}>
                    Cancel
                  </button>
                  <button
                    className='btn btn-sm btn-primary d-flex align-items-center gap-2'
                    onClick={handleCreateGoogleForms}
                    disabled={googleFormsCreating || !googleFormsName.trim()}
                  >
                    {googleFormsCreating && <span className='spinner-border spinner-border-sm' role='status' aria-hidden='true'></span>}
                    <span>{googleFormsCreating ? 'Creating...' : 'Create Connection'}</span>
                  </button>
                </>
              )}
            </ModalFooter>
          </Modal>

          {/* JotForm Creation Modal */}
          <Modal isOpen={jotFormModalOpen} toggle={() => { setJotFormModalOpen(false); setJotFormResult(null); }} size='md' centered>
            <ModalHeader toggle={() => { setJotFormModalOpen(false); setJotFormResult(null); }}>
              <div className='d-flex align-items-center gap-2'>
                <RiSurveyLine style={{ color: '#FF6100' }} />
                <span>Create JotForm Connection</span>
              </div>
            </ModalHeader>
            <ModalBody>
              {jotFormError && (
                <Alert color='danger' className='mb-3' style={{ fontSize: '0.85rem' }} toggle={() => setJotFormError('')}>
                  {jotFormError}
                </Alert>
              )}

              {jotFormResult ? (
                <>
                  <Alert color='success' className='mb-3' style={{ fontSize: '0.85rem' }}>
                    JotForm connection created successfully!
                  </Alert>
                  {jotFormResult.webhookUrl && (
                    <div className='p-3 rounded mb-3' style={{ backgroundColor: '#fefce8', border: '1px solid #fde68a' }}>
                      <div className='fw-medium mb-2' style={{ fontSize: '0.83rem', color: '#a16207' }}>
                        Your Inbound Webhook URL
                      </div>
                      <div className='d-flex align-items-center gap-2'>
                        <code
                          className='flex-grow-1 p-2 rounded'
                          style={{
                            fontSize: '0.75rem',
                            backgroundColor: '#fff',
                            border: '1px solid #e2e8f0',
                            wordBreak: 'break-all',
                            display: 'block',
                          }}
                        >
                          {jotFormResult.webhookUrl}
                        </code>
                        <button
                          className='btn btn-sm btn-outline-primary d-flex align-items-center'
                          onClick={handleCopyJotFormUrl}
                          title='Copy URL'
                          style={{ minWidth: '36px' }}
                        >
                          {jotFormCopied ? <FiCheck size={14} /> : <FiCopy size={14} />}
                        </button>
                      </div>
                      <p className='mb-0 mt-2' style={{ fontSize: '0.75rem', color: '#64748b' }}>
                        Add this URL as a webhook in your JotForm form settings.
                      </p>
                    </div>
                  )}
                  <div className='p-3 rounded' style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}>
                    <div className='fw-medium mb-2' style={{ fontSize: '0.83rem', color: '#475569' }}>
                      Next Steps
                    </div>
                    <ol className='mb-0 ps-3' style={{ fontSize: '0.8rem', color: '#64748b' }}>
                      <li className='mb-1'>Open your form in JotForm</li>
                      <li className='mb-1'>Go to <strong>Settings</strong> &rarr; <strong>Integrations</strong></li>
                      <li className='mb-1'>Search for <strong>WebHooks</strong> and select it</li>
                      <li className='mb-1'>Paste the webhook URL above</li>
                      <li className='mb-1'>Click <strong>Complete Integration</strong></li>
                      <li>Submit a test response to verify</li>
                    </ol>
                  </div>
                </>
              ) : (
                <>
                  <div className='mb-3'>
                    <label className='form-label fw-medium'>Connection Name <span className='text-danger'>*</span></label>
                    <input
                      type='text'
                      className='form-control'
                      placeholder='e.g. My JotForm Leads'
                      value={jotFormName}
                      onChange={(e) => setJotFormName(e.target.value)}
                    />
                  </div>
                  <div className='p-3 rounded' style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}>
                    <p className='mb-0' style={{ fontSize: '0.8rem', color: '#64748b' }}>
                      After creating the connection, you will receive a webhook URL to add in your JotForm form's webhook integration settings.
                    </p>
                  </div>
                </>
              )}
            </ModalBody>
            <ModalFooter>
              {jotFormResult ? (
                <button className='btn btn-sm btn-primary' onClick={() => { setJotFormModalOpen(false); setJotFormResult(null); }}>
                  Done
                </button>
              ) : (
                <>
                  <button className='btn btn-sm btn-soft-danger' onClick={() => setJotFormModalOpen(false)}>
                    Cancel
                  </button>
                  <button
                    className='btn btn-sm btn-primary d-flex align-items-center gap-2'
                    onClick={handleCreateJotForm}
                    disabled={jotFormCreating || !jotFormName.trim()}
                  >
                    {jotFormCreating && <span className='spinner-border spinner-border-sm' role='status' aria-hidden='true'></span>}
                    <span>{jotFormCreating ? 'Creating...' : 'Create Connection'}</span>
                  </button>
                </>
              )}
            </ModalFooter>
          </Modal>

          {/* Contact Form 7 Creation Modal */}
          <Modal isOpen={cf7ModalOpen} toggle={() => { setCf7ModalOpen(false); setCf7Result(null); }} size='md' centered>
            <ModalHeader toggle={() => { setCf7ModalOpen(false); setCf7Result(null); }}>
              <div className='d-flex align-items-center gap-2'>
                <RiSurveyLine style={{ color: '#2563eb' }} />
                <span>Create Contact Form 7 Connection</span>
              </div>
            </ModalHeader>
            <ModalBody>
              {cf7Error && (
                <Alert color='danger' className='mb-3' style={{ fontSize: '0.85rem' }} toggle={() => setCf7Error('')}>
                  {cf7Error}
                </Alert>
              )}

              {cf7Result ? (
                <>
                  <Alert color='success' className='mb-3' style={{ fontSize: '0.85rem' }}>
                    Contact Form 7 connection created successfully!
                  </Alert>
                  {cf7Result.webhookUrl && (
                    <div className='p-3 rounded mb-3' style={{ backgroundColor: '#fefce8', border: '1px solid #fde68a' }}>
                      <div className='fw-medium mb-2' style={{ fontSize: '0.83rem', color: '#a16207' }}>
                        Your Inbound Webhook URL
                      </div>
                      <div className='d-flex align-items-center gap-2'>
                        <code
                          className='flex-grow-1 p-2 rounded'
                          style={{
                            fontSize: '0.75rem',
                            backgroundColor: '#fff',
                            border: '1px solid #e2e8f0',
                            wordBreak: 'break-all',
                            display: 'block',
                          }}
                        >
                          {cf7Result.webhookUrl}
                        </code>
                        <button
                          className='btn btn-sm btn-outline-primary d-flex align-items-center'
                          onClick={handleCopyCf7Url}
                          title='Copy URL'
                          style={{ minWidth: '36px' }}
                        >
                          {cf7Copied ? <FiCheck size={14} /> : <FiCopy size={14} />}
                        </button>
                      </div>
                      <p className='mb-0 mt-2' style={{ fontSize: '0.75rem', color: '#64748b' }}>
                        Add this URL as a webhook in your Contact Form 7 WordPress settings.
                      </p>
                    </div>
                  )}
                  <div className='p-3 rounded' style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}>
                    <div className='fw-medium mb-2' style={{ fontSize: '0.83rem', color: '#475569' }}>
                      Next Steps
                    </div>
                    <ol className='mb-0 ps-3' style={{ fontSize: '0.8rem', color: '#64748b' }}>
                      <li className='mb-1'>Install <strong>Contact Form 7</strong> on your WordPress site</li>
                      <li className='mb-1'>Download &amp; install our <a href='https://mapi.1automations.com/downloads/cf7-webhook-plugin.zip' target='_blank' rel='noopener noreferrer'>CF7 Webhook Plugin</a></li>
                      <li className='mb-1'>Open <strong>CF7 Webhook</strong> from the WordPress sidebar</li>
                      <li className='mb-1'>Select your form and paste the webhook URL above</li>
                      <li className='mb-1'>Submit a test form entry to generate sample data</li>
                      <li>Come back here and set up <strong>Field Mapping</strong></li>
                    </ol>
                  </div>
                </>
              ) : (
                <>
                  <div className='mb-3'>
                    <label className='form-label fw-medium'>Connection Name <span className='text-danger'>*</span></label>
                    <input
                      type='text'
                      className='form-control'
                      placeholder='e.g. My Contact Form 7 Leads'
                      value={cf7Name}
                      onChange={(e) => setCf7Name(e.target.value)}
                    />
                  </div>
                  <div className='p-3 rounded' style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}>
                    <p className='mb-0' style={{ fontSize: '0.8rem', color: '#64748b' }}>
                      After creating the connection, you will receive a webhook URL. You'll need to install our custom CF7 Webhook plugin on your WordPress site and paste the URL there.
                    </p>
                  </div>
                </>
              )}
            </ModalBody>
            <ModalFooter>
              {cf7Result ? (
                <button className='btn btn-sm btn-primary' onClick={() => { setCf7ModalOpen(false); setCf7Result(null); }}>
                  Done
                </button>
              ) : (
                <>
                  <button className='btn btn-sm btn-soft-danger' onClick={() => setCf7ModalOpen(false)}>
                    Cancel
                  </button>
                  <button
                    className='btn btn-sm btn-primary d-flex align-items-center gap-2'
                    onClick={handleCreateContactForm7}
                    disabled={cf7Creating || !cf7Name.trim()}
                  >
                    {cf7Creating && <span className='spinner-border spinner-border-sm' role='status' aria-hidden='true'></span>}
                    <span>{cf7Creating ? 'Creating...' : 'Create Connection'}</span>
                  </button>
                </>
              )}
            </ModalFooter>
          </Modal>

          {/* Facebook Lead Ads Modal */}
          <Modal isOpen={showModal} toggle={() => setShowModal(false)} size='md' centered>
            <ModalHeader toggle={() => setShowModal(false)}>
              <div className='d-flex align-items-center gap-2'>
                <FaMeta style={{ color: '#1877F2' }} />
                <span>Facebook Lead Ads</span>
              </div>
            </ModalHeader>
            <ModalBody style={{ padding: 0, height: '70vh' }}>
              {modalUrl && (
                <iframe
                  src={modalUrl}
                  title='Facebook Lead Ads Connection'
                  style={{
                    width: '100%',
                    height: '100%',
                    border: 'none',
                  }}
                />
              )}
            </ModalBody>
          </Modal>
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

import React, { useState, useEffect, useCallback } from 'react';
import { withRouter } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import {
  Container,
  Modal,
  ModalHeader,
  ModalBody,
  Spinner,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';

import BreadCrumb from '../../Components/Common/BreadCrumb';
import MetaTag from '../../Components/Common/Meta';
import { useHistory } from 'react-router-dom';
import { listConnections } from '../../helpers/backend_helper';

//icons
import { FaMeta } from 'react-icons/fa6';
import { MdOutlineWebhook } from 'react-icons/md';
import { SiGoogleads } from 'react-icons/si';
import { SiLinkedin } from 'react-icons/si';
import { SiTypeform } from 'react-icons/si';
import { CgWebsite } from 'react-icons/cg';
import { SiGoogleforms } from 'react-icons/si';
import { FaYoutube } from 'react-icons/fa';
import { FiExternalLink } from 'react-icons/fi';
import { BsGearWideConnected } from 'react-icons/bs';
import { FaTrashCan } from 'react-icons/fa6';
import { FiFileText } from 'react-icons/fi';
import { ImMobile } from 'react-icons/im';
import { IoQrCodeOutline } from 'react-icons/io5';
import { SiZoho } from 'react-icons/si';
import { FaHubspot } from 'react-icons/fa';
import { LiaSalesforce } from 'react-icons/lia';
import { FaIndustry } from 'react-icons/fa';
import { FaHandshake } from 'react-icons/fa';
import { BsBuildingsFill } from 'react-icons/bs';
import { MdRestaurant } from 'react-icons/md';

const sourceIconMap = {
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
};

const LeadSources = (props) => {
  const history = useHistory();

  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalUrl, setModalUrl] = useState('');

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
        setPagination(
          response.pagination || { total: 0, page, limit: 20, totalPages: 0 },
        );
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
      description: 'Capture leads directly from Facebook ads',
    },
    {
      id: 2,
      version: '0.0.1',
      name: 'Webhook',
      key: 'webhook',
      icon: <MdOutlineWebhook />,
      description: 'Receive leads via custom webhook',
    },
    {
      id: 3,
      version: '0.0.1',
      name: 'Form',
      key: 'form',
      icon: <SiGoogleforms />,
      description: 'Custom web form integration',
    },
    {
      id: 4,
      version: '0.0.1',
      name: 'Google Form',
      key: 'googleForm',
      icon: <SiGoogleforms />,
      description: 'Sync leads from Google Forms',
    },
    {
      id: 5,
      version: '0.0.1',
      name: 'Typeform',
      key: 'typeform',
      icon: <SiTypeform />,
      description: 'Connect with Typeform responses',
    },
    {
      id: 6,
      version: '0.0.1',
      name: 'Google Ads',
      key: 'googleAds',
      icon: <SiGoogleads />,
      description: 'Import leads from Google Ads campaigns',
    },
    {
      id: 7,
      version: '0.0.1',
      name: 'LinkedIn Lead Gen',
      key: 'linkedinLeadGen',
      icon: <SiLinkedin />,
      description: 'Capture LinkedIn sponsored leads',
    },
    {
      id: 8,
      version: '0.0.1',
      name: 'Landing Page',
      key: 'landingPage',
      icon: <CgWebsite />,
      description: 'Custom landing page forms',
    },
    {
      id: 9,
      version: '0.0.1',
      name: 'Phone Contact',
      key: 'phoneContact',
      icon: <ImMobile />,
      description: 'Import leads from phone contacts',
    },
    {
      id: 10,
      version: '0.0.1',
      name: 'OCR App',
      key: 'ocrApp',
      icon: <IoQrCodeOutline />,
      description: 'Scan and capture leads via OCR',
    },
    {
      id: 11,
      version: '0.0.1',
      name: 'Zoho CRM',
      key: 'zohoCrm',
      icon: <SiZoho />,
      description: 'Sync leads from Zoho CRM',
    },
    {
      id: 12,
      version: '0.0.1',
      name: 'Hubspot CRM',
      key: 'hubspotCrm',
      icon: <FaHubspot />,
      description: 'Sync leads from Hubspot CRM',
    },
    {
      id: 13,
      version: '0.0.1',
      name: 'Salesforce',
      key: 'salesforce',
      icon: <LiaSalesforce />,
      description: 'Sync leads from Salesforce',
    },
    {
      id: 14,
      version: '0.0.1',
      name: 'India Mart',
      key: 'indiaMart',
      icon: <FaIndustry />,
      description: 'Capture leads from IndiaMART enquiries',
    },
    {
      id: 15,
      version: '0.0.1',
      name: 'Trade India',
      key: 'tradeIndia',
      icon: <FaHandshake />,
      description: 'Import leads from TradeIndia platform',
    },
    {
      id: 16,
      version: '0.0.1',
      name: 'Magic Bricks',
      key: 'magicBricks',
      icon: <BsBuildingsFill />,
      description: 'Capture real estate leads from MagicBricks',
    },
    {
      id: 17,
      version: '0.0.1',
      name: 'Zomato',
      key: 'zomato',
      icon: <MdRestaurant />,
      description: 'Import restaurant leads from Zomato',
    },
  ];

  const filterSources = (sources) => {
    return sources.filter(
      (source) =>
        source.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        source.description.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  };

  const filteredAll = filterSources(allSources);

  function handleCreateNewConnection(source) {
    if (source.key === 'facebookLeadAds') {
      const token = localStorage.getItem('authToken') || '';
      setModalUrl(`https://oauth.automationsbuilder.com/lead-session?token=${token}`);
      setShowModal(true);
    } else {
      history.push('/settings/' + source.key, { source });
    }
  }

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
                      <div key={connection._id || connection.id} className='col-md-6 col-lg-4 col-xl-3'>
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
                                {sourceIconMap[connection.source || connection.key] || <BsGearWideConnected />}
                              </div>
                              <div className='flex-grow-1'>
                                <h6 className='card-title mb-1' style={{ color: '#1e293b', fontWeight: '600', fontSize: '0.95rem' }}>
                                  {connection?.configuration?.pageName || connection.source} {" - "}
                                  {connection?.configuration?.formName || connection.source}
                                </h6>
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
                            <p className='card-text text-muted mb-2' style={{ fontSize: '0.8rem', lineHeight: '1.4' }}>
                              {connection.description || connection.source}
                            </p>
                            <div className='d-flex gap-2'>
                              <button
                                className='btn btn-sm btn-soft-dark d-flex align-items-center gap-1'
                                style={{ fontSize: '0.8rem', padding: '0.3rem 0.5rem' }}
                              >
                                <BsGearWideConnected />
                                <span>Configure</span>
                              </button>
                              <button
                                className='btn btn-sm btn-soft-primary d-flex align-items-center gap-1'
                                style={{ fontSize: '0.8rem', padding: '0.3rem 0.5rem' }}
                              >
                                <FiFileText />
                                <span>Logs</span>
                              </button>
                              <button
                                className='btn btn-sm d-flex align-items-center gap-1'
                                style={{
                                  backgroundColor: '#fee2e2',
                                  border: '1px solid #fecaca',
                                  color: '#dc2626',
                                  fontWeight: '500',
                                  fontSize: '0.8rem',
                                  padding: '0.3rem 0.5rem',
                                }}
                              >
                                <FaTrashCan />
                                <span>Remove</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Pagination */}
                  {pagination.totalPages > 1 && (
                    <div className='d-flex justify-content-between align-items-center mt-4'>
                      <p className='text-muted mb-0' style={{ fontSize: '0.85rem' }}>
                        Showing {(currentPage - 1) * pagination.limit + 1} -{' '}
                        {Math.min(currentPage * pagination.limit, pagination.total)} of{' '}
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
                              <DropdownItem className='dropdown-item d-flex align-items-center gap-2' href='#'>
                                <FiExternalLink />
                                <span>Documentation</span>
                              </DropdownItem>
                            </DropdownMenu>
                          </UncontrolledDropdown>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
          {/* Facebook Lead Ads Modal */}
          <Modal isOpen={showModal} toggle={() => setShowModal(false)} size='xl' centered>
            <ModalHeader toggle={() => setShowModal(false)}>
              <div className='d-flex align-items-center gap-2'>
                <FaMeta style={{ color: '#1877F2' }} />
                <span>Facebook Lead Ads</span>
              </div>
            </ModalHeader>
            <ModalBody style={{ padding: 0, height: '80vh' }}>
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
      </div>
    </React.Fragment>
  );
};

LeadSources.propTypes = {
  location: PropTypes.object,
  t: PropTypes.any,
};

export default withRouter(withTranslation()(LeadSources));

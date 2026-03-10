import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Spinner,
  Alert,
} from 'reactstrap';
import { BiLink, BiUnlink } from 'react-icons/bi';
import { IoMdClose } from 'react-icons/io';
import { FiSearch } from 'react-icons/fi';
import { HiOutlineUserAdd } from 'react-icons/hi';
import { getCrmFields, getFieldMappings, upsertFieldMappings, getFacebookForms, getFacebookPages, getIndiamartFieldList, getZohoFieldList, getGenericWebhookFieldList, getPhoneContactFieldList, getTypeformFieldList } from '../../helpers/backend_helper';

// --- Provider-specific form field fetchers ---
// Each fetcher returns a Promise that resolves to an array of { key, name/label } objects.
// Add a new entry here for each new provider (17-20 total).
const PROVIDER_FIELD_FETCHERS = {
  // Facebook: fetch pages → find page → fetch forms → find form → questions
  facebook_leadgen: async (connection) => {
    const config = connection?.configuration || {};
    if (!config.pageId) return [];
    const pagesList = await getFacebookPages();
    const existing = (pagesList || []).find((p) => p.id === config.pageId);
    if (!existing) return [];
    const res = await getFacebookForms({
      pageId: config.pageId,
      pageAccessToken: existing.accessToken || existing.access_token || existing.pageAccessToken,
    });
    const formList = res?.leadForms || res?.data || res || [];
    const selectedForm = formList.find((f) => f.id === config.formId);
    return selectedForm?.questions || [];
  },

  // IndiaMART: GET call, response is { formFields: { KEY: "label", ... } }
  indiamart: async () => {
    const res = await getIndiamartFieldList();
    const fieldsObj = res?.formFields || res?.data?.formFields || {};
    if (typeof fieldsObj === 'object' && !Array.isArray(fieldsObj)) {
      return Object.entries(fieldsObj).map(([key, label]) => ({ key, name: label, label }));
    }
    return Array.isArray(fieldsObj) ? fieldsObj : [];
  },

  // Zoho CRM: GET call, response is { formFields: { KEY: "label", ... } }
  zoho: async (connection) => {
    const res = await getZohoFieldList(connection._id);
    const fieldsObj = res?.formFields || res?.data?.formFields || {};
    if (typeof fieldsObj === 'object' && !Array.isArray(fieldsObj)) {
      return Object.entries(fieldsObj).map(([key, label]) => ({ key, name: label, label }));
    }
    return Array.isArray(fieldsObj) ? fieldsObj : [];
  },
  // Generic Webhook: GET call, response is { formFields: { KEY: "label", ... } }
  generic_webhook: async (connection) => {
    const res = await getGenericWebhookFieldList(connection._id || connection.id);
    const fieldsObj = res?.formFields || res?.data?.formFields || {};
    if (typeof fieldsObj === 'object' && !Array.isArray(fieldsObj)) {
      return Object.entries(fieldsObj).map(([key, label]) => ({ key, name: label, label }));
    }
    return Array.isArray(fieldsObj) ? fieldsObj : [];
  },
  webhook: async (connection) => {
    const res = await getGenericWebhookFieldList(connection._id || connection.id);
    const fieldsObj = res?.formFields || res?.data?.formFields || {};
    if (typeof fieldsObj === 'object' && !Array.isArray(fieldsObj)) {
      return Object.entries(fieldsObj).map(([key, label]) => ({ key, name: label, label }));
    }
    return Array.isArray(fieldsObj) ? fieldsObj : [];
  },

  // Phone Contact: GET call, response is { formFields: { KEY: "label", ... } }
  phone_contact: async () => {
    const res = await getPhoneContactFieldList();
    const fieldsObj = res?.formFields || res?.data?.formFields || {};
    if (typeof fieldsObj === 'object' && !Array.isArray(fieldsObj)) {
      return Object.entries(fieldsObj).map(([key, label]) => ({ key, name: label, label }));
    }
    return Array.isArray(fieldsObj) ? fieldsObj : [];
  },
  phoneContact: async () => {
    const res = await getPhoneContactFieldList();
    const fieldsObj = res?.formFields || res?.data?.formFields || {};
    if (typeof fieldsObj === 'object' && !Array.isArray(fieldsObj)) {
      return Object.entries(fieldsObj).map(([key, label]) => ({ key, name: label, label }));
    }
    return Array.isArray(fieldsObj) ? fieldsObj : [];
  },

  // Typeform: GET call, response is { formFields: { KEY: "label", ... } }
  typeform: async (connection) => {
    const res = await getTypeformFieldList(connection._id || connection.id);
    const fieldsObj = res?.formFields || res?.data?.formFields || {};
    if (typeof fieldsObj === 'object' && !Array.isArray(fieldsObj)) {
      return Object.entries(fieldsObj).map(([key, label]) => ({ key, name: label, label }));
    }
    return Array.isArray(fieldsObj) ? fieldsObj : [];
  },

  // --- Add more providers below as needed ---
  // google_forms: async (connection) => { ... },
  // googleForm: async (connection) => { ... },
  // google_ads: async (connection) => { ... },
  // googleAds: async (connection) => { ... },
  // linkedin_leadgen: async (connection) => { ... },
  // linkedinLeadGen: async (connection) => { ... },
  // typeform: async (connection) => { ... },
  // landing_page: async (connection) => { ... },
  // landingPage: async (connection) => { ... },
  // zohoCrm: async (connection) => { ... },
  // hubspot_crm: async (connection) => { ... },
  // hubspotCrm: async (connection) => { ... },
  // salesforce: async (connection) => { ... },
  // trade_india: async (connection) => { ... },
  // tradeIndia: async (connection) => { ... },
  // magic_bricks: async (connection) => { ... },
  // magicBricks: async (connection) => { ... },
  // zomato: async (connection) => { ... },
  // phone_contact: async (connection) => { ... },
  // phoneContact: async (connection) => { ... },
  // ocr_app: async (connection) => { ... },
  // ocrApp: async (connection) => { ... },
};

// Resolve the correct fetcher for a connection
const getFieldFetcher = (connection) => {
  const provider = connection?.provider || connection?.source || connection?.key || '';
  return PROVIDER_FIELD_FETCHERS[provider] || PROVIDER_FIELD_FETCHERS.facebook_leadgen;
};

const TOP_LEVEL_FIELDS = [
  { slug: 'whatsapp', label: 'WhatsApp' },
  { slug: 'email', label: 'Email' },
  { slug: 'chat_name', label: 'Chat Name' },
];

const FieldMappingModal = ({ isOpen, toggle, connection }) => {
  const [crmFields, setCrmFields] = useState([]);
  const [formFields, setFormFields] = useState([]);
  const [loadingCrm, setLoadingCrm] = useState(false);
  const [loadingForms, setLoadingForms] = useState(false);
  const [loadingMappings, setLoadingMappings] = useState(false);
  const [crmSearch, setCrmSearch] = useState('');
  const [crmPage, setCrmPage] = useState(1);
  const [crmPagination, setCrmPagination] = useState({ total: 0, totalPages: 0 });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Mapping state: { crmFieldId: formFieldKey }
  const [mappings, setMappings] = useState({});
  // Store full mapping data for building save payload
  const [mappingDetails, setMappingDetails] = useState({});
  // Contact creation toggle
  const [isContactCreateOnNewLead, setIsContactCreateOnNewLead] = useState(false);
  // Top-level field mappings: { slug: formFieldKey }
  const [topLevelMappings, setTopLevelMappings] = useState({
    whatsapp: '',
    email: '',
    chat_name: '',
    chat_operator: '',
  });

  const connectionId = connection?._id || connection?.id;

  const fetchCrmFields = useCallback((page = 1, search = '') => {
    setLoadingCrm(true);
    getCrmFields({ limit: 20, page, search })
      .then((res) => {
        setCrmFields(res.data || []);
        setCrmPagination(res.pagination || { total: 0, totalPages: 0 });
      })
      .catch((err) => {
        console.error('Failed to fetch CRM fields:', err);
        setCrmFields([]);
        setError('Failed to load CRM fields');
      })
      .finally(() => setLoadingCrm(false));
  }, []);

  // Fetch CRM fields, form fields, and existing mappings on open
  useEffect(() => {
    if (isOpen && connectionId) {
      setError('');
      setCrmSearch('');
      setCrmPage(1);
      fetchCrmFields(1, '');

      // Fetch form/source fields using provider-specific fetcher
      const fetcher = getFieldFetcher(connection);
      setLoadingForms(true);
      fetcher(connection)
        .then((fields) => {
          setFormFields(Array.isArray(fields) ? fields : []);
        })
        .catch((err) => {
          console.error('Failed to fetch form fields:', err);
          setFormFields([]);
        })
        .finally(() => setLoadingForms(false));

      // Fetch existing mappings from API
      setLoadingMappings(true);
      getFieldMappings(connectionId)
        .then((res) => {
          const data = res.data || res || {};
          const existingMappings = data.mappings || [];
          const mapState = {};
          const detailState = {};
          const topLevel = { whatsapp: '', email: '', chat_name: '', chat_operator: '' };
          existingMappings.forEach((m) => {
            const key = m.crmFieldId || m.crmFieldKey;
            const slug = m.crmSlug || '';
            // Check if this mapping is a top-level field
            if (TOP_LEVEL_FIELDS.some((tf) => tf.slug === slug)) {
              topLevel[slug] = m.formFieldKey || m.formFieldId || '';
            } else {
              mapState[key] = m.formFieldKey || m.formFieldId;
              detailState[key] = m;
            }
          });
          setMappings(mapState);
          setMappingDetails(detailState);
          setTopLevelMappings(topLevel);
          if (typeof data.isContactCreateOnNewLead === 'boolean') {
            setIsContactCreateOnNewLead(data.isContactCreateOnNewLead);
          } else {
            setIsContactCreateOnNewLead(false);
          }
        })
        .catch((err) => {
          console.error('Failed to fetch field mappings:', err);
          setMappings({});
          setMappingDetails({});
          setTopLevelMappings({ whatsapp: '', email: '', chat_name: '', chat_operator: '' });
          setIsContactCreateOnNewLead(false);
        })
        .finally(() => setLoadingMappings(false));
    } else {
      setCrmFields([]);
      setFormFields([]);
      setMappings({});
      setMappingDetails({});
      setTopLevelMappings({ whatsapp: '', email: '', chat_name: '', chat_operator: '' });
      setIsContactCreateOnNewLead(false);
      setError('');
    }
  }, [isOpen, connectionId, connection, fetchCrmFields]);

  const handleCrmSearch = (value) => {
    setCrmSearch(value);
    setCrmPage(1);
    fetchCrmFields(1, value);
  };

  const handleCrmPageChange = (newPage) => {
    setCrmPage(newPage);
    fetchCrmFields(newPage, crmSearch);
  };

  const handleMapField = (crmFieldId, formFieldKey) => {
    setMappings((prev) => {
      const updated = { ...prev };
      if (!formFieldKey) {
        delete updated[crmFieldId];
      } else {
        updated[crmFieldId] = formFieldKey;
      }
      return updated;
    });
  };

  const handleTopLevelChange = (slug, formFieldKey) => {
    setTopLevelMappings((prev) => ({ ...prev, [slug]: formFieldKey }));
  };

  // Check if all top-level fields are mapped when toggle is ON
  const topLevelComplete = TOP_LEVEL_FIELDS.every((tf) => topLevelMappings[tf.slug]);
  const canSave = isContactCreateOnNewLead ? topLevelComplete : true;

  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      // Build custom field mappings
      const customMappings = Object.entries(mappings).map(([crmFieldId, formFieldKey]) => {
        const crmField = crmFields.find((f) => (f._id || f.id || f.key) === crmFieldId);
        const formField = formFields.find(
          (f) => (f.key || f.id || f.name) === formFieldKey,
        );
        return {
          crmFieldId,
          crmFieldName: crmField?.name || crmField?.label || mappingDetails[crmFieldId]?.crmFieldName || crmFieldId,
          crmFieldKey: crmField?.key || mappingDetails[crmFieldId]?.crmFieldKey || crmFieldId,
          crmSlug: crmField?.slug || mappingDetails[crmFieldId]?.crmSlug || crmFieldId,
          formFieldKey,
          formFieldName: formField?.name || formField?.label || mappingDetails[crmFieldId]?.formFieldName || formFieldKey,
        };
      });

      // Build top-level field mappings
      const topLevelPayload = TOP_LEVEL_FIELDS
        .filter((tf) => topLevelMappings[tf.slug])
        .map((tf) => {
          const formFieldKey = topLevelMappings[tf.slug];
          const formField = formFields.find(
            (f) => (f.key || f.id || f.name) === formFieldKey,
          );
          return {
            crmFieldId: tf.slug,
            crmFieldName: tf.label,
            crmFieldKey: tf.slug,
            crmSlug: tf.slug,
            formFieldKey,
            formFieldName: formField?.name || formField?.label || formFieldKey,
          };
        });

      await upsertFieldMappings({
        connectionId,
        mappings: [...topLevelPayload, ...customMappings],
        isContactCreateOnNewLead,
      });

      toggle();
    } catch (err) {
      console.error('Failed to save mappings:', err);
      setError('Failed to save mappings');
    } finally {
      setSaving(false);
    }
  };

  const mappedCount = Object.keys(mappings).length + TOP_LEVEL_FIELDS.filter((tf) => topLevelMappings[tf.slug]).length;

  const isLoading = loadingCrm || loadingMappings || loadingForms;

  return (
    <Modal isOpen={isOpen} toggle={toggle} centered size='md'>
      <ModalHeader toggle={toggle}>
        <div className='d-flex align-items-center gap-2'>
          <BiLink style={{ fontSize: '1.2rem' }} />
          <span>Field Mapping</span>
          {mappedCount > 0 && (
            <span
              className='badge'
              style={{ backgroundColor: '#3b82f6', color: '#fff', fontSize: '0.7rem' }}
            >
              {mappedCount} mapped
            </span>
          )}
        </div>
      </ModalHeader>
      <ModalBody>
        {error && (
          <Alert color='danger' className='mb-3' style={{ fontSize: '0.85rem' }}>
            {error}
          </Alert>
        )}

        {/* Contact Creation Toggle */}
        <div
          className='d-flex align-items-center justify-content-between p-3 rounded mb-3'
          style={{
            backgroundColor: isContactCreateOnNewLead ? '#f0fdf4' : '#f8fafc',
            border: `1px solid ${isContactCreateOnNewLead ? '#bbf7d0' : '#e2e8f0'}`,
            transition: 'all 0.2s ease',
          }}
        >
          <div className='d-flex align-items-center gap-2'>
            <HiOutlineUserAdd
              style={{
                fontSize: '1.2rem',
                color: isContactCreateOnNewLead ? '#16a34a' : '#64748b',
              }}
            />
            <div>
              <div className='fw-medium' style={{ fontSize: '0.85rem' }}>
                Auto-create Contact
              </div>
              <div className='text-muted' style={{ fontSize: '0.75rem' }}>
                Automatically create a CRM contact when a new lead arrives
              </div>
            </div>
          </div>
          <div
            onClick={() => setIsContactCreateOnNewLead((prev) => !prev)}
            style={{
              width: '42px',
              height: '24px',
              borderRadius: '12px',
              backgroundColor: isContactCreateOnNewLead ? '#22c55e' : '#cbd5e1',
              position: 'relative',
              cursor: 'pointer',
              transition: 'background-color 0.2s ease',
              flexShrink: 0,
            }}
          >
            <div
              style={{
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                backgroundColor: '#fff',
                position: 'absolute',
                top: '3px',
                left: isContactCreateOnNewLead ? '21px' : '3px',
                transition: 'left 0.2s ease',
                boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
              }}
            />
          </div>
        </div>

        {/* Top-Level Required Fields - shown when toggle is ON */}
        {isContactCreateOnNewLead && (
          <div
            className='p-3 rounded mb-3'
            style={{
              backgroundColor: '#fffbeb',
              border: '1px solid #fde68a',
            }}
          >
            <div className='fw-medium mb-2' style={{ fontSize: '0.85rem', color: '#92400e' }}>
              Required Contact Fields
            </div>
            <div className='text-muted mb-3' style={{ fontSize: '0.75rem' }}>
              Map these fields to enable auto-contact creation
            </div>
            {TOP_LEVEL_FIELDS.map((tf) => (
              <div key={tf.slug} className='d-flex align-items-center gap-2 mb-2'>
                <div style={{ width: '110px', flexShrink: 0 }}>
                  <span className='fw-medium' style={{ fontSize: '0.83rem' }}>{tf.label}</span>
                  <span style={{ color: '#dc2626', marginLeft: '2px' }}>*</span>
                </div>
                <div style={{ fontSize: '1rem', color: topLevelMappings[tf.slug] ? '#22c55e' : '#e2e8f0' }}>
                  {topLevelMappings[tf.slug] ? <BiLink /> : <BiUnlink />}
                </div>
                <div className='flex-grow-1'>
                  <Input
                    type='select'
                    bsSize='sm'
                    value={topLevelMappings[tf.slug] || ''}
                    onChange={(e) => handleTopLevelChange(tf.slug, e.target.value)}
                    style={{
                      fontSize: '0.8rem',
                      borderColor: !topLevelMappings[tf.slug] ? '#fbbf24' : '#d1d5db',
                    }}
                  >
                    <option value=''>-- Select form field --</option>
                    {formFields?.map((ff) => {
                      const ffKey = ff.key || ff.id || ff.name;
                      return (
                        <option key={ffKey} value={ffKey}>
                          {ff.name || ff.label}
                        </option>
                      );
                    })}
                  </Input>
                </div>
              </div>
            ))}
            {!topLevelComplete && (
              <div className='mt-2' style={{ fontSize: '0.75rem', color: '#b45309' }}>
                All fields must be mapped to enable saving
              </div>
            )}
          </div>
        )}

        {/* CRM Search */}
        <div className='position-relative mb-3'>
          <FiSearch
            style={{
              position: 'absolute',
              left: '10px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#94a3b8',
              fontSize: '0.85rem',
            }}
          />
          <input
            type='text'
            className='form-control form-control-sm'
            style={{ fontSize: '0.83rem', paddingLeft: '30px' }}
            placeholder='Search CRM fields...'
            value={crmSearch}
            onChange={(e) => handleCrmSearch(e.target.value)}
          />
        </div>

        {isLoading ? (
          <div className='text-center py-5'>
            <Spinner color='primary' />
            <p className='text-muted mt-2' style={{ fontSize: '0.85rem' }}>Loading...</p>
          </div>
        ) : crmFields.length === 0 ? (
          <p className='text-muted text-center py-4' style={{ fontSize: '0.85rem' }}>
            No CRM fields found
          </p>
        ) : (
          <>
            {/* Form fields info */}
            {formFields.length === 0 && (
              <Alert color='warning' className='mb-3' style={{ fontSize: '0.8rem' }}>
                No form fields found. Make sure a page and form are configured for this connection.
              </Alert>
            )}

            {/* Mapping Table */}
            <div style={{ maxHeight: '420px', overflowY: 'auto' }}>
              <table className='table table-sm align-middle mb-0'>
                <thead style={{ position: 'sticky', top: 0, backgroundColor: '#fff', zIndex: 1 }}>
                  <tr style={{ fontSize: '0.78rem', color: '#64748b' }}>
                    <th style={{ fontWeight: 600, width: '42%' }}>CRM Field</th>
                    <th style={{ fontWeight: 600, width: '8%', textAlign: 'center' }}></th>
                    <th style={{ fontWeight: 600, width: '50%' }}>Form Field</th>
                  </tr>
                </thead>
                <tbody>
                  {crmFields.map((crmField) => {
                    const crmId = crmField._id || crmField.id || crmField.key;
                    const mappedFormKey = mappings[crmId] || '';

                    return (
                      <tr key={crmId} style={{ fontSize: '0.83rem' }}>
                        <td>
                          <div className='fw-medium'>{crmField.name || crmField.label}</div>
                          {crmField.type && (
                            <span className='text-muted' style={{ fontSize: '0.7rem' }}>
                              {crmField.type}
                            </span>
                          )}
                        </td>
                        <td className='text-center'>
                          {mappedFormKey ? (
                            <BiLink style={{ color: '#22c55e', fontSize: '1.1rem' }} />
                          ) : (
                            <BiUnlink style={{ color: '#e2e8f0', fontSize: '1.1rem' }} />
                          )}
                        </td>
                        <td>
                          <div className='d-flex align-items-center gap-1'>
                            <Input
                              type='select'
                              bsSize='sm'
                              value={mappedFormKey}
                              onChange={(e) => handleMapField(crmId, e.target.value)}
                              style={{ fontSize: '0.8rem' }}
                            >
                              <option value=''>-- Not mapped --</option>
                              {formFields?.map((ff) => {
                                const ffKey = ff.key || ff.id || ff.name;
                                return (
                                  <option key={ffKey} value={ffKey}>
                                    {ff.name || ff.label}
                                  </option>
                                );
                              })}
                            </Input>
                            {mappedFormKey && (
                              <IoMdClose
                                style={{ color: '#94a3b8', cursor: 'pointer', fontSize: '1rem', flexShrink: 0 }}
                                onClick={() => handleMapField(crmId, '')}
                              />
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* CRM Pagination */}
            {crmPagination.totalPages > 1 && (
              <div className='d-flex justify-content-center gap-2 mt-3 pt-2 border-top'>
                <button
                  className='btn btn-sm btn-outline-secondary py-0 px-2'
                  style={{ fontSize: '0.78rem' }}
                  disabled={crmPage === 1}
                  onClick={() => handleCrmPageChange(crmPage - 1)}
                >
                  Prev
                </button>
                <span className='text-muted align-self-center' style={{ fontSize: '0.78rem' }}>
                  Page {crmPage} of {crmPagination.totalPages}
                </span>
                <button
                  className='btn btn-sm btn-outline-secondary py-0 px-2'
                  style={{ fontSize: '0.78rem' }}
                  disabled={crmPage === crmPagination.totalPages}
                  onClick={() => handleCrmPageChange(crmPage + 1)}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </ModalBody>
      <ModalFooter>
        <button className='btn btn-sm btn-soft-danger' onClick={toggle}>
          Cancel
        </button>
        <button
          className='btn btn-sm btn-primary d-flex align-items-center gap-1'
          onClick={handleSave}
          disabled={saving || !canSave}
        >
          {saving ? <Spinner size='sm' /> : <BiLink />}
          <span>{saving ? 'Saving...' : `Save Mappings (${mappedCount})`}</span>
        </button>
      </ModalFooter>
    </Modal>
  );
};

FieldMappingModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  connection: PropTypes.object,
};

export default FieldMappingModal;
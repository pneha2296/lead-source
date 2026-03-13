import React, { useState, useEffect } from 'react';
import {
  ModalBody,
  ModalFooter,
  Spinner,
  Alert,
} from 'reactstrap';
import { FaHubspot } from 'react-icons/fa';
import { FiCheck } from 'react-icons/fi';
import { getHubspotConnection, getHubspotForms, saveHubspotSelection } from '../../../helpers/backend_helper';

const HubspotConfigForm = ({ connection, toggle }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [connectionDetails, setConnectionDetails] = useState(null);

  // Form selection state
  const [forms, setForms] = useState([]);
  const [loadingForms, setLoadingForms] = useState(false);
  const [selectedFormId, setSelectedFormId] = useState('');
  const [saving, setSaving] = useState(false);

  const connectionId = connection?._id || connection?.id;

  useEffect(() => {
    if (!connectionId) return;
    setLoading(true);
    setError('');
    getHubspotConnection(connectionId)
      .then((res) => {
        const details = res.data || res || {};
        setConnectionDetails(details);
        const config = details?.configuration || connection?.configuration || {};
        if (config.formId) {
          setSelectedFormId(config.formId);
        }
      })
      .catch(() => {
        setError('Failed to load HubSpot connection details');
      })
      .finally(() => setLoading(false));
  }, [connectionId]);

  const handleLoadForms = async () => {
    setLoadingForms(true);
    setError('');
    try {
      const res = await getHubspotForms(connectionId);
      const formList = res?.forms || res?.data?.forms || res?.data || res || [];
      setForms(Array.isArray(formList) ? formList : []);
    } catch (err) {
      setError(err?.msg || err?.message || 'Failed to load forms from HubSpot.');
    } finally {
      setLoadingForms(false);
    }
  };

  useEffect(() => {
    if (connectionId) {
      handleLoadForms();
    }
  }, [connectionId]);

  const handleSaveSelection = async () => {
    if (!selectedFormId) {
      setError('Please select a form.');
      return;
    }
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      const selectedForm = forms.find((f) => f.id === selectedFormId || f.guid === selectedFormId);
      await saveHubspotSelection({
        connectionId,
        formId: selectedFormId,
        formName: selectedForm?.name || selectedForm?.title || selectedFormId,
      });
      setSuccess('Form selection saved successfully!');
    } catch (err) {
      setError(err?.msg || err?.message || 'Failed to save form selection.');
    } finally {
      setSaving(false);
    }
  };

  const config = connectionDetails?.configuration || connection?.configuration || {};

  return (
    <>
      <ModalBody>
        {error && (
          <Alert color='danger' className='mb-3' style={{ fontSize: '0.85rem' }} toggle={() => setError('')}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert color='success' className='mb-3' style={{ fontSize: '0.85rem' }} toggle={() => setSuccess('')}>
            <FiCheck className='me-1' />{success}
          </Alert>
        )}

        {loading ? (
          <div className='text-center py-4'>
            <Spinner color='primary' />
            <p className='text-muted mt-2' style={{ fontSize: '0.85rem' }}>Loading connection details...</p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className='p-3 rounded mb-3' style={{ backgroundColor: '#fff4f0', border: '1px solid #fed7c7' }}>
              <div className='d-flex align-items-center justify-content-between'>
                <p className='mb-0 fw-medium' style={{ fontSize: '0.85rem', color: '#ff7a59' }}>
                  <FaHubspot className='me-1' />
                  HubSpot CRM Connection
                </p>
                <span
                  className='badge'
                  style={{
                    backgroundColor: connection?.status === 'active' ? '#22c55e' : '#f59e0b',
                    color: '#fff',
                    fontSize: '0.7rem',
                  }}
                >
                  {connection?.status || 'active'}
                </span>
              </div>
            </div>

            {/* Connection Details */}
            {(config.accountName || config.connectionName || connection?.name) && (
              <div className='p-3 rounded mb-3' style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0' }}>
                <div className='fw-medium mb-2' style={{ fontSize: '0.83rem', color: '#15803d' }}>
                  Account Details
                </div>
                <div style={{ fontSize: '0.8rem' }}>
                  <div className='d-flex justify-content-between mb-1'>
                    <span className='text-muted'>Account</span>
                    <strong>{config.accountName || config.connectionName || connection?.name}</strong>
                  </div>
                  {config.email && (
                    <div className='d-flex justify-content-between mb-1'>
                      <span className='text-muted'>Email</span>
                      <strong>{config.email}</strong>
                    </div>
                  )}
                  {config.portalId && (
                    <div className='d-flex justify-content-between mb-1'>
                      <span className='text-muted'>Portal ID</span>
                      <strong>{config.portalId}</strong>
                    </div>
                  )}
                  {config.formName && (
                    <div className='d-flex justify-content-between mb-1'>
                      <span className='text-muted'>Selected Form</span>
                      <strong>{config.formName}</strong>
                    </div>
                  )}
                  {connection?.createdAt && (
                    <div className='d-flex justify-content-between mb-1'>
                      <span className='text-muted'>Connected</span>
                      <strong>{new Date(connection.createdAt).toLocaleString()}</strong>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Form Selection */}
            <div className='p-3 rounded mb-3' style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}>
              <div className='fw-medium mb-2' style={{ fontSize: '0.83rem', color: '#475569' }}>
                Select HubSpot Form
              </div>
              <p className='text-muted mb-2' style={{ fontSize: '0.75rem' }}>
                Choose which HubSpot form to capture submissions from. New form submissions will be synced as leads.
              </p>

              {loadingForms ? (
                <div className='text-center py-2'>
                  <Spinner size='sm' color='primary' />
                  <span className='ms-2 text-muted' style={{ fontSize: '0.8rem' }}>Loading forms...</span>
                </div>
              ) : (
                <>
                  <select
                    className='form-select form-select-sm mb-2'
                    style={{ fontSize: '0.8rem' }}
                    value={selectedFormId}
                    onChange={(e) => setSelectedFormId(e.target.value)}
                  >
                    <option value=''>-- Select a form --</option>
                    {forms.map((form) => (
                      <option key={form.id || form.guid} value={form.id || form.guid}>
                        {form.name || form.title || form.id || form.guid}
                      </option>
                    ))}
                  </select>
                  <div className='d-flex gap-2'>
                    <button
                      className='btn btn-sm btn-outline-secondary'
                      onClick={handleLoadForms}
                      disabled={loadingForms}
                    >
                      Refresh Forms
                    </button>
                    <button
                      className='btn btn-sm btn-primary d-flex align-items-center gap-1'
                      onClick={handleSaveSelection}
                      disabled={saving || !selectedFormId}
                    >
                      {saving && <Spinner size='sm' />}
                      <span>{saving ? 'Saving...' : 'Save Selection'}</span>
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Info */}
            <div className='p-3 rounded' style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}>
              <p className='mb-0' style={{ fontSize: '0.8rem', color: '#64748b' }}>
                After saving, HubSpot form submissions will be automatically synced as leads.
                Use Field Mapping to map HubSpot contact properties to your CRM fields.
              </p>
            </div>
          </>
        )}
      </ModalBody>
      <ModalFooter>
        <button className='btn btn-sm btn-soft-danger' onClick={toggle}>Close</button>
      </ModalFooter>
    </>
  );
};

export default HubspotConfigForm;

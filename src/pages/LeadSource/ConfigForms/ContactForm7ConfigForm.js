import React, { useState, useEffect } from 'react';
import {
  ModalBody,
  ModalFooter,
  Spinner,
  Alert,
} from 'reactstrap';
import { RiSurveyLine } from 'react-icons/ri';
import { FiCopy, FiCheck } from 'react-icons/fi';
import { getContactForm7Connection } from '../../../helpers/backend_helper';

const ContactForm7ConfigForm = ({ connection, onSave, toggle }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [connectionDetails, setConnectionDetails] = useState(null);
  const [copied, setCopied] = useState(false);

  const connectionId = connection?._id || connection?.id;

  useEffect(() => {
    if (!connectionId) return;
    setLoading(true);
    setError('');
    getContactForm7Connection(connectionId)
      .then((res) => {
        setConnectionDetails(res.data || res || {});
      })
      .catch(() => {
        setError('Failed to load Contact Form 7 connection details');
      })
      .finally(() => setLoading(false));
  }, [connectionId]);

  const config = connectionDetails?.configuration || connection?.configuration || {};
  const webhookUrl = config.webhookUrl || connectionDetails?.webhookUrl || '';

  const handleCopy = () => {
    if (!webhookUrl) return;
    navigator.clipboard.writeText(webhookUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <>
      <ModalBody>
        {error && (
          <Alert color='danger' className='mb-3' style={{ fontSize: '0.85rem' }} toggle={() => setError('')}>
            {error}
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
            <div className='p-3 rounded mb-3' style={{ backgroundColor: '#eff6ff', border: '1px solid #bfdbfe' }}>
              <div className='d-flex align-items-center justify-content-between'>
                <p className='mb-0 fw-medium' style={{ fontSize: '0.85rem', color: '#2563eb' }}>
                  <RiSurveyLine className='me-1' />
                  Contact Form 7 Connection
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
            <div className='p-3 rounded mb-3' style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0' }}>
              <div className='fw-medium mb-2' style={{ fontSize: '0.83rem', color: '#15803d' }}>
                Connection Details
              </div>
              <div style={{ fontSize: '0.8rem' }}>
                {(config.connectionName || connection?.name || connectionDetails?.name) && (
                  <div className='d-flex justify-content-between mb-1'>
                    <span className='text-muted'>Name</span>
                    <strong>{config.connectionName || connection?.name || connectionDetails?.name}</strong>
                  </div>
                )}
                {connection?.createdAt && (
                  <div className='d-flex justify-content-between mb-1'>
                    <span className='text-muted'>Created</span>
                    <strong>{new Date(connection.createdAt).toLocaleString()}</strong>
                  </div>
                )}
              </div>
            </div>

            {/* Webhook URL */}
            {webhookUrl && (
              <div className='p-3 rounded mb-3' style={{ backgroundColor: '#fefce8', border: '1px solid #fde68a' }}>
                <div className='fw-medium mb-2' style={{ fontSize: '0.83rem', color: '#a16207' }}>
                  Inbound Webhook URL
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
                    {webhookUrl}
                  </code>
                  <button
                    className='btn btn-sm btn-outline-primary d-flex align-items-center'
                    onClick={handleCopy}
                    title='Copy URL'
                    style={{ minWidth: '36px' }}
                  >
                    {copied ? <FiCheck size={14} /> : <FiCopy size={14} />}
                  </button>
                </div>
                <p className='mb-0 mt-2' style={{ fontSize: '0.75rem', color: '#64748b' }}>
                  Add this URL as a webhook in your Contact Form 7 WordPress settings to receive form submissions as leads.
                </p>
              </div>
            )}

            {/* Plugin Download */}
            <div className='p-3 rounded mb-3' style={{ backgroundColor: '#eff6ff', border: '1px solid #bfdbfe' }}>
              <div className='fw-medium mb-2' style={{ fontSize: '0.83rem', color: '#1d4ed8' }}>
                Download CF7 Webhook Plugin
              </div>
              <p className='mb-2' style={{ fontSize: '0.8rem', color: '#64748b' }}>
                Install our custom plugin to connect Contact Form 7 with your webhook.
              </p>
              <a
                href='https://mapi.1automations.com/downloads/cf7-webhook-plugin.zip'
                target='_blank'
                rel='noopener noreferrer'
                className='btn btn-sm btn-primary d-inline-flex align-items-center gap-1'
                style={{ fontSize: '0.8rem' }}
              >
                Download Plugin (.zip)
              </a>
            </div>

            {/* Setup Instructions */}
            <div className='p-3 rounded' style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}>
              <div className='fw-medium mb-2' style={{ fontSize: '0.83rem', color: '#475569' }}>
                Setup Instructions
              </div>
              <ol className='mb-0 ps-3' style={{ fontSize: '0.8rem', color: '#64748b' }}>
                <li className='mb-1'>Install <strong>Contact Form 7</strong> plugin on your WordPress site (if not already installed)</li>
                <li className='mb-1'>Download and upload our <strong>CF7 Webhook Plugin</strong> via Plugins &rarr; Add New &rarr; Upload Plugin</li>
                <li className='mb-1'>Activate the plugin &mdash; you will see <strong>CF7 Webhook</strong> in your WordPress sidebar</li>
                <li className='mb-1'>Open <strong>CF7 Webhook</strong> from the sidebar, select your form, and paste the webhook URL above</li>
                <li className='mb-1'>Submit a test form entry to generate sample data</li>
                <li>Come back here and set up <strong>Field Mapping</strong> to map form fields to CRM fields</li>
              </ol>
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

export default ContactForm7ConfigForm;

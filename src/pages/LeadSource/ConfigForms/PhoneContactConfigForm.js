import React, { useState, useEffect } from 'react';
import {
  ModalBody,
  ModalFooter,
  Spinner,
  Alert,
} from 'reactstrap';
import { ImMobile } from 'react-icons/im';
import { FiCopy, FiCheck } from 'react-icons/fi';
import { QRCodeSVG } from 'qrcode.react';
import { getPhoneContactConnection } from '../../../helpers/backend_helper';

const PhoneContactConfigForm = ({ connection, toggle }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [connectionDetails, setConnectionDetails] = useState(null);
  const [copiedUrl, setCopiedUrl] = useState(false);

  const connectionId = connection?._id || connection?.id;

  useEffect(() => {
    if (!connectionId) return;
    setLoading(true);
    setError('');
    getPhoneContactConnection(connectionId)
      .then((res) => {
        setConnectionDetails(res.data || res || {});
      })
      .catch(() => {
        setError('Failed to load connection details');
      })
      .finally(() => setLoading(false));
  }, [connectionId]);

  const config = connectionDetails?.configuration || connection?.configuration || {};
  const webhookUrl = config.webhookUrl || connectionDetails?.webhookUrl || '';

  const handleCopyUrl = () => {
    if (!webhookUrl) return;
    navigator.clipboard.writeText(webhookUrl).then(() => {
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2000);
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
            <div className='p-3 rounded mb-3' style={{ backgroundColor: '#fefce8', border: '1px solid #fde68a' }}>
              <div className='d-flex align-items-center justify-content-between'>
                <p className='mb-0 fw-medium' style={{ fontSize: '0.85rem', color: '#a16207' }}>
                  <ImMobile className='me-1' />
                  Phone Contact Connection
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
            {(config.connectionName || connection?.name) && (
              <div className='p-3 rounded mb-3' style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0' }}>
                <div className='fw-medium mb-2' style={{ fontSize: '0.83rem', color: '#15803d' }}>
                  Connection Details
                </div>
                <div style={{ fontSize: '0.8rem' }}>
                  <div className='d-flex justify-content-between mb-1'>
                    <span className='text-muted'>Name</span>
                    <strong>{config.connectionName || connection?.name}</strong>
                  </div>
                  {connection?.createdAt && (
                    <div className='d-flex justify-content-between mb-1'>
                      <span className='text-muted'>Created</span>
                      <strong>{new Date(connection.createdAt).toLocaleString()}</strong>
                    </div>
                  )}
                  {config.totalImported !== undefined && (
                    <div className='d-flex justify-content-between mb-1'>
                      <span className='text-muted'>Total Imported</span>
                      <strong>{config.totalImported}</strong>
                    </div>
                  )}
                  {config.lastImportAt && (
                    <div className='d-flex justify-content-between mb-1'>
                      <span className='text-muted'>Last Import</span>
                      <strong>{new Date(config.lastImportAt).toLocaleString()}</strong>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Webhook URL */}
            {webhookUrl && (
              <div className='p-3 rounded mb-3' style={{ backgroundColor: '#fefce8', border: '1px solid #fde68a' }}>
                <div className='fw-medium mb-2' style={{ fontSize: '0.83rem', color: '#a16207' }}>
                  Webhook URL
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
                    onClick={handleCopyUrl}
                    title='Copy URL'
                    style={{ minWidth: '36px' }}
                  >
                    {copiedUrl ? <FiCheck size={14} /> : <FiCopy size={14} />}
                  </button>
                </div>
              </div>
            )}

            {/* QR Code */}
            {webhookUrl && (
              <div className='p-3 rounded mb-3' style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}>
                <div className='fw-medium mb-2' style={{ fontSize: '0.83rem', color: '#475569' }}>
                  Scan QR Code with your Phone
                </div>
                <p className='text-muted mb-3' style={{ fontSize: '0.75rem' }}>
                  Open your phone camera and scan this QR code to access the webhook URL.
                </p>
                <div className='d-flex justify-content-center'>
                  <QRCodeSVG
                    value={webhookUrl}
                    size={200}
                    level='M'
                    includeMargin
                    style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '8px', backgroundColor: '#fff' }}
                  />
                </div>
              </div>
            )}

            {/* Instructions */}
            <div className='p-3 rounded' style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}>
              <div className='fw-medium mb-2' style={{ fontSize: '0.83rem', color: '#475569' }}>
                How to Use
              </div>
              <ol className='mb-0 ps-3' style={{ fontSize: '0.8rem', color: '#64748b' }}>
                <li className='mb-1'>Scan the QR code above with your phone camera</li>
                <li className='mb-1'>Open the link to send contacts from your phone</li>
                <li>Contacts will automatically be imported as leads</li>
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

export default PhoneContactConfigForm;

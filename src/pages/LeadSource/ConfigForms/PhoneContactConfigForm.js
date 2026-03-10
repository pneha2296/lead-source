import React, { useState, useEffect, useRef } from 'react';
import {
  ModalBody,
  ModalFooter,
  Spinner,
  Alert,
} from 'reactstrap';
import { ImMobile } from 'react-icons/im';
import { FiUpload, FiCheck } from 'react-icons/fi';
import { HiOutlineUserGroup } from 'react-icons/hi';
import { getPhoneContactConnection, getPhoneContactUploadUrl, processPhoneContactFile, uploadPhoneContactJson } from '../../../helpers/backend_helper';

const PhoneContactConfigForm = ({ connection, toggle }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [connectionDetails, setConnectionDetails] = useState(null);
  const [activeMethod, setActiveMethod] = useState('vcf');

  // VCF upload state
  const [uploading, setUploading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const fileInputRef = useRef(null);

  // JSON upload state
  const [jsonContacts, setJsonContacts] = useState('');
  const [uploadingJson, setUploadingJson] = useState(false);

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

  const handleVcfUpload = async () => {
    const file = fileInputRef.current?.files?.[0];
    if (!file) {
      setError('Please select a .vcf file first.');
      return;
    }
    if (!file.name.endsWith('.vcf')) {
      setError('Only .vcf files are supported.');
      return;
    }

    setUploading(true);
    setError('');
    setSuccess('');
    try {
      // Step 1: Get pre-signed S3 upload URL
      const urlRes = await getPhoneContactUploadUrl(connectionId);
      const uploadUrl = urlRes?.uploadUrl || urlRes?.data?.uploadUrl;
      if (!uploadUrl) throw new Error('Failed to get upload URL');

      // Step 2: Upload file to S3
      await fetch(uploadUrl, {
        method: 'PUT',
        body: file,
        headers: { 'Content-Type': 'text/vcard' },
      });

      setUploading(false);
      setProcessing(true);

      // Step 3: Process the uploaded file
      const processRes = await processPhoneContactFile(connectionId);
      const imported = processRes?.imported || processRes?.data?.imported || 0;
      setSuccess(`File uploaded and processed successfully! ${imported} contacts imported.`);
      fileInputRef.current.value = '';
    } catch (err) {
      setError(err?.msg || err?.message || 'Failed to upload and process file.');
    } finally {
      setUploading(false);
      setProcessing(false);
    }
  };

  const handleJsonUpload = async () => {
    setError('');
    setSuccess('');
    let contacts;
    try {
      contacts = JSON.parse(jsonContacts);
      if (!Array.isArray(contacts)) {
        contacts = [contacts];
      }
    } catch {
      setError('Invalid JSON format. Please provide a valid JSON array of contacts.');
      return;
    }

    setUploadingJson(true);
    try {
      const res = await uploadPhoneContactJson(connectionId, { contacts });
      const imported = res?.imported || res?.data?.imported || contacts.length;
      setSuccess(`${imported} contacts synced successfully!`);
      setJsonContacts('');
    } catch (err) {
      setError(err?.msg || err?.message || 'Failed to sync contacts.');
    } finally {
      setUploadingJson(false);
    }
  };

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

            {/* Upload Method Tabs */}
            <div className='d-flex gap-2 mb-3'>
              <button
                className={`btn btn-sm flex-grow-1 d-flex align-items-center justify-content-center gap-1`}
                style={{
                  backgroundColor: activeMethod === 'vcf' ? '#3b82f6' : '#f1f5f9',
                  color: activeMethod === 'vcf' ? '#fff' : '#64748b',
                  border: 'none',
                  transition: 'all 0.2s',
                }}
                onClick={() => setActiveMethod('vcf')}
              >
                <FiUpload size={14} />
                <span>Upload VCF File</span>
              </button>
              <button
                className={`btn btn-sm flex-grow-1 d-flex align-items-center justify-content-center gap-1`}
                style={{
                  backgroundColor: activeMethod === 'json' ? '#3b82f6' : '#f1f5f9',
                  color: activeMethod === 'json' ? '#fff' : '#64748b',
                  border: 'none',
                  transition: 'all 0.2s',
                }}
                onClick={() => setActiveMethod('json')}
              >
                <HiOutlineUserGroup size={14} />
                <span>JSON Sync</span>
              </button>
            </div>

            {/* VCF Upload */}
            {activeMethod === 'vcf' && (
              <div className='p-3 rounded mb-3' style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}>
                <div className='fw-medium mb-2' style={{ fontSize: '0.83rem', color: '#475569' }}>
                  Upload VCF / vCard File
                </div>
                <p className='text-muted mb-2' style={{ fontSize: '0.75rem' }}>
                  Export contacts from your phone as a .vcf file and upload it here. The system will parse the file and import all contacts.
                </p>
                <div className='d-flex align-items-center gap-2'>
                  <input
                    ref={fileInputRef}
                    type='file'
                    accept='.vcf'
                    className='form-control form-control-sm'
                    style={{ fontSize: '0.8rem' }}
                  />
                  <button
                    className='btn btn-sm btn-primary d-flex align-items-center gap-1'
                    onClick={handleVcfUpload}
                    disabled={uploading || processing}
                    style={{ whiteSpace: 'nowrap' }}
                  >
                    {(uploading || processing) && <Spinner size='sm' />}
                    <span>{uploading ? 'Uploading...' : processing ? 'Processing...' : 'Upload & Import'}</span>
                  </button>
                </div>
              </div>
            )}

            {/* JSON Upload */}
            {activeMethod === 'json' && (
              <div className='p-3 rounded mb-3' style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}>
                <div className='fw-medium mb-2' style={{ fontSize: '0.83rem', color: '#475569' }}>
                  Direct JSON Contact Sync
                </div>
                <p className='text-muted mb-2' style={{ fontSize: '0.75rem' }}>
                  Paste a JSON array of contacts to sync directly. Ideal for mobile app integrations.
                </p>
                <textarea
                  className='form-control form-control-sm mb-2'
                  rows={5}
                  style={{ fontSize: '0.78rem', fontFamily: 'monospace' }}
                  placeholder={`[\n  { "name": "John Doe", "phone": "+1234567890", "email": "john@example.com" },\n  { "name": "Jane Smith", "phone": "+0987654321" }\n]`}
                  value={jsonContacts}
                  onChange={(e) => setJsonContacts(e.target.value)}
                />
                <button
                  className='btn btn-sm btn-primary d-flex align-items-center gap-1'
                  onClick={handleJsonUpload}
                  disabled={uploadingJson || !jsonContacts.trim()}
                >
                  {uploadingJson && <Spinner size='sm' />}
                  <span>{uploadingJson ? 'Syncing...' : 'Sync Contacts'}</span>
                </button>
              </div>
            )}

            {/* Info */}
            <div className='p-3 rounded' style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}>
              <p className='mb-0' style={{ fontSize: '0.8rem', color: '#64748b' }}>
                Imported contacts will be saved as leads. If field mappings are configured, CRM contacts will be created automatically.
                Use the Logs section to track all imported contacts.
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

export default PhoneContactConfigForm;

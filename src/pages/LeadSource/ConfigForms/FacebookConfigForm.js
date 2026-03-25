import React, { useState, useEffect } from 'react';
import {
  ModalBody,
  ModalFooter,
  FormGroup,
  Label,
  Spinner,
  Alert,
} from 'reactstrap';
import { BsGearWideConnected } from 'react-icons/bs';
import { FaMeta } from 'react-icons/fa6';
import { getFacebookPages, getFacebookForms } from '../../../helpers/backend_helper';
import SearchableSelect from './SearchableSelect';

const FacebookConfigForm = ({ connection, onSave, toggle }) => {
  const [pages, setPages] = useState([]);
  const [forms, setForms] = useState([]);
  const [loadingPages, setLoadingPages] = useState(false);
  const [loadingForms, setLoadingForms] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [selectedPage, setSelectedPage] = useState(null);
  const [selectedForm, setSelectedForm] = useState(null);

  useEffect(() => {
    setError('');
    setLoadingPages(true);
    getFacebookPages(connection?._id)
      .then((res) => {
        const pageList = res.data || res || [];
        setPages(pageList);
        if (connection?.configuration?.pageId) {
          const existing = pageList.find((p) => p.id === connection.configuration.pageId);
          if (existing) setSelectedPage(existing);
        }
      })
      .catch(() => {
        setError('Failed to load Facebook pages');
        setPages([]);
      })
      .finally(() => setLoadingPages(false));

    return () => {
      setPages([]);
      setForms([]);
      setSelectedPage(null);
      setSelectedForm(null);
    };
  }, [connection]);

  useEffect(() => {
    if (selectedPage) {
      setLoadingForms(true);
      setSelectedForm(null);
      setForms([]);
      getFacebookForms({
        pageId: selectedPage.id,
        pageAccessToken: selectedPage.accessToken || selectedPage.access_token,
      })
        .then((res) => {
          const formList = res?.leadForms || res || [];
          setForms(formList);
          if (connection?.configuration?.formId) {
            const existing = formList.find((f) => f.id === connection.configuration.formId);
            if (existing) setSelectedForm(existing);
          }
        })
        .catch(() => {
          setError('Failed to load forms for this page');
          setForms([]);
        })
        .finally(() => setLoadingForms(false));
    }
  }, [selectedPage]);

  const handlePageSelect = (page) => {
    if (!page) {
      setSelectedPage(null);
      setForms([]);
      setSelectedForm(null);
      return;
    }
    setSelectedPage(page);
  };

  const handleSave = async () => {
    if (!selectedPage || !selectedForm) return;
    setSaving(true);
    try {
      await onSave(connection._id || connection.id, {
        _id: connection._id || connection.id,
        pageId: selectedPage.id,
        pageName: selectedPage.name,
        pageAccessToken: selectedPage.accessToken || selectedPage.access_token,
        formId: selectedForm.id,
        formName: selectedForm.name,
      });
    } finally {
      setSaving(false);
    }
  };

  const config = connection?.configuration || {};

  return (
    <>
      <ModalBody>
        {error && (
          <Alert color='danger' className='mb-3' style={{ fontSize: '0.85rem' }}>
            {error}
          </Alert>
        )}

        {config.pageName && (
          <div className='p-3 rounded mb-3' style={{ backgroundColor: '#f0f9ff', border: '1px solid #bae6fd' }}>
            <p className='mb-1 fw-medium' style={{ fontSize: '0.85rem', color: '#0369a1' }}>
              <FaMeta className='me-1' style={{ color: '#1877F2' }} />
              Current Configuration
            </p>
            <div className='d-flex gap-3 mt-2' style={{ fontSize: '0.8rem' }}>
              <div>
                <span className='text-muted'>Page:</span> <strong>{config.pageName}</strong>
              </div>
              <div>
                <span className='text-muted'>Form:</span> <strong>{config.formName || '-'}</strong>
              </div>
            </div>
          </div>
        )}

        <FormGroup className='mb-3'>
          <Label className='fw-medium'>
            Facebook Page
            {loadingPages && <Spinner size='sm' className='ms-2' />}
          </Label>
          {loadingPages ? (
            <div className='text-center py-2'>
              <Spinner size='sm' color='primary' />
              <span className='text-muted ms-2' style={{ fontSize: '0.85rem' }}>Loading pages...</span>
            </div>
          ) : (
            <SearchableSelect
              items={pages}
              value={selectedPage}
              onChange={handlePageSelect}
              placeholder='Search pages...'
              disabled={pages.length === 0}
            />
          )}
        </FormGroup>

        <FormGroup className='mb-3'>
          <Label className='fw-medium'>
            Lead Form
            {loadingForms && <Spinner size='sm' className='ms-2' />}
          </Label>
          {!selectedPage ? (
            <p className='text-muted mb-0' style={{ fontSize: '0.8rem' }}>
              Select a page first to load forms
            </p>
          ) : loadingForms ? (
            <div className='text-center py-2'>
              <Spinner size='sm' color='primary' />
              <span className='text-muted ms-2' style={{ fontSize: '0.85rem' }}>Loading forms...</span>
            </div>
          ) : (
            <SearchableSelect
              items={forms}
              value={selectedForm}
              onChange={(form) => setSelectedForm(form || null)}
              placeholder='Search forms...'
              disabled={forms.length === 0}
            />
          )}
        </FormGroup>

        {selectedPage && selectedForm && (
          <div className='p-3 rounded' style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0' }}>
            <p className='mb-1 fw-medium' style={{ fontSize: '0.85rem', color: '#15803d' }}>
              Updated Configuration
            </p>
            <div style={{ fontSize: '0.8rem' }}>
              <div className='mb-1'>
                <span className='text-muted'>Page:</span> <strong>{selectedPage.name}</strong>
              </div>
              <div>
                <span className='text-muted'>Form:</span> <strong>{selectedForm.name}</strong>
              </div>
            </div>
          </div>
        )}
      </ModalBody>
      <ModalFooter>
        <button className='btn btn-sm btn-soft-danger' onClick={toggle}>Cancel</button>
        <button
          className='btn btn-sm btn-primary d-flex align-items-center gap-1'
          onClick={handleSave}
          disabled={!selectedPage || !selectedForm || saving}
        >
          {saving ? <Spinner size='sm' /> : <BsGearWideConnected />}
          <span>{saving ? 'Saving...' : 'Save Changes'}</span>
        </button>
      </ModalFooter>
    </>
  );
};

export default FacebookConfigForm;

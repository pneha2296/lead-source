import React, { useState } from 'react';
import { withRouter, useHistory, useParams, useLocation } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import {
  Container,
  Card,
  CardBody,
  Input,
  Label,
  FormGroup,
} from 'reactstrap';

import BreadCrumb from '../../Components/Common/BreadCrumb';
import MetaTag from '../../Components/Common/Meta';

//icons
import { FaMeta } from 'react-icons/fa6';
import { MdOutlineWebhook } from 'react-icons/md';
import { SiGoogleads } from 'react-icons/si';
import { SiLinkedin } from 'react-icons/si';
import { SiTypeform } from 'react-icons/si';
import { CgWebsite } from 'react-icons/cg';
import { SiGoogleforms } from 'react-icons/si';
import { ImMobile } from 'react-icons/im';
import { IoQrCodeOutline } from 'react-icons/io5';
import { SiZoho } from 'react-icons/si';
import { FaHubspot } from 'react-icons/fa';
import { LiaSalesforce } from 'react-icons/lia';
import { FaIndustry } from 'react-icons/fa';
import { FaHandshake } from 'react-icons/fa';
import { BsBuildingsFill } from 'react-icons/bs';
import { MdRestaurant } from 'react-icons/md';
import { BsGearWideConnected } from 'react-icons/bs';
import { IoArrowBack } from 'react-icons/io5';

const sourceConfig = {
  facebookLeadAds: { name: 'Facebook Lead Ads', icon: <FaMeta />, color: '#1877F2' },
  webhook: { name: 'Webhook', icon: <MdOutlineWebhook />, color: '#6366f1' },
  form: { name: 'Form', icon: <SiGoogleforms />, color: '#673AB7' },
  googleForm: { name: 'Google Form', icon: <SiGoogleforms />, color: '#673AB7' },
  typeform: { name: 'Typeform', icon: <SiTypeform />, color: '#262627' },
  googleAds: { name: 'Google Ads', icon: <SiGoogleads />, color: '#4285F4' },
  linkedinLeadGen: { name: 'LinkedIn Lead Gen', icon: <SiLinkedin />, color: '#0077B5' },
  landingPage: { name: 'Landing Page', icon: <CgWebsite />, color: '#10b981' },
  phoneContact: { name: 'Phone Contact', icon: <ImMobile />, color: '#f59e0b' },
  ocrApp: { name: 'OCR App', icon: <IoQrCodeOutline />, color: '#8b5cf6' },
  zohoCrm: { name: 'Zoho CRM', icon: <SiZoho />, color: '#D32F2F' },
  hubspotCrm: { name: 'Hubspot CRM', icon: <FaHubspot />, color: '#FF7A59' },
  salesforce: { name: 'Salesforce', icon: <LiaSalesforce />, color: '#00A1E0' },
  indiaMart: { name: 'India Mart', icon: <FaIndustry />, color: '#2563eb' },
  tradeIndia: { name: 'Trade India', icon: <FaHandshake />, color: '#16a34a' },
  magicBricks: { name: 'Magic Bricks', icon: <BsBuildingsFill />, color: '#dc2626' },
  zomato: { name: 'Zomato', icon: <MdRestaurant />, color: '#e23744' },
};

const ConnectionSetup = () => {
  const history = useHistory();
  const { sourceKey } = useParams();
  const location = useLocation();

  const source = sourceConfig[sourceKey] || { name: sourceKey, icon: <BsGearWideConnected />, color: '#64748b' };

  const [connectionName, setConnectionName] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [webhookUrl, setWebhookUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSave = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      history.push('/settings');
    }, 1000);
  };

  return (
    <React.Fragment>
      <div className='page-content'>
        <MetaTag pageTitle={`Setup - ${source.name}`} />
        <Container fluid>
          <BreadCrumb title={source.name} pageTitle='Lead Source' />

          {/* Back Button */}
          <button
            className='btn btn-sm btn-soft-primary d-flex align-items-center gap-2 mb-4'
            onClick={() => history.push('/settings')}
          >
            <IoArrowBack />
            <span>Back to Lead Sources</span>
          </button>

          {/* Source Header */}
          <Card className='border mb-4'>
            <CardBody>
              <div className='d-flex align-items-center gap-3'>
                <div
                  style={{
                    fontSize: '2rem',
                    background: '#f1f5f9',
                    borderRadius: '10px',
                    padding: '0.6rem',
                    width: '60px',
                    height: '60px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: source.color,
                  }}
                >
                  {source.icon}
                </div>
                <div>
                  <h4 className='mb-1' style={{ color: '#1e293b', fontWeight: '600' }}>
                    {source.name}
                  </h4>
                  <p className='text-muted mb-0'>Configure your connection settings below</p>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Connection Form */}
          <Card className='border'>
            <CardBody>
              <h5 className='mb-4' style={{ fontWeight: '600', color: '#1e293b' }}>
                Connection Settings
              </h5>

              <FormGroup className='mb-3'>
                <Label for='connectionName' className='fw-medium'>
                  Connection Name
                </Label>
                <Input
                  type='text'
                  id='connectionName'
                  placeholder='Enter a name for this connection'
                  value={connectionName}
                  onChange={(e) => setConnectionName(e.target.value)}
                />
              </FormGroup>

              <FormGroup className='mb-3'>
                <Label for='apiKey' className='fw-medium'>
                  API Key
                </Label>
                <Input
                  type='password'
                  id='apiKey'
                  placeholder='Enter your API key'
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                />
                <small className='text-muted'>
                  You can find your API key in the {source.name} dashboard settings.
                </small>
              </FormGroup>

              <FormGroup className='mb-4'>
                <Label for='webhookUrl' className='fw-medium'>
                  Webhook URL (Optional)
                </Label>
                <Input
                  type='text'
                  id='webhookUrl'
                  placeholder='https://...'
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                />
              </FormGroup>

              <div className='d-flex gap-2'>
                <button
                  className='btn btn-primary d-flex align-items-center gap-2'
                  onClick={handleSave}
                  disabled={isSubmitting || !connectionName}
                >
                  {isSubmitting ? (
                    <span className='spinner-border spinner-border-sm' role='status' aria-hidden='true'></span>
                  ) : (
                    <BsGearWideConnected />
                  )}
                  <span>{isSubmitting ? 'Saving...' : 'Save Connection'}</span>
                </button>
                <button
                  className='btn btn-soft-danger'
                  onClick={() => history.push('/settings')}
                >
                  Cancel
                </button>
              </div>
            </CardBody>
          </Card>
        </Container>
      </div>
    </React.Fragment>
  );
};

ConnectionSetup.propTypes = {
  location: PropTypes.object,
  t: PropTypes.any,
};

export default withRouter(withTranslation()(ConnectionSetup));

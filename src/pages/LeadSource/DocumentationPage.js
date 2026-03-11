import React, { useState } from 'react';
import { withRouter, useParams, useHistory } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { Container, Card, CardBody } from 'reactstrap';
import BreadCrumb from '../../Components/Common/BreadCrumb';
import MetaTag from '../../Components/Common/Meta';
import { getSourceDocs } from './sourceDocsConfig';

import { IoArrowBack } from 'react-icons/io5';
import { FiCheckCircle } from 'react-icons/fi';
import { HiOutlineLightBulb } from 'react-icons/hi';
import { BsPlayCircle } from 'react-icons/bs';

//source icons
import { FaMeta } from 'react-icons/fa6';
import { MdOutlineWebhook, MdOutlineNoteAlt } from 'react-icons/md';
import { SiGoogleads, SiLinkedin, SiTypeform, SiGoogleforms, SiZoho } from 'react-icons/si';
import { CgWebsite } from 'react-icons/cg';
import { ImMobile } from 'react-icons/im';
import { IoQrCodeOutline } from 'react-icons/io5';
import { FaHubspot, FaIndustry, FaHandshake } from 'react-icons/fa';
import { LiaSalesforce } from 'react-icons/lia';
import { BsBuildingsFill } from 'react-icons/bs';
import { MdRestaurant } from 'react-icons/md';

const SOURCE_ICONS = {
  facebookLeadAds: <FaMeta style={{ color: '#1877F2' }} />,
  webhook: <MdOutlineWebhook style={{ color: '#6366f1' }} />,
  form: <SiGoogleforms style={{ color: '#673AB7' }} />,
  googleForm: <SiGoogleforms style={{ color: '#673AB7' }} />,
  typeform: <SiTypeform style={{ color: '#262627' }} />,
  googleAds: <SiGoogleads style={{ color: '#4285F4' }} />,
  linkedinLeadGen: <SiLinkedin style={{ color: '#0077B5' }} />,
  landingPage: <CgWebsite style={{ color: '#10b981' }} />,
  phoneContact: <ImMobile style={{ color: '#f59e0b' }} />,
  ocrApp: <IoQrCodeOutline style={{ color: '#8b5cf6' }} />,
  zohoCrm: <SiZoho style={{ color: '#D32F2F' }} />,
  hubspotCrm: <FaHubspot style={{ color: '#FF7A59' }} />,
  salesforce: <LiaSalesforce style={{ color: '#00A1E0' }} />,
  indiaMart: <FaIndustry style={{ color: '#2563eb' }} />,
  tradeIndia: <FaHandshake style={{ color: '#16a34a' }} />,
  magicBricks: <BsBuildingsFill style={{ color: '#dc2626' }} />,
  zomato: <MdRestaurant style={{ color: '#e23744' }} />,
};

const DocumentationPage = () => {
  const { sourceKey } = useParams();
  const history = useHistory();
  const [activeStep, setActiveStep] = useState(0);

  const docs = getSourceDocs(sourceKey);
  const sourceIcon = SOURCE_ICONS[sourceKey] || null;

  if (!docs) {
    return (
      <div className='page-content'>
        <Container fluid>
          <BreadCrumb title='Documentation' pageTitle='Lead Source' />
          <div className='text-center py-5'>
            <p className='text-muted'>No documentation available for this source.</p>
            <button className='btn btn-sm btn-primary' onClick={() => history.push('/settings')}>
              Back to Lead Sources
            </button>
          </div>
        </Container>
      </div>
    );
  }

  const { title, description, videoUrl, steps, features } = docs;
  const totalSteps = steps?.length || 0;

  return (
    <div className='page-content'>
      <MetaTag pageTitle={`${title} — Documentation`} />
      <Container fluid>
        <BreadCrumb title={`${title} Documentation`} pageTitle='Lead Source' />

        {/* Back Button */}
        <button
          className='btn btn-sm btn-soft-primary d-flex align-items-center gap-2 mb-4'
          onClick={() => history.push('/settings')}
        >
          <IoArrowBack />
          <span>Back to Lead Sources</span>
        </button>

        {/* Header Card */}
        <Card className='border mb-4'>
          <CardBody>
            <div className='d-flex align-items-start gap-3'>
              {sourceIcon && (
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
                  }}
                >
                  {sourceIcon}
                </div>
              )}
              <div className='flex-grow-1'>
                <h4 className='mb-1' style={{ color: '#1e293b', fontWeight: '700' }}>
                  {title} — Setup Guide
                </h4>
                <p className='text-muted mb-0' style={{ fontSize: '0.9rem', lineHeight: '1.5' }}>
                  {description}
                </p>
              </div>
            </div>
            {videoUrl && (
              <div className='mt-3'>
                <a
                  href={videoUrl}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='btn btn-sm d-inline-flex align-items-center gap-2'
                  style={{ backgroundColor: '#FF0000', color: '#fff', borderRadius: '6px' }}
                >
                  <BsPlayCircle size={16} />
                  <span>Watch Video Tutorial</span>
                </a>
              </div>
            )}
          </CardBody>
        </Card>

        <div className='row'>
          {/* Left Sidebar — Step List */}
          <div className='col-lg-4 col-xl-3 mb-4'>
            <Card className='border sticky-top' style={{ top: '80px', zIndex: 1 }}>
              <CardBody className='p-3'>
                <div className='fw-medium mb-3' style={{ fontSize: '0.85rem', color: '#475569' }}>
                  Steps ({totalSteps})
                </div>
                {steps.map((step, idx) => (
                  <button
                    key={idx}
                    className='btn w-100 text-start d-flex align-items-center gap-2 mb-1 p-2'
                    style={{
                      backgroundColor: idx === activeStep ? '#eff6ff' : 'transparent',
                      border: idx === activeStep ? '1px solid #bfdbfe' : '1px solid transparent',
                      borderRadius: '8px',
                      fontSize: '0.83rem',
                      color: idx === activeStep ? '#1d4ed8' : '#475569',
                      fontWeight: idx === activeStep ? '600' : '400',
                      transition: 'all 0.2s',
                    }}
                    onClick={() => setActiveStep(idx)}
                  >
                    <span
                      className='d-flex align-items-center justify-content-center'
                      style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        backgroundColor: idx === activeStep ? '#3b82f6' : idx < activeStep ? '#93c5fd' : '#e2e8f0',
                        color: idx <= activeStep ? '#fff' : '#94a3b8',
                        fontSize: '0.7rem',
                        fontWeight: '700',
                        flexShrink: 0,
                      }}
                    >
                      {idx + 1}
                    </span>
                    <span className='text-truncate'>{step.title}</span>
                  </button>
                ))}
              </CardBody>
            </Card>
          </div>

          {/* Right Content — Active Step */}
          <div className='col-lg-8 col-xl-9'>
            <Card className='border mb-4'>
              <CardBody>
                {/* Step Header */}
                <div className='d-flex align-items-center gap-2 mb-3'>
                  <span
                    className='d-flex align-items-center justify-content-center fw-bold'
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      backgroundColor: '#3b82f6',
                      color: '#fff',
                      fontSize: '0.85rem',
                      flexShrink: 0,
                    }}
                  >
                    {activeStep + 1}
                  </span>
                  <h5 className='mb-0 fw-bold' style={{ color: '#1e293b' }}>
                    {steps[activeStep].title}
                  </h5>
                </div>

                {/* Step Description */}
                <p className='text-muted mb-0' style={{ fontSize: '0.9rem', lineHeight: '1.7' }}>
                  {steps[activeStep].description}
                </p>

                
                {/* Step Note */}
                {steps[activeStep].note && (
                  <div
                    className='d-flex align-items-start gap-2 mt-4 p-3 rounded'
                    style={{ backgroundColor: '#f0d4da', border: '1px solid #D2042D' }}
                  >
                    <MdOutlineNoteAlt style={{ color: '#D2042D', fontSize: '1.2rem', flexShrink: 0, marginTop: '2px' }} />
                    <span style={{ fontSize: '0.85rem', color: '#D2042D', lineHeight: '1.5' }}>
                      {steps[activeStep].note}
                    </span>
                  </div>
                )}

                {/* Step Tip */}
                {steps[activeStep].tip && (
                  <div
                    className='d-flex align-items-start gap-2 mt-4 p-3 rounded'
                    style={{ backgroundColor: '#fffbeb', border: '1px solid #fde68a' }}
                  >
                    <HiOutlineLightBulb style={{ color: '#d97706', fontSize: '1.2rem', flexShrink: 0, marginTop: '2px' }} />
                    <span style={{ fontSize: '0.85rem', color: '#92400e', lineHeight: '1.5' }}>
                      {steps[activeStep].tip}
                    </span>
                  </div>
                )}

                {/* Step Image */}
                {steps[activeStep].image && (
                  <div className='mt-4'>
                    {Array.isArray(steps[activeStep].image) ? (
                      <div className='row g-3'>
                        {steps[activeStep].image.map((img, index) => (
                          <div key={index} className='col-12 col-md-6'>
                            <img
                              src={img}
                              alt={`${steps[activeStep].title} - ${index + 1}`}
                              style={{
                                width: '100%',
                                borderRadius: '10px',
                                border: '1px solid #e2e8f0',
                                maxHeight: '450px',
                                objectFit: 'contain',
                                backgroundColor: '#f8fafc',
                              }}
                            />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <img
                        src={steps[activeStep].image}
                        alt={steps[activeStep].title}
                        style={{
                          width: '100%',
                          borderRadius: '10px',
                          border: '1px solid #e2e8f0',
                          maxHeight: '450px',
                          objectFit: 'contain',
                          backgroundColor: '#f8fafc',
                        }}
                      />
                    )}
                  </div>
                )}

                {/* Navigation */}
                <div className='d-flex justify-content-between mt-4 pt-3' style={{ borderTop: '1px solid #e2e8f0' }}>
                  <button
                    className='btn btn-sm btn-outline-secondary d-flex align-items-center gap-1'
                    onClick={() => setActiveStep((s) => Math.max(0, s - 1))}
                    disabled={activeStep === 0}
                  >
                    <i className='ri-arrow-left-s-line'></i>
                    <span>Previous</span>
                  </button>
                  <span className='text-muted align-self-center' style={{ fontSize: '0.8rem' }}>
                    {activeStep + 1} / {totalSteps}
                  </span>
                  <button
                    className='btn btn-sm btn-primary d-flex align-items-center gap-1'
                    onClick={() => setActiveStep((s) => Math.min(totalSteps - 1, s + 1))}
                    disabled={activeStep === totalSteps - 1}
                  >
                    <span>Next</span>
                    <i className='ri-arrow-right-s-line'></i>
                  </button>
                </div>
              </CardBody>
            </Card>

            {/* Features Card */}
            {features && features.length > 0 && (
              <Card className='border mb-4'>
                <CardBody>
                  <h6 className='fw-bold mb-3' style={{ color: '#15803d' }}>Key Features</h6>
                  <div className='row'>
                    {features.map((feature, idx) => (
                      <div key={idx} className='col-md-6 mb-2'>
                        <div className='d-flex align-items-center gap-2'>
                          <FiCheckCircle size={14} style={{ color: '#22c55e', flexShrink: 0 }} />
                          <span style={{ fontSize: '0.85rem', color: '#334155' }}>{feature}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardBody>
              </Card>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
};

DocumentationPage.propTypes = {
  location: PropTypes.object,
  t: PropTypes.any,
};

export default withRouter(withTranslation()(DocumentationPage));

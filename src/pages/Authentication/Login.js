import React, { useEffect, useState } from 'react';
import { Card, CardBody, Col, Container, Input, Label, Row, Button, Form, FormFeedback, Table } from 'reactstrap';

import { useHistory, useLocation, Redirect } from 'react-router-dom';
//redux
import { useSelector, useDispatch } from 'react-redux';

import { withRouter, Link } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

// Formik validation
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { IoLogOutOutline } from 'react-icons/io5';

//React Toast
import { ToastContainer, toast } from 'react-toastify';

import { loginUser, logoutUser, resetLogin } from '../../store/actions';
import Preloader from '../../Components/Loaders/Preloader';
import ReCAPTCHA from 'react-google-recaptcha';
import { ReCAPTCHA_SITE_KEY, decrypt } from './../../security';
import DefaultScreen from '../../Components/Screen/Auth/DefaultScreen';
import ThemeOne from '../../Components/Screen/Auth/ThemeOne';
import ThemeTwo from '../../Components/Screen/Auth/ThemeTwo';
import MobileAppLogo from './../../assets/images/mobile-app.png';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const recaptchaRef = React.createRef();

const Login = (props) => {
  const history = useHistory();
  let query = useQuery();
  let isExpired = query.get('expired') !== null;

  const dispatch = useDispatch();

  const { userRNP, isUserLogout } = useSelector((state) => ({
    userRNP: state.UserSession.userRNP,
    isUserLogout: state.Login.isUserLogout,
  }));

  const [captcha, setCaptcha] = React.useState(null);
  const [captchaError, setCaptchaError] = React.useState(null);

  const [prevSession, setPrevSession] = React.useState(null);

  const [authVariables, setAuthVariables] = React.useState({});

  const [theme, setTheme] = React.useState('default');
  const [loading, setLoading] = React.useState(false);
  const [enabledSignup, setEnabledSignup] = React.useState(false);
  const [loginWait, setLoginWait] = React.useState(false);

  const [privacy, setPrivacy] = useState('#');
  const [terms, setTerms] = useState('#');

  const userInfo = localStorage.getItem('authToken');
  if (userInfo !== null) {
    if (userRNP.role === 'developer') {
      history.push('/products/automation');
    } else {
      window.location.href = '/products';
    }
  }

  useEffect(() => {
    try {
      if (!['cbleadsource.netlify.app', 'localhost'].includes(window.location.hostname)) {
        window.location.href = `/login?forward_to=${encodeURIComponent('/leadsource/settings')}`;
        return;
      }
      let session = sessionStorage.getItem('prev_session');
      if (session) {
        session = JSON.parse(session);
        let payload = {
          country: session.country,
          countryCode: session.countryCode,
          regionName: session.regionName,
          region: session.region,
          city: session.city,
          zip: session.zip,
          ip: session.query,
          timezone: session.timezone,
        };
        setPrevSession(payload);
      }
    } catch (error) {}
  }, []);

  function proceedLogout() {
    setLoginWait(true);
    dispatch(logoutUser());
  }

  function keepLoggedIn() {
    sessionStorage.removeItem('prev_session');
    window.location.href = '/login';
  }

  useEffect(() => {
    if (isUserLogout) {
      return (window.location.href = '/login');
    }
  }, [isUserLogout]);

  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      email: '' || '',
      password: '' || '',
    },
    validationSchema: Yup.object({
      email: Yup.string().required(props.t('Please Enter Your Email')),
      password: Yup.string().required(props.t('Please Enter Your Password')),
    }),
    onSubmit: async (values) => {
      if (captcha === null) {
        setCaptchaError(true);
        return;
      }
      let finalSubmission = { ...values };
      finalSubmission['captcha'] = captcha;
      setLoginWait(true);
      dispatch(loginUser(finalSubmission, props.history));
    },
  });

  const switchInputType = (e) => {
    const ele = document.getElementsByName('password')[0];
    const type = ele.getAttribute('type') === 'password' ? 'text' : 'password';
    ele.setAttribute('type', type);
  };

  const { error } = useSelector((state) => ({
    error: state.Login.error,
  }));

  const [logoLight, setLogoLight] = useState(MobileAppLogo);

  const durationnotify = (status, message) =>
    toast(message, {
      position: 'top-center',
      hideProgressBar: true,
      className: status === 'success' ? 'bg-success text-white' : 'bg-warning text-white',
      toastId: status === 'success' ? 'success' : 'failed_to_load',
    });

  React.useEffect(() => {
    if (error) {
      setLoginWait(false);
      durationnotify('error', error);
      dispatch(resetLogin('error', ''));
      recaptchaRef.current.reset();
    }
  }, [error]);

  React.useEffect(() => {
    const applyTheme = () => {
      if (localStorage.getItem('_w')) {
        try {
          let basic = JSON.parse(decrypt(localStorage.getItem('_w')));
          if (localStorage.getItem('client_type') === 'mobile_app') {
            setLogoLight(MobileAppLogo);
          } else {
            setLogoLight(basic.mainLogoLight);
          }
          setPrivacy(basic.privacy);
          setTerms(basic.terms);
          setEnabledSignup(basic.signup !== undefined ? basic.signup : true);
        } catch (error) {}
      }

      if (localStorage.getItem('_p')) {
        try {
          let pages = JSON.parse(decrypt(localStorage.getItem('_p')));
          setTheme(pages.auth);
          if (pages.authVariables) {
            setAuthVariables(pages.authVariables ?? {});
          }
        } catch (error) {}
      }
    };
    if (localStorage.getItem('_p') || localStorage.getItem('_w')) {
      applyTheme();
    }
  }, [localStorage.getItem('_p'), localStorage.getItem('_w')]);

  return !loading ? (
    <React.Fragment>
      {theme === 'galaxy' && (
        <ThemeOne title={props.t('SignIn')} authVariables={authVariables}>
          <>
            {isExpired && (
              <div className='text-center mt-2'>
                <p className='text-danger'>{props.t('Your Session Expired')} !</p>
              </div>
            )}
            <Card className={localStorage.getItem('client_type') === 'mobile_app' ? 'mt-4 border-0' : 'mt-4'}>
              <CardBody className='p-4'>
                <Row>
                  <Col lg={12}>
                    <div className='text-center mb-1 text-white-50'>
                      <div>
                        <Link to='/' className='d-inline-block auth-logo'>
                          <img src={logoLight} alt='' height='70' />
                        </Link>
                      </div>
                    </div>
                  </Col>
                </Row>
                {prevSession ? (
                  <>
                    <div className='p-2 mt-4'>
                      <Card>
                        <CardBody>
                          <div className='text-center mt-2'>
                            <span className='text-dark fs-14'>{props.t('You are already logged in on other device.')} !</span>
                          </div>
                          {/* <div className='d-flex align-items-center mb-2'>
                            <div className='w-50 text-muted'>Country</div>
                            <div className='w-50 text-dark fw-bold'>{`${prevSession?.country ?? '--NA--'} (${
                              prevSession?.countryCode ?? '--NA--'
                            })`}</div>
                          </div>
                          <div className='d-flex align-items-center mb-2'>
                            <div className='w-50 text-muted'>Region</div>
                            <div className='w-50 text-dark fw-bold'>{`${prevSession?.regionName ?? '--NA--'} (${
                              prevSession?.region ?? '--NA--'
                            })`}</div>
                          </div>
                          <div className='d-flex align-items-center mb-2'>
                            <div className='w-50 text-muted'>City</div>
                            <div className='w-50 text-dark fw-bold'>{prevSession?.city ?? '--NA--'}</div>
                          </div>
                          <div className='d-flex align-items-center mb-2'>
                            <div className='w-50 text-muted'>Zip</div>
                            <div className='w-50 text-dark fw-bold'>{prevSession?.zip ?? '--NA--'}</div>
                          </div>
                          <div className='d-flex align-items-center mb-2'>
                            <div className='w-50 text-muted'>IP</div>
                            <div className='w-50 text-dark fw-bold'>{prevSession?.ip ?? '--NA--'}</div>
                          </div>
                          <div className='d-flex align-items-center mb-2'>
                            <div className='w-50 text-muted'>Timezone</div>
                            <div className='w-50 text-dark fw-bold'>{prevSession?.timezone ?? '--NA--'}</div>
                          </div> */}
                          <div className='mt-4 text-center d-flex flex-wrap align-items-center gap-2'>
                            <Button
                              className='btn btn-outlined-dark d-flex flex-grow-1 justify-content-center align-items-center gap-2'
                              onClick={() => keepLoggedIn()}
                            >
                              <span>{props.t('Stay logged in')}</span>
                            </Button>
                            <Button
                              style={{ backgroundColor: 'red' }}
                              className='btn btn-primary d-flex flex-grow-1 justify-content-center align-items-center gap-2'
                              onClick={() => proceedLogout()}
                            >
                              <IoLogOutOutline style={{ fontSize: '16px' }} />
                              <span>{loginWait ? props.t('Logging out...') : props.t('Logout other sessions')}</span>
                            </Button>
                          </div>
                        </CardBody>
                      </Card>
                    </div>
                  </>
                ) : (
                  <>
                    <div className='text-center mt-2'>
                      <h5 className='text-primary'>{props.t('Welcome Back')} !</h5>
                    </div>
                    <div className='p-2 mt-4'>
                      <Form
                        onSubmit={(e) => {
                          e.preventDefault();
                          validation.handleSubmit();
                          return false;
                        }}
                        action='#'
                      >
                        <div className='mb-3'>
                          <Label htmlFor='email' className='form-label'>
                            {props.t('Email')}
                          </Label>
                          <Input
                            name='email'
                            className='form-control'
                            placeholder={props.t('Enter email')}
                            type='email'
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.email || ''}
                            invalid={validation.touched.email && validation.errors.email ? true : false}
                          />
                          {validation.touched.email && validation.errors.email ? (
                            <FormFeedback type='invalid'>{validation.errors.email}</FormFeedback>
                          ) : null}
                        </div>

                        <div className='mb-3'>
                          <div className='float-end'>
                            <Link to='/forgot-password' className='text-muted'>
                              {props.t('Forgot password?')}
                            </Link>
                          </div>
                          <Label className='form-label' htmlFor='password-input'>
                            {props.t('Password')}
                          </Label>
                          <div className='position-relative auth-pass-inputgroup mb-3'>
                            <Input
                              name='password'
                              value={validation.values.password || ''}
                              type='password'
                              className='form-control pe-5'
                              placeholder={props.t('Enter Password')}
                              onChange={validation.handleChange}
                              onBlur={validation.handleBlur}
                              invalid={validation.touched.password && validation.errors.password ? true : false}
                            />
                            {validation.touched.password && validation.errors.password ? (
                              <FormFeedback type='invalid'>{validation.errors.password}</FormFeedback>
                            ) : null}
                            <button
                              className='btn btn-link position-absolute end-0 top-0 text-decoration-none text-muted'
                              type='button'
                              id='password-addon'
                            >
                              <i className='ri-eye-fill align-middle' onClick={(e) => switchInputType(e)}></i>
                            </button>
                          </div>
                        </div>

                        <div className='mb-3'>
                          {ReCAPTCHA_SITE_KEY() !== '' && (
                            <ReCAPTCHA
                              ref={recaptchaRef}
                              sitekey={ReCAPTCHA_SITE_KEY()}
                              onChange={(e) => {
                                setCaptchaError(null);
                                setCaptcha(e);
                              }}
                            />
                          )}
                          {ReCAPTCHA_SITE_KEY() !== '' &&
                            (captchaError ? <label className='text-danger fw-100 fs-12'>{props.t('Invalid Captcha')}</label> : null)}
                        </div>

                        <div className='mt-4'>
                          <Button color='primary' disabled={loginWait} className='btn btn-primary w-100' type='submit'>
                            {loginWait ? props.t('Signing In...') : props.t('Sign In')}
                          </Button>
                        </div>
                      </Form>

                      {enabledSignup && localStorage.getItem('client_type') != 'mobile_app' && (
                        <div className='mt-4 text-center'>
                          <p className='mb-0'>
                            {props.t("Don't have an account ?")}{' '}
                            <Link to='/register' className='fw-semibold text-primary text-decoration-underline'>
                              {' '}
                              {props.t('Signup')}{' '}
                            </Link>{' '}
                          </p>
                        </div>
                      )}

                      <div className='mt-3 text-center fs-12'>
                        <p className='mb-0'>
                          {props.t('By signing in to this app you are agree to ')}{' '}
                          <a href={terms} target='_blank' className='fw-semibold text-primary text-decoration-underline'>
                            {' '}
                            {props.t('Terms of Service')}{' '}
                          </a>{' '}
                          {props.t('and acknowledge the')}{' '}
                          <a href={privacy} target='_blank' className='fw-semibold text-primary text-decoration-underline'>
                            {' '}
                            {props.t('Privacy Policy')}{' '}
                          </a>{' '}
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </CardBody>
            </Card>
          </>
        </ThemeOne>
      )}

      {theme === 'vintage' && (
        <ThemeTwo title={props.t('SignIn')} authVariables={authVariables}>
          <>
            {isExpired && (
              <div className='text-center mt-2'>
                <p className='text-danger'>{props.t('Your Session Expired')} !</p>
              </div>
            )}
            <Card className='shadow-0 border-0 bg-transparent'>
              <CardBody className='p-0'>
                <Row>
                  <Col lg={12}>
                    <div className='text-center mb-1 text-white-50'>
                      <div>
                        <Link to='/' className='d-inline-block auth-logo'>
                          <img src={logoLight} alt='' height='70' />
                        </Link>
                      </div>
                    </div>
                  </Col>
                </Row>

                {prevSession ? (
                  <>
                    <div className='text-center mt-2'>
                      <h5 className='text-primary'>{props.t('Active session found')} !</h5>
                    </div>
                    <div className='p-2 mt-4'>
                      <Card>
                        <CardBody>
                          <div className='text-center mt-2'>
                            <span className='text-dark fs-14'>{props.t('You are already logged in on other device.')} !</span>
                          </div>
                          {/* <div className='d-flex align-items-center mb-2'>
                            <div className='w-50 text-muted'>Country</div>
                            <div className='w-50 text-dark fw-bold'>{`${prevSession?.country ?? '--NA--'} (${
                              prevSession?.countryCode ?? '--NA--'
                            })`}</div>
                          </div>
                          <div className='d-flex align-items-center mb-2'>
                            <div className='w-50 text-muted'>Region</div>
                            <div className='w-50 text-dark fw-bold'>{`${prevSession?.regionName ?? '--NA--'} (${
                              prevSession?.region ?? '--NA--'
                            })`}</div>
                          </div>
                          <div className='d-flex align-items-center mb-2'>
                            <div className='w-50 text-muted'>City</div>
                            <div className='w-50 text-dark fw-bold'>{prevSession?.city ?? '--NA--'}</div>
                          </div>
                          <div className='d-flex align-items-center mb-2'>
                            <div className='w-50 text-muted'>Zip</div>
                            <div className='w-50 text-dark fw-bold'>{prevSession?.zip ?? '--NA--'}</div>
                          </div>
                          <div className='d-flex align-items-center mb-2'>
                            <div className='w-50 text-muted'>IP</div>
                            <div className='w-50 text-dark fw-bold'>{prevSession?.ip ?? '--NA--'}</div>
                          </div>
                          <div className='d-flex align-items-center mb-2'>
                            <div className='w-50 text-muted'>Timezone</div>
                            <div className='w-50 text-dark fw-bold'>{prevSession?.timezone ?? '--NA--'}</div>
                          </div> */}
                          <div className='mt-4 text-center d-flex flex-wrap align-items-center gap-2'>
                            <Button
                              className='btn btn-outlined-dark d-flex flex-grow-1 justify-content-center align-items-center gap-2'
                              onClick={() => keepLoggedIn()}
                            >
                              <span>{props.t('Stay logged in')}</span>
                            </Button>
                            <Button
                              style={{ backgroundColor: 'red' }}
                              className='btn btn-primary d-flex flex-grow-1 justify-content-center align-items-center gap-2'
                              onClick={() => proceedLogout()}
                            >
                              <IoLogOutOutline style={{ fontSize: '16px' }} />
                              <span>{loginWait ? props.t('Logging out...') : props.t('Logout other sessions')}</span>
                            </Button>
                          </div>
                        </CardBody>
                      </Card>
                    </div>
                  </>
                ) : (
                  <>
                    <div className='text-center mt-2'>
                      <h5 className='text-primary'>{props.t('Welcome Back')} !</h5>
                    </div>
                    <div className='p-2 mt-4'>
                      <Form
                        onSubmit={(e) => {
                          e.preventDefault();
                          validation.handleSubmit();
                          return false;
                        }}
                        action='#'
                      >
                        <div className='mb-3'>
                          <Label htmlFor='email' className='form-label'>
                            {props.t('Email')}
                          </Label>
                          <Input
                            name='email'
                            className='form-control'
                            placeholder={props.t('Enter email')}
                            type='email'
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.email || ''}
                            invalid={validation.touched.email && validation.errors.email ? true : false}
                          />
                          {validation.touched.email && validation.errors.email ? (
                            <FormFeedback type='invalid'>{validation.errors.email}</FormFeedback>
                          ) : null}
                        </div>

                        <div className='mb-3'>
                          <div className='float-end'>
                            <Link to='/forgot-password' className='text-muted'>
                              {props.t('Forgot password?')}
                            </Link>
                          </div>
                          <Label className='form-label' htmlFor='password-input'>
                            {props.t('Password')}
                          </Label>
                          <div className='position-relative auth-pass-inputgroup mb-3'>
                            <Input
                              name='password'
                              value={validation.values.password || ''}
                              type='password'
                              className='form-control pe-5'
                              placeholder={props.t('Enter Password')}
                              onChange={validation.handleChange}
                              onBlur={validation.handleBlur}
                              invalid={validation.touched.password && validation.errors.password ? true : false}
                            />
                            {validation.touched.password && validation.errors.password ? (
                              <FormFeedback type='invalid'>{validation.errors.password}</FormFeedback>
                            ) : null}
                            <button
                              className='btn btn-link position-absolute end-0 top-0 text-decoration-none text-muted'
                              type='button'
                              id='password-addon'
                            >
                              <i className='ri-eye-fill align-middle' onClick={(e) => switchInputType(e)}></i>
                            </button>
                          </div>
                        </div>

                        <div className='mb-3'>
                          {ReCAPTCHA_SITE_KEY() !== '' && (
                            <ReCAPTCHA
                              ref={recaptchaRef}
                              sitekey={ReCAPTCHA_SITE_KEY()}
                              onChange={(e) => {
                                setCaptchaError(null);
                                setCaptcha(e);
                              }}
                            />
                          )}
                          {ReCAPTCHA_SITE_KEY() !== '' &&
                            (captchaError ? <label className='text-danger fw-100 fs-12'>{props.t('Invalid Captcha')}</label> : null)}
                        </div>

                        <div className='mt-4'>
                          <Button color='primary' disabled={loginWait} className='btn btn-primary w-100' type='submit'>
                            {loginWait ? props.t('Signing In...') : props.t('Sign In')}
                          </Button>
                        </div>
                      </Form>

                      {enabledSignup && localStorage.getItem('client_type') != 'mobile_app' && (
                        <div className='mt-4 text-center'>
                          <p className='mb-0'>
                            {props.t("Don't have an account ?")}{' '}
                            <Link to='/register' className='fw-semibold text-primary text-decoration-underline'>
                              {' '}
                              {props.t('Signup')}{' '}
                            </Link>{' '}
                          </p>
                        </div>
                      )}

                      <div className='mt-3 text-center fs-12'>
                        <p className='mb-0'>
                          {props.t('By signing in to this app you are agree to ')}{' '}
                          <a href={terms} target='_blank' className='fw-semibold text-primary text-decoration-underline'>
                            {' '}
                            {props.t('Terms of Service')}{' '}
                          </a>{' '}
                          {props.t('and acknowledge the')}{' '}
                          <a href={privacy} target='_blank' className='fw-semibold text-primary text-decoration-underline'>
                            {' '}
                            {props.t('Privacy Policy')}{' '}
                          </a>{' '}
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </CardBody>
            </Card>
          </>
        </ThemeTwo>
      )}

      {theme === 'default' && (
        <DefaultScreen title={props.t('SignIn')} authVariables={authVariables}>
          <>
            {isExpired && (
              <div className='text-center mt-2'>
                <p className='text-danger'>{props.t('Your Session Expired')} !</p>
              </div>
            )}
            <Card className={localStorage.getItem('client_type') === 'mobile_app' ? 'mt-4 border-0' : 'mt-4'}>
              <CardBody className='p-4'>
                <Row>
                  <Col lg={12}>
                    <div className='text-center mb-1 text-white-50'>
                      <div>
                        <Link to='/' className='d-inline-block auth-logo'>
                          <img src={logoLight} alt='' height='70' />
                        </Link>
                      </div>
                    </div>
                  </Col>
                </Row>
                {prevSession ? (
                  <>
                    <div className='text-center mt-2'>
                      <h5 className='text-primary'>{props.t('Active session found')} !</h5>
                    </div>
                    <div className='p-2 mt-4'>
                      <Card>
                        <CardBody>
                          <div className='text-center mt-2'>
                            <span className='text-dark fs-14'>{props.t('You are already logged in on other device.')} !</span>
                          </div>
                          {/* <div className='d-flex align-items-center mb-2'>
                            <div className='w-50 text-muted'>Country</div>
                            <div className='w-50 text-dark fw-bold'>{`${prevSession?.country ?? '--NA--'} (${
                              prevSession?.countryCode ?? '--NA--'
                            })`}</div>
                          </div>
                          <div className='d-flex align-items-center mb-2'>
                            <div className='w-50 text-muted'>Region</div>
                            <div className='w-50 text-dark fw-bold'>{`${prevSession?.regionName ?? '--NA--'} (${
                              prevSession?.region ?? '--NA--'
                            })`}</div>
                          </div>
                          <div className='d-flex align-items-center mb-2'>
                            <div className='w-50 text-muted'>City</div>
                            <div className='w-50 text-dark fw-bold'>{prevSession?.city ?? '--NA--'}</div>
                          </div>
                          <div className='d-flex align-items-center mb-2'>
                            <div className='w-50 text-muted'>Zip</div>
                            <div className='w-50 text-dark fw-bold'>{prevSession?.zip ?? '--NA--'}</div>
                          </div>
                          <div className='d-flex align-items-center mb-2'>
                            <div className='w-50 text-muted'>IP</div>
                            <div className='w-50 text-dark fw-bold'>{prevSession?.ip ?? '--NA--'}</div>
                          </div>
                          <div className='d-flex align-items-center mb-2'>
                            <div className='w-50 text-muted'>Timezone</div>
                            <div className='w-50 text-dark fw-bold'>{prevSession?.timezone ?? '--NA--'}</div>
                          </div> */}
                          <div className='mt-4 text-center d-flex flex-wrap align-items-center gap-2'>
                            <Button
                              className='btn btn-outlined-dark d-flex flex-grow-1 justify-content-center align-items-center gap-2'
                              onClick={() => keepLoggedIn()}
                            >
                              <span>{props.t('Stay logged in')}</span>
                            </Button>
                            <Button
                              style={{ backgroundColor: 'red' }}
                              className='btn btn-primary d-flex flex-grow-1 justify-content-center align-items-center gap-2'
                              onClick={() => proceedLogout()}
                            >
                              <IoLogOutOutline style={{ fontSize: '16px' }} />
                              <span>{loginWait ? props.t('Logging out...') : props.t('Logout other sessions')}</span>
                            </Button>
                          </div>
                        </CardBody>
                      </Card>
                    </div>
                  </>
                ) : (
                  <>
                    <div className='text-center mt-2'>
                      <h5 className='text-primary'>{props.t('Welcome Back')} !</h5>
                    </div>
                    <div className='p-2 mt-4'>
                      <Form
                        onSubmit={(e) => {
                          e.preventDefault();
                          validation.handleSubmit();
                          return false;
                        }}
                        action='#'
                      >
                        <div className='mb-3'>
                          <Label htmlFor='email' className='form-label'>
                            {props.t('Email')}
                          </Label>
                          <Input
                            name='email'
                            className='form-control'
                            placeholder={props.t('Enter email')}
                            type='email'
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.email || ''}
                            invalid={validation.touched.email && validation.errors.email ? true : false}
                          />
                          {validation.touched.email && validation.errors.email ? (
                            <FormFeedback type='invalid'>{validation.errors.email}</FormFeedback>
                          ) : null}
                        </div>

                        <div className='mb-3'>
                          <div className='float-end'>
                            <Link to='/forgot-password' className='text-muted'>
                              {props.t('Forgot password?')}
                            </Link>
                          </div>
                          <Label className='form-label' htmlFor='password-input'>
                            {props.t('Password')}
                          </Label>
                          <div className='position-relative auth-pass-inputgroup mb-3'>
                            <Input
                              name='password'
                              value={validation.values.password || ''}
                              type='password'
                              className='form-control pe-5'
                              placeholder={props.t('Enter Password')}
                              onChange={validation.handleChange}
                              onBlur={validation.handleBlur}
                              invalid={validation.touched.password && validation.errors.password ? true : false}
                            />
                            {validation.touched.password && validation.errors.password ? (
                              <FormFeedback type='invalid'>{validation.errors.password}</FormFeedback>
                            ) : null}
                            <button
                              className='btn btn-link position-absolute end-0 top-0 text-decoration-none text-muted'
                              type='button'
                              id='password-addon'
                            >
                              <i className='ri-eye-fill align-middle' onClick={(e) => switchInputType(e)}></i>
                            </button>
                          </div>
                        </div>

                        <div className='mb-3'>
                          {ReCAPTCHA_SITE_KEY() !== '' && (
                            <ReCAPTCHA
                              ref={recaptchaRef}
                              sitekey={ReCAPTCHA_SITE_KEY()}
                              onChange={(e) => {
                                setCaptchaError(null);
                                setCaptcha(e);
                              }}
                            />
                          )}
                          {ReCAPTCHA_SITE_KEY() !== '' &&
                            (captchaError ? <label className='text-danger fw-100 fs-12'>{props.t('Invalid Captcha')}</label> : null)}
                        </div>

                        <div className='mt-4'>
                          <Button color='primary' disabled={loginWait} className='btn btn-primary w-100' type='submit'>
                            {loginWait ? props.t('Signing In...') : props.t('Sign In')}
                          </Button>
                        </div>
                      </Form>

                      {enabledSignup && localStorage.getItem('client_type') != 'mobile_app' && (
                        <div className='mt-4 text-center'>
                          <p className='mb-0'>
                            {props.t("Don't have an account ?")}{' '}
                            <Link to='/register' className='fw-semibold text-primary text-decoration-underline'>
                              {' '}
                              {props.t('Signup')}{' '}
                            </Link>{' '}
                          </p>
                        </div>
                      )}

                      <div className='mt-3 text-center fs-12'>
                        <p className='mb-0'>
                          {props.t('By signing in to this app you are agree to ')}{' '}
                          <a href={terms} target='_blank' className='fw-semibold text-primary text-decoration-underline'>
                            {' '}
                            {props.t('Terms of Service')}{' '}
                          </a>{' '}
                          {props.t('and acknowledge the')}{' '}
                          <a href={privacy} target='_blank' className='fw-semibold text-primary text-decoration-underline'>
                            {' '}
                            {props.t('Privacy Policy')}{' '}
                          </a>{' '}
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </CardBody>
            </Card>
          </>
        </DefaultScreen>
      )}
      <ToastContainer />
    </React.Fragment>
  ) : (
    <Preloader />
  );
};

Login.propTypes = {
  location: PropTypes.object,
  t: PropTypes.any,
};
export default withRouter(withTranslation()(Login));

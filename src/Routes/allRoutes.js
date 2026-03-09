import { lazy } from 'react';
import { Redirect } from 'react-router-dom';

//Dashboard
const ProductsPage = lazy(() => import('../pages/DashboardAnalytics'));
const WorkspacePage = lazy(() => import('../pages/Workspace'));

//login
const Login = lazy(() => import('../pages/Authentication/Login'));
const Logout = lazy(() => import('../pages/Authentication/Logout'));

const NoAuth = lazy(() => import('./../pages/Error/NoAuth'));

const storage= lazy(()=>import('../pages/Storage/StorageExplorer'));

const CreditHistory = lazy(() => import('../pages/CreditHistory/CreditHistory'));

// API Documentation
const ApiDocs = lazy(() => import('../pages/ApiDocs/index'));

// Lead Source
const LeadSource = lazy(() => import('../pages/LeadSource/index'));
const LeadSourceSetup = lazy(() => import('../pages/LeadSource/ConnectionSetup'));
const WebhookPage = lazy(() => import('../pages/LeadSource/WebhookPage'));
const DocumentationPage = lazy(() => import('../pages/LeadSource/DocumentationPage'));

import UserPermissions from './UserPermissions';

const digRoute = [
  { path: '/products', component: ProductsPage, permissions: UserPermissions.DIG.IMAGE_EXPERIENCE },
  { path: '/workspace', component: WorkspacePage, permissions: UserPermissions.DIG.IMAGE_EXPERIENCE },
  {
    path: '/storage',
    component: storage,
    permissions: UserPermissions.DIG.IMAGE_EXPERIENCE,
  },
  {
    path: '/credit-history',
    component: CreditHistory,
    permissions: UserPermissions.DIG.IMAGE_EXPERIENCE,
  },
  // API Documentation
  {
    path: '/api-docs',
    component: ApiDocs,
    permissions: UserPermissions.DIG.IMAGE_EXPERIENCE,
  },
  // Lead Source
  {
    path: '/settings',
    component: LeadSource,
    permissions: UserPermissions.DIG.IMAGE_EXPERIENCE,
  },
  {
    path: '/settings/:id/webhook',
    component: WebhookPage,
    permissions: UserPermissions.DIG.IMAGE_EXPERIENCE,
  },
  {
    path: '/settings/docs/:sourceKey',
    component: DocumentationPage,
    permissions: UserPermissions.DIG.IMAGE_EXPERIENCE,
  },
  {
    path: '/settings/:sourceKey',
    component: LeadSourceSetup,
    permissions: UserPermissions.DIG.IMAGE_EXPERIENCE,
  }
];

const productPageRoute = [
  { path: '/no-auth', component: NoAuth },

  {
    path: '/',
    exact: true,
    component: () => <Redirect to='/settings' />,
  },
];

const defaultPageRoute = [
  {
    path: '/',
    exact: true,
    component: () => <Redirect to='/settings' />,
  },
];

const publicRoutes = [
  // Authentication Page
  { path: '/logout', component: Logout },
  { path: '/connect', component: Login },
  { path: '/login', component: Login },
];

// { path: '/pdf', component: PdfBuilder },
export { productPageRoute, defaultPageRoute, publicRoutes, digRoute };

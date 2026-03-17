import { lazy } from 'react';
import { Redirect } from 'react-router-dom';

//Dashboard
const ProductsPage = lazy(() => import('../pages/DashboardAnalytics'));
const WorkspacePage = lazy(() => import('../pages/Workspace'));

//login
const Login = lazy(() => import('../pages/Authentication/Login'));
const Logout = lazy(() => import('../pages/Authentication/Logout'));

const NoAuth = lazy(() => import('./../pages/Error/NoAuth'));

// Lead Source
const LeadSource = lazy(() => import('../pages/LeadSource/index'));
const LeadSourceSetup = lazy(() => import('../pages/LeadSource/ConnectionSetup'));
const WebhookPage = lazy(() => import('../pages/LeadSource/WebhookPage'));
const LogsPage = lazy(() => import('../pages/LeadSource/LogsPage'));
const AnalyticsPage = lazy(() => import('../pages/LeadSource/AnalyticsPage'));
const DocumentationPage = lazy(() => import('../pages/LeadSource/DocumentationPage'));

import UserPermissions from './UserPermissions';

const digRoute = [
  { path: '/products', component: ProductsPage, permissions: UserPermissions.LEAD_SOURCE.LEAD_SOURCE },
  { path: '/workspace', component: WorkspacePage, permissions: UserPermissions.LEAD_SOURCE.LEAD_SOURCE },
  // Lead Source
  {
    path: '/settings',
    component: LeadSource,
    permissions: UserPermissions.LEAD_SOURCE.LEAD_SOURCE,
  },
  {
    path: '/settings/:id/webhook',
    component: WebhookPage,
    permissions: UserPermissions.LEAD_SOURCE.LEAD_SOURCE,
  },
  {
    path: '/settings/:id/logs',
    component: LogsPage,
    permissions: UserPermissions.LEAD_SOURCE.LEAD_SOURCE,
  },
  {
    path: '/settings/analytics',
    component: AnalyticsPage,
    permissions: UserPermissions.LEAD_SOURCE.LEAD_SOURCE,
  },
  {
    path: '/settings/docs/:sourceKey',
    component: DocumentationPage,
    permissions: UserPermissions.LEAD_SOURCE.LEAD_SOURCE,
  },
  {
    path: '/settings/:sourceKey',
    component: LeadSourceSetup,
    permissions: UserPermissions.LEAD_SOURCE.LEAD_SOURCE,
  },
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

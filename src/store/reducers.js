import { combineReducers } from 'redux';

// Front
import Layout from './layouts/reducer';

// Authentication
import Login from './auth/login/reducer';
import Account from './auth/register/reducer';
import ForgetPassword from './auth/forgetpwd/reducer';

//User Role
import UserRoles from './userRole/reducer';
import UserSession from './userSession/reducer';
import PanelMenu from './panelMenu/reducer';
//DIG
import ImageExperience from './dig/image/reducer';

import PdfExp from './dig/pdf/reducer'

const rootReducer = combineReducers({
  // public
  Layout,
  Login,
  Account,
  ForgetPassword,
  UserRoles,
  UserSession,
  ImageExperience,
  PanelMenu,
  PdfExp,
});

export default rootReducer;

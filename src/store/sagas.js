import { all, fork } from 'redux-saga/effects';
//layout
import LayoutSaga from './layouts/saga';
//Auth
import AccountSaga from './auth/register/saga';
import AuthSaga from './auth/login/saga';
import ForgetSaga from './auth/forgetpwd/saga';

//User Role
import UserRolesSaga from './userRole/saga';
import PanelMenuSaga from './panelMenu/saga';
//User Session
import UserSessionSaga from './userSession/saga';
//Image Exp
import imageExpSaga from './dig/image/saga';
//pdf exp
import PdfExpSaga from './dig/pdf/saga';

export default function* rootSaga() {
  yield all([
    //public
    fork(UserSessionSaga),
    fork(LayoutSaga),
    fork(AccountSaga),
    fork(AuthSaga),
    fork(ForgetSaga),
    fork(UserRolesSaga),
    fork(imageExpSaga),
    fork(PanelMenuSaga),
    fork(PdfExpSaga)
  ]);
}

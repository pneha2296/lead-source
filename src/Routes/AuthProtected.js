import React, { useState } from 'react';
import { Redirect, Route, useHistory } from 'react-router-dom';

import { useSession } from '../Components/Hooks/UserHooks';
import { useSelector } from 'react-redux';
import { staticDecrypt } from '../security';
import Preloader from '../Components/Loaders/Preloader';

const getProductVisibility = () => {
  let pv = localStorage.getItem('_pv');
  if (pv !== null) {
    pv = staticDecrypt(pv);
    pv = JSON.parse(pv);
    return pv;
  } else {
    return [];
  }
};

const AuthProtected = (props) => {
  const { userSession } = useSession();
  const { userRNP } = useSelector((state) => ({
    userRNP: state.UserSession.userRNP,
  }));

  if (!userSession) {
    return <Redirect to={{ pathname: '/login' }} />;
  }

  if (userRNP === null) {
    return <Redirect to={{ pathname: '/login', state: { from: props.location } }} />;
  }
  return <>{props.children}</>;
};

const WABARoute = (props) => {
  const { userSession } = useSession();
  const { userRNP } = useSelector((state) => ({
    userRNP: state.UserSession.userRNP,
  }));

  if (!userSession) {
    return <Redirect to={{ pathname: '/login' }} />;
  }

  if (userRNP === null) {
    return <Redirect to={{ pathname: '/login', state: { from: props.location } }} />;
  }

  let pv = getProductVisibility();

  let waba = pv.filter((item) => {
    if (!item.isCustom && item.isActive && item.hyperlink === '/products/waba') {
      return item;
    }
  });

  if (waba.length === 0) {
    return <Redirect to={{ pathname: '/products' }} />;
  }

  if (waba.length > 0 && waba[0].isActive === false) {
    return <Redirect to={{ pathname: '/products' }} />;
  }

  if (userRNP.permissions?.length === 0) {
    return <Redirect to={{ pathname: '/products' }} />;
  }

  return <>{props.children}</>;
};

const FomoRoute = (props) => {
  const { userSession } = useSession();
  const { userRNP } = useSelector((state) => ({
    userRNP: state.UserSession.userRNP,
  }));

  if (!userSession) {
    return <Redirect to={{ pathname: '/login' }} />;
  }

  if (userRNP === null) {
    return <Redirect to={{ pathname: '/login', state: { from: props.location } }} />;
  }

  let pv = getProductVisibility();

  let waba = pv.filter((item) => {
    if (!item.isCustom && item.isActive && item.hyperlink === '/products/fomo') {
      return item;
    }
  });

  if (waba.length === 0) {
    return <Redirect to={{ pathname: '/products' }} />;
  }

  if (waba.length > 0 && waba[0].isActive === false) {
    return <Redirect to={{ pathname: '/products' }} />;
  }

  if (userRNP.permissions?.length === 0) {
    return <Redirect to={{ pathname: '/products' }} />;
  }

  return <>{props.children}</>;
};

const DIGRoute = (props) => {
  const { userSession } = useSession();
  const { userRNP } = useSelector((state) => ({
    userRNP: state.UserSession.userRNP,
  }));

  if (!userSession) {
    return <Redirect to={{ pathname: '/login' }} />;
  }

  if (userRNP === null) {
    return <Redirect to={{ pathname: '/login', state: { from: props.location } }} />;
  }

  let pv = getProductVisibility();

  let waba = pv.filter((item) => {
    if (!item.isCustom && item.isActive && item.hyperlink === '/products/leadsource') {
      return item;
    }
  });

  if (waba.length === 0) {
    return <Redirect to={{ pathname: '/products' }} />;
  }

  if (waba.length > 0 && waba[0].isActive === false) {
    return <Redirect to={{ pathname: '/products' }} />;
  }

  if (userRNP.permissions?.length === 0) {
    return <Redirect to={{ pathname: '/products' }} />;
  }

  return <>{props.children}</>;
};

const TasksRoute = (props) => {
  const { userSession } = useSession();
  const { userRNP } = useSelector((state) => ({
    userRNP: state.UserSession.userRNP,
  }));

  if (!userSession) {
    return <Redirect to={{ pathname: '/login' }} />;
  }

  if (userRNP === null) {
    return <Redirect to={{ pathname: '/login', state: { from: props.location } }} />;
  }

  let pv = getProductVisibility();

  let waba = pv.filter((item) => {
    if (!item.isCustom && item.isActive && item.hyperlink === '/products/tasks') {
      return item;
    }
  });

  if (waba.length === 0) {
    return <Redirect to={{ pathname: '/products' }} />;
  }

  if (waba.length > 0 && waba[0].isActive === false) {
    return <Redirect to={{ pathname: '/products' }} />;
  }

  if (userRNP.permissions?.length === 0) {
    return <Redirect to={{ pathname: '/products' }} />;
  }

  return <>{props.children}</>;
};

const RewardzRoute = (props) => {
  const { userSession } = useSession();
  const { userRNP } = useSelector((state) => ({
    userRNP: state.UserSession.userRNP,
  }));

  if (!userSession) {
    return <Redirect to={{ pathname: '/login' }} />;
  }

  if (userRNP === null) {
    return <Redirect to={{ pathname: '/login', state: { from: props.location } }} />;
  }

  let pv = getProductVisibility();

  let waba = pv.filter((item) => {
    if (!item.isCustom && item.isActive && item.hyperlink === '/products/rewardz') {
      return item;
    }
  });

  if (waba.length === 0) {
    return <Redirect to={{ pathname: '/products' }} />;
  }

  if (waba.length > 0 && waba[0].isActive === false) {
    return <Redirect to={{ pathname: '/products' }} />;
  }

  if (userRNP.permissions?.length === 0) {
    return <Redirect to={{ pathname: '/products' }} />;
  }

  return <>{props.children}</>;
};

const CalendarRoute = (props) => {
  const { userSession } = useSession();
  const { userRNP } = useSelector((state) => ({
    userRNP: state.UserSession.userRNP,
  }));

  if (!userSession) {
    return <Redirect to={{ pathname: '/login' }} />;
  }

  if (userRNP === null) {
    return <Redirect to={{ pathname: '/login', state: { from: props.location } }} />;
  }

  let pv = getProductVisibility();

  let waba = pv.filter((item) => {
    if (!item.isCustom && item.isActive && item.hyperlink === '/products/calendar') {
      return item;
    }
  });

  if (waba.length === 0) {
    return <Redirect to={{ pathname: '/products' }} />;
  }

  if (waba.length > 0 && waba[0].isActive === false) {
    return <Redirect to={{ pathname: '/products' }} />;
  }

  if (userRNP.permissions?.length === 0) {
    return <Redirect to={{ pathname: '/products' }} />;
  }

  return <>{props.children}</>;
};

const MediaManagerRoute = (props) => {
  const { userSession } = useSession();
  const { userRNP } = useSelector((state) => ({
    userRNP: state.UserSession.userRNP,
  }));

  if (!userSession) {
    return <Redirect to={{ pathname: '/login' }} />;
  }

  if (userRNP === null) {
    return <Redirect to={{ pathname: '/login', state: { from: props.location } }} />;
  }

  let pv = getProductVisibility();

  let waba = pv.filter((item) => {
    if (!item.isCustom && item.isActive && item.hyperlink === '/products/mediabot') {
      return item;
    }
  });

  if (waba.length === 0) {
    return <Redirect to={{ pathname: '/products' }} />;
  }

  if (waba.length > 0 && waba[0].isActive === false) {
    return <Redirect to={{ pathname: '/products' }} />;
  }

  if (userRNP.permissions?.length === 0) {
    return <Redirect to={{ pathname: '/products' }} />;
  }

  return <>{props.children}</>;
};

const MiniSiteRoute = (props) => {
  const { userSession } = useSession();
  const { userRNP } = useSelector((state) => ({
    userRNP: state.UserSession.userRNP,
  }));

  if (!userSession) {
    return <Redirect to={{ pathname: '/login' }} />;
  }

  if (userRNP === null) {
    return <Redirect to={{ pathname: '/login', state: { from: props.location } }} />;
  }

  let pv = getProductVisibility();

  let waba = pv.filter((item) => {
    if (!item.isCustom && item.isActive && item.hyperlink === '/products/mini_site') {
      return item;
    }
  });

  if (waba.length === 0) {
    return <Redirect to={{ pathname: '/products' }} />;
  }

  if (waba.length > 0 && waba[0].isActive === false) {
    return <Redirect to={{ pathname: '/products' }} />;
  }

  if (userRNP.permissions?.length === 0) {
    return <Redirect to={{ pathname: '/products' }} />;
  }

  return <>{props.children}</>;
};

const CRMAnalytics = (props) => {
  const { userSession } = useSession();
  const { userRNP } = useSelector((state) => ({
    userRNP: state.UserSession.userRNP,
  }));

  if (!userSession) {
    return <Redirect to={{ pathname: '/login' }} />;
  }

  if (userRNP === null) {
    return <Redirect to={{ pathname: '/login', state: { from: props.location } }} />;
  }

  let pv = getProductVisibility();

  // let waba = pv.filter((item) => {
  //   if (!item.isCustom && item.isActive && item.hyperlink === '/products/crm-analytics') {
  //     return item;
  //   }
  // });

  let waba = ['1'];

  if (waba.length === 0) {
    return <Redirect to={{ pathname: '/products' }} />;
  }

  if (waba.length > 0 && waba[0].isActive === false) {
    return <Redirect to={{ pathname: '/products' }} />;
  }

  if (userRNP.permissions?.length === 0) {
    return <Redirect to={{ pathname: '/products' }} />;
  }

  return <>{props.children}</>;
};

const PaymentRoute = (props) => {
  const { userSession } = useSession();
  const { userRNP } = useSelector((state) => ({
    userRNP: state.UserSession.userRNP,
  }));

  if (!userSession) {
    return <Redirect to={{ pathname: '/login' }} />;
  }

  if (userRNP === null) {
    return <Redirect to={{ pathname: '/login', state: { from: props.location } }} />;
  }

  let pv = getProductVisibility();

  let waba = pv.filter((item) => {
    if (!item.isCustom && item.isActive && item.hyperlink === '/products/payment') {
      return item;
    }
  });

  if (waba.length === 0) {
    return <Redirect to={{ pathname: '/products' }} />;
  }

  if (waba.length > 0 && waba[0].isActive === false) {
    return <Redirect to={{ pathname: '/products' }} />;
  }

  if (userRNP.permissions?.length === 0) {
    return <Redirect to={{ pathname: '/products' }} />;
  }

  return <>{props.children}</>;
};

const DepartmentRoute = (props) => {
  const { userSession } = useSession();
  const { userRNP } = useSelector((state) => ({
    userRNP: state.UserSession.userRNP,
  }));

  if (!userSession) {
    return <Redirect to={{ pathname: '/login' }} />;
  }

  if (userRNP === null) {
    return <Redirect to={{ pathname: '/login', state: { from: props.location } }} />;
  }

  let pv = getProductVisibility();

  let waba = pv.filter((item) => {
    if (!item.isCustom && item.isActive && item.hyperlink === '/products/department') {
      return item;
    }
  });

  if (waba.length === 0) {
    return <Redirect to={{ pathname: '/products' }} />;
  }

  if (waba.length > 0 && waba[0].isActive === false) {
    return <Redirect to={{ pathname: '/products' }} />;
  }

  if (userRNP.permissions?.length === 0) {
    return <Redirect to={{ pathname: '/products' }} />;
  }

  return <>{props.children}</>;
};

const EcomSiteRoute = (props) => {
  const { userSession } = useSession();
  const { userRNP } = useSelector((state) => ({
    userRNP: state.UserSession.userRNP,
  }));

  if (!userSession) {
    return <Redirect to={{ pathname: '/login' }} />;
  }

  if (userRNP === null) {
    return <Redirect to={{ pathname: '/login', state: { from: props.location } }} />;
  }

  let pv = getProductVisibility();

  let waba = pv.filter((item) => {
    if (
      !item.isCustom &&
      item.isActive &&
      (item?.hyperlink?.includes('/products/ecom') || item?.hyperlink?.includes('/products/ecommerce'))
    ) {
      return item;
    }
  });

  if (waba.length === 0) {
    return <Redirect to={{ pathname: '/products' }} />;
  }

  if (waba.length > 0 && waba[0].isActive === false) {
    return <Redirect to={{ pathname: '/products' }} />;
  }

  if (userRNP.permissions?.length === 0) {
    return <Redirect to={{ pathname: '/products' }} />;
  }

  return <>{props.children}</>;
};

const VirtualNumberRoute = (props) => {
  const { userSession } = useSession();
  const { userRNP } = useSelector((state) => ({
    userRNP: state.UserSession.userRNP,
  }));

  if (!userSession) {
    return <Redirect to={{ pathname: '/login' }} />;
  }

  if (userRNP === null) {
    return <Redirect to={{ pathname: '/login', state: { from: props.location } }} />;
  }

  let pv = getProductVisibility();

  let waba = pv.filter((item) => {
    if (!item.isCustom && item.isActive && item.hyperlink === '/products/virtual_number') {
      return item;
    }
  });

  if (waba.length === 0) {
    return <Redirect to={{ pathname: '/products' }} />;
  }

  if (waba.length > 0 && waba[0].isActive === false) {
    return <Redirect to={{ pathname: '/products' }} />;
  }

  if (userRNP.permissions?.length === 0) {
    return <Redirect to={{ pathname: '/products' }} />;
  }

  return <>{props.children}</>;
};

const CRMRoute = (props) => {
  const { userSession } = useSession();
  const { userRNP } = useSelector((state) => ({
    userRNP: state.UserSession.userRNP,
  }));

  if (!userSession) {
    return <Redirect to={{ pathname: '/login' }} />;
  }

  if (userRNP === null) {
    return <Redirect to={{ pathname: '/login', state: { from: props.location } }} />;
  }

  let pv = getProductVisibility();

  let product = pv.filter((item) => {
    if (!item.isCustom && item.isActive && (item.hyperlink === '/products/crm' || item.hyperlink === '/products/crm-v2')) {
      return item;
    }
  });

  if (product.length === 0) {
    return <Redirect to={{ pathname: '/products' }} />;
  }

  if (product.length > 0 && product[0].isActive === false) {
    return <Redirect to={{ pathname: '/products' }} />;
  }

  if (userRNP.permissions?.length === 0) {
    return <Redirect to={{ pathname: '/products' }} />;
  }

  return <>{props.children}</>;
};

const ChannelAPIRoute = (props) => {
  const { userSession } = useSession();
  const { userRNP } = useSelector((state) => ({
    userRNP: state.UserSession.userRNP,
  }));

  if (!userSession) {
    return <Redirect to={{ pathname: '/login' }} />;
  }

  if (userRNP === null) {
    return <Redirect to={{ pathname: '/login', state: { from: props.location } }} />;
  }

  let pv = getProductVisibility();

  let product = pv.filter((item) => {
    if (!item.isCustom && item.isActive && item.hyperlink === '/products/channel') {
      return item;
    }
  });

  if (product.length === 0) {
    return <Redirect to={{ pathname: '/products' }} />;
  }

  if (product.length > 0 && product[0].isActive === false) {
    return <Redirect to={{ pathname: '/products' }} />;
  }

  if (userRNP.permissions?.length === 0) {
    return <Redirect to={{ pathname: '/products' }} />;
  }

  return <>{props.children}</>;
};

const BotRoute = (props) => {
  const { userSession } = useSession();
  const { userRNP } = useSelector((state) => ({
    userRNP: state.UserSession.userRNP,
  }));

  if (!userSession) {
    return <Redirect to={{ pathname: '/login' }} />;
  }

  if (userRNP === null) {
    return <Redirect to={{ pathname: '/login', state: { from: props.location } }} />;
  }

  let pv = getProductVisibility();

  let product = pv.filter((item) => {
    if (!item.isCustom && item.isActive && item.hyperlink === '/products/bot') {
      return item;
    }
  });
  if (product.length === 0) {
    return <Redirect to={{ pathname: '/products' }} />;
  }

  if (product.length > 0 && product[0].isActive === false) {
    return <Redirect to={{ pathname: '/products' }} />;
  }

  if (userRNP.permissions?.length === 0) {
    return <Redirect to={{ pathname: '/products' }} />;
  }

  return <>{props.children}</>;
};

const AutomationRoute = (props) => {
  const { userSession } = useSession();
  const { userRNP } = useSelector((state) => ({
    userRNP: state.UserSession.userRNP,
  }));

  if (!userSession) {
    return <Redirect to={{ pathname: '/login' }} />;
  }

  if (userRNP === null) {
    return <Redirect to={{ pathname: '/login', state: { from: props.location } }} />;
  }

  let pv = getProductVisibility();

  let product = pv.filter((item) => {
    if (!item.isCustom && item.isActive && item.hyperlink === '/products/automation') {
      return item;
    }
  });

  if (product.length === 0) {
    return <Redirect to={{ pathname: '/products' }} />;
  }

  if (product.length > 0 && product[0].isActive === false) {
    return <Redirect to={{ pathname: '/products' }} />;
  }

  if (userRNP.permissions?.length === 0) {
    return <Redirect to={{ pathname: '/products' }} />;
  }

  return <>{props.children}</>;
};

const AccessRoute = ({ component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(props) => {
        return (
          <>
            {' '}
            <Component {...props} />{' '}
          </>
        );
      }}
    />
  );
};

const RestrictedAccessRoute = ({ component: Component, ...rest }) => {
  const history = useHistory();
  const [loading, setLoading] = useState(true);
  const { userRNP } = useSelector((state) => ({
    userRNP: state.UserSession.userRNP,
  }));

  React.useEffect(() => {
    let access = [];
    if (userRNP && userRNP.subscription !== null && userRNP?.subscription?.expiry > parseInt(new Date().getTime() / 1000)) {
      if (userRNP) {
        access = userRNP.permissions;
        if (rest.permissions !== undefined && rest.permissions.length > 0) {
          if (!access.some((perm) => rest.permissions.includes(perm))) {
            return history.push('/products');
          }
          setLoading(false);
        } else {
          if (userRNP.role === 'team_member') {
            if (
              rest.path !== '/products' &&
              !rest.path.includes('/products/e') &&
              !rest.path.includes('/products/redirect') &&
              !rest.path.includes('/workspace/ticket') &&
              !rest.path.includes('/workspace/settings')
            ) {
              return history.push('/products');
            }
          } else {
            if (
              rest.path !== '/products' &&
              !rest.path.includes('workspace') &&
              !rest.path.includes('/products/e') &&
              !rest.path.includes('/products/redirect')
            ) {
              if (rest.path !== '/products/rewardz' && rest.path !== '/products/payment') {
                return history.push('/products');
              }
            } else if (rest.path.includes('workspace/affiliate') && !userRNP.affiliate) {
              return history.push('/products');
            }
          }
          setLoading(false);
        }
      } else {
        setLoading(false);
        return history.push('/products');
      }
    } else {
      setLoading(false);
      if (userRNP.role === 'team_member') {
        return history.push('/logout');
      } else {
        return history.push('/workspace/billing/plans');
      }
    }
  }, [rest.path]);

  return (
    <Route
      {...rest}
      render={(props) => {
        return <>{loading ? <Preloader /> : <Component {...props} />}</>;
      }}
    />
  );
};

export {
  AuthProtected,
  WABARoute,
  MiniSiteRoute,
  VirtualNumberRoute,
  FomoRoute,
  CRMRoute,
  BotRoute,
  AutomationRoute,
  AccessRoute,
  EcomSiteRoute,
  RestrictedAccessRoute,
  ChannelAPIRoute,
  RewardzRoute,
  CalendarRoute,
  PaymentRoute,
  DIGRoute,
  TasksRoute,
  MediaManagerRoute,
  CRMAnalytics,
  DepartmentRoute,
};

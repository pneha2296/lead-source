import { FaFileInvoiceDollar } from 'react-icons/fa6';
import { LiaCogsSolid } from 'react-icons/lia';
import { SiAmazonapigateway } from 'react-icons/si';
import UserPermissions from '../../../Routes/UserPermissions';

export default [
  {
    id: 'all_channels',
    label: 'Payment Orders',
    link: '/products/payment/order',
    parentId: 'payment',
    icon: <FaFileInvoiceDollar className='fs-18' style={{ fill: 'currentColor' }} />,
    iconType: 'component',
    permissions: UserPermissions.NATIVE_PAYMENT.PURCHASE_ORDER,
  },
  {
    id: 'payment_gateways',
    label: 'Payment Gateways',
    link: '/products/payment/gateway',
    parentId: 'payment',
    icon: <FaFileInvoiceDollar className='fs-18' style={{ fill: 'currentColor' }} />,
    iconType: 'component',
    permissions: UserPermissions.NATIVE_PAYMENT.PAYMENT_GATEWAY,
  },
  {
    id: 'payment_automations',
    label: 'Automations',
    link: '/products/payment/automation',
    parentId: 'payment',
    icon: <LiaCogsSolid className='fs-18' style={{ fill: 'currentColor' }} />,
    iconType: 'component',
    permissions: UserPermissions.NATIVE_PAYMENT.WEBHOOK,
  },
];

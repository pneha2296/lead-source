import PropTypes from 'prop-types';
import { Modal, ModalHeader } from 'reactstrap';
import { BsGearWideConnected } from 'react-icons/bs';
import FacebookConfigForm from './ConfigForms/FacebookConfigForm';
import IndiamartConfigForm from './ConfigForms/IndiamartConfigForm';
import ZohoConfigForm from './ConfigForms/ZohoConfigForm';
import GenericWebhookConfigForm from './ConfigForms/GenericWebhookConfigForm';
import PhoneContactConfigForm from './ConfigForms/PhoneContactConfigForm';
import TypeformConfigForm from './ConfigForms/TypeformConfigForm';

const getProvider = (connection) =>
  connection?.provider || connection?.source || '';

// Map provider keys to their config form component
const PROVIDER_FORM_MAP = {
  indiamart: IndiamartConfigForm,
  zoho: ZohoConfigForm,
  zoho_crm: ZohoConfigForm,
  zohoCrm: ZohoConfigForm,
  generic_webhook: GenericWebhookConfigForm,
  genericWebhook: GenericWebhookConfigForm,
  webhook: GenericWebhookConfigForm,
  phone_connect: PhoneContactConfigForm,
  typeform: TypeformConfigForm,
};

const ConfigureModal = ({ isOpen, toggle, connection, onSave }) => {
  if (!connection) return null;
  
  const FormComponent = PROVIDER_FORM_MAP[getProvider(connection)] || FacebookConfigForm;

  return (
    <Modal isOpen={isOpen} toggle={toggle} centered size='md'>
      <ModalHeader toggle={toggle}>
        <div className='d-flex align-items-center gap-2'>
          <BsGearWideConnected />
          <span>Configure Connection</span>
        </div>
      </ModalHeader>
      <FormComponent connection={connection} onSave={onSave} toggle={toggle} />
    </Modal>
  );
};

ConfigureModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  connection: PropTypes.object,
  onSave: PropTypes.func.isRequired,
};

export default ConfigureModal;

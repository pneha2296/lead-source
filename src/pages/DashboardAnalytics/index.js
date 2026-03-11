import Preloader from './../../Components/Loaders/Preloader';

const Workspace = () => {
  if (window.location.hostname !== 'localhost') {
    window.location.href = `${window.location.origin}/products`;
    return <Preloader />;
    return <></>;
  } else {
    window.location.href = `${window.location.origin}/leadsource/settings`;
    return <></>;
  }
};

export default Workspace;

import React, { useState, useMemo, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import {
  Container, Row, Col, Card, CardBody, Spinner, Button, Input,
  Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Label, FormGroup,
  Alert, Table, Modal, ModalHeader, ModalBody
} from 'reactstrap';
import MetaTag from '../../Components/Common/Meta';

// --- IMPORTS FROM PDF BUILDER PATTERN ---
import Preloader from '../../Components/Loaders/Preloader';
import CustomNotification from '../../Components/Common/CustomNotification';

// Import API functions
import { getStorageFiles, bulkDeleteStorageFiles, getStorageCreds, createStorageCreds } from '../../helpers/backend_helper';

// Redux for user info
import { useSelector } from 'react-redux';

// Consistent color palette
const COLORS = {
  primary: '#405189',
  primaryLight: 'rgba(64, 81, 137, 0.1)',
  primaryLighter: 'rgba(64, 81, 137, 0.05)',
  danger: '#cf260fff',
  dangerLight: 'rgba(240, 101, 72, 0.1)',
  success: '#0ab39c',
  successLight: 'rgba(10, 179, 156, 0.1)',
  muted: '#878a99',
  mutedLight: 'rgba(135, 138, 153, 0.1)',
  border: '#e9ebec',
  text: '#495057',
  background: '#f8f9fa',
  white: '#ffffff',
  grey: 'rgb(236, 236, 236)',
  bg: 'rgb(248, 249, 250)',
  btnColor: 'rgb(64, 81, 137)'
};

// Custom styled select component
const StyledSelect = ({ value, onChange, options, icon, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = options.find(opt => opt.value === value);

  return (
    <Dropdown isOpen={isOpen} toggle={() => setIsOpen(!isOpen)}>
      <DropdownToggle
        tag="button"
        className="btn d-flex align-items-center gap-2"
        style={{
          border: `1px solid ${COLORS.border}`,
          borderRadius: '8px',
          padding: '8px 14px',
          fontSize: '13px',
          backgroundColor: COLORS.background,
          minWidth: '150px',
          color: COLORS.text
        }}
      >
        {icon && <i className={icon} style={{ color: COLORS.primary, fontSize: '15px' }}></i>}
        <span style={{ flex: 1, textAlign: 'left' }}>{selectedOption?.label || placeholder}</span>
        <i className={`bx bx-chevron-${isOpen ? 'up' : 'down'}`} style={{ color: COLORS.muted }}></i>
      </DropdownToggle>
      <DropdownMenu
        style={{
          borderRadius: '10px',
          boxShadow: '0 8px 24px rgba(64, 81, 137, 0.15)',
          border: `1px solid ${COLORS.border}`,
          padding: '6px',
          minWidth: '180px',
          marginTop: '4px'
        }}
      >
        {options.map((option) => (
          <DropdownItem
            key={option.value}
            onClick={() => onChange(option.value)}
            style={{
              fontSize: '13px',
              padding: '10px 14px',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              backgroundColor: value === option.value ? COLORS.primaryLight : 'transparent',
              color: value === option.value ? COLORS.primary : COLORS.text,
              marginBottom: '2px'
            }}
          >
            {option.icon && (
              <i className={option.icon} style={{ fontSize: '16px', color: COLORS.primary }}></i>
            )}
            <span>{option.label}</span>
            {value === option.value && (
              <i className="bx bx-check ms-auto" style={{ color: COLORS.primary, fontSize: '16px' }}></i>
            )}
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
};

const StorageExplorer = () => {
  const history = useHistory();
  const [files, setFiles] = useState([]);
  const [currentPath, setCurrentPath] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // UX States
  const [preLoading, setPreLoading] = useState(false);
  const [warningModal, setWarningModal] = useState({ status: false });

  const [stats, setStats] = useState({
    total_files: 0,
    total_folders: 0,
    total_size: 0
  });

  // Multi-select state
  const [selectedFiles, setSelectedFiles] = useState(new Set());

  // Dropdown state for three-dots menu
  const [openDropdown, setOpenDropdown] = useState(null);

  // Search, Sort, Filter, View States
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [filterType, setFilterType] = useState('all');
  const [viewMode, setViewMode] = useState('grid');

  // Settings Modal State
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [settingsLoading, setSettingsLoading] = useState(false);
  const [isServiceEnabled, setIsServiceEnabled] = useState(false);
  const [storageType, setStorageType] = useState('system');
  const [s3Config, setS3Config] = useState({
    bucket_name: '',
    region: 'us-east-1',
    access_key: '',
    secret_key: '',
    endpoint_url: ''
  });

  // Get user info from Redux
  const { userRNP } = useSelector((state) => ({
    userRNP: state.UserSession.userRNP
  }));

  // Fetch files from API
  useEffect(() => {
    fetchFiles();
  }, []);

  // Fetch storage settings when settings panel is opened
  useEffect(() => {
    if (settingsOpen && userRNP?.subscription?.id) {
      fetchStorageSettings();
    }
  }, [settingsOpen, userRNP]);

  const fetchStorageSettings = async () => {
    try {
      setSettingsLoading(true);
      const response = await getStorageCreds();

      if (response && response.storage_type && response.storage_type !== '') {
        const type = response.storage_type || 'system';
        setStorageType(type);

        let hasConfiguration = false;
        if (type === 's3') {
          hasConfiguration = response.config && response.config.bucket_name;
        } else if (type === 'system') {
          hasConfiguration = response.config !== null && response.config !== undefined;
        }
        setIsServiceEnabled(hasConfiguration);

        if (type === 's3' && response.config && response.config.bucket_name) {
          setS3Config({
            bucket_name: response.config.bucket_name || '',
            region: response.config.region || 'us-east-1',
            access_key: response.config.access_key || '',
            secret_key: '',
            endpoint_url: response.config.endpoint_url || ''
          });
        }
      } else {
        setIsServiceEnabled(false);
        setStorageType('system');
      }
    } catch (error) {
      console.error("Failed to load storage settings", error);
      setIsServiceEnabled(false);
      setStorageType('system');
    } finally {
      setSettingsLoading(false);
    }
  };

  const handleS3ConfigChange = (e) => {
    const { name, value } = e.target;
    setS3Config(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveStorageSettings = async () => {
    setSettingsLoading(true);
    try {
      let payload;
      if (!isServiceEnabled) {
        payload = { storage_type: 'system', config: null };
      } else if (storageType === 'system') {
        payload = { storage_type: 'system', config: {} };
      } else if (storageType === 's3') {
        payload = {
          storage_type: 's3',
          config: {
            bucket_name: s3Config.bucket_name,
            region: s3Config.region,
            access_key: s3Config.access_key,
            secret_key: s3Config.secret_key,
            ...(s3Config.endpoint_url && { endpoint_url: s3Config.endpoint_url })
          }
        };
      }

      await createStorageCreds(payload);
      CustomNotification.success("Storage configuration updated successfully!");
      setSettingsOpen(false);
    } catch (error) {
      const errorMsg = error.response?.data?.detail || "Failed to update storage configuration.";
      CustomNotification.error(errorMsg);
    } finally {
      setSettingsLoading(false);
    }
  };

  const fetchFiles = async (showLoader = true) => {
    try {
      if (showLoader) setLoading(true);
      setError(null);

      const response = await getStorageFiles({ page: 1, rows: 1000 });

      if (response.success) {
        setFiles(response.data || []);
        setStats(response.stats || { total_files: 0, total_folders: 0, total_size: 0 });
      } else {
        setError(response.data || 'Failed to fetch files');
        CustomNotification.error(response.data || 'Failed to fetch files');
      }
    } catch (err) {
      console.error('Error fetching storage files:', err);
      setError('Failed to load files. Please try again.');
      CustomNotification.error('Failed to load files.');
    } finally {
      if (showLoader) setLoading(false);
    }
  };

  const overallStats = useMemo(() => ({
    totalFiles: stats.total_files || 0,
    totalSize: stats.total_size || 0,
    uniqueFolders: stats.total_folders || 0
  }), [stats]);

  const getFileType = (file) => {
    if (file.type === 'folder') return 'folder';
    const mimeType = file.mime_type || '';
    const fileName = file.file_name || '';
    if (mimeType.includes('pdf') || fileName.toLowerCase().endsWith('.pdf')) return 'pdf';
    if (mimeType.includes('image') || /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(fileName)) return 'image';
    return 'other';
  };

  const { viewItems, rootId } = useMemo(() => {
    if (!files.length) return { viewItems: [], rootId: null };

    const detectedRoot = files[0].storage_path.split('/')[0];
    const items = files.reduce((acc, file) => {
      const parts = file.storage_path.split('/');
      const dirParts = parts.slice(0, -1);
      const targetPath = [detectedRoot, ...currentPath];
      const isMatch = targetPath.every((part, i) => dirParts[i] === part);

      if (isMatch) {
        const nextSegmentIndex = targetPath.length;
        const nextSegment = parts[nextSegmentIndex];
        if (nextSegment === file.file_name) {
          acc.files.push(file);
        } else if (nextSegment) {
          if (!acc.folders.some(f => f.name === nextSegment)) {
            acc.folders.push({ name: nextSegment, type: 'folder' });
          }
        }
      }
      return acc;
    }, { folders: [], files: [] });

    let combined = [...items.folders, ...items.files];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      combined = combined.filter(item => {
        const name = item.type === 'folder' ? item.name : item.file_name;
        return name.toLowerCase().includes(query);
      });
    }

    if (filterType !== 'all') {
      combined = combined.filter(item => {
        const type = getFileType(item);
        return type === filterType;
      });
    }

    combined.sort((a, b) => {
      if (a.type === 'folder' && b.type !== 'folder') return -1;
      if (a.type !== 'folder' && b.type === 'folder') return 1;

      let comparison = 0;
      if (sortBy === 'name') {
        const nameA = (a.type === 'folder' ? a.name : a.file_name).toLowerCase();
        const nameB = (b.type === 'folder' ? b.name : b.file_name).toLowerCase();
        comparison = nameA.localeCompare(nameB);
      } else if (sortBy === 'date') {
        const dateA = a.created_at ? new Date(a.created_at) : new Date(0);
        const dateB = b.created_at ? new Date(b.created_at) : new Date(0);
        comparison = dateA - dateB;
      } else if (sortBy === 'size') {
        comparison = (a.size_bytes || 0) - (b.size_bytes || 0);
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return { viewItems: combined, rootId: detectedRoot };
  }, [files, currentPath, searchQuery, sortBy, sortOrder, filterType]);

  const selectableFiles = useMemo(() => viewItems.filter(item => item.type !== 'folder'), [viewItems]);

  const handleEnterFolder = (folderName) => {
    setCurrentPath([...currentPath, folderName]);
    setSelectedFiles(new Set());
    setSearchQuery('');
  };

  const handleNavigateUp = (index) => {
    if (index === -1) setCurrentPath([]);
    else setCurrentPath(currentPath.slice(0, index + 1));
    setSelectedFiles(new Set());
    setSearchQuery('');
  };

  const handleOpenFile = (file) => {
    if (selectedFiles.size === 0) {
      window.open(file.public_url, '_blank');
    }
  };

  const toggleFileSelection = (fileId, e) => {
    e.stopPropagation();
    const newSelected = new Set(selectedFiles);
    if (newSelected.has(fileId)) newSelected.delete(fileId);
    else newSelected.add(fileId);
    setSelectedFiles(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedFiles.size === selectableFiles.length) {
      setSelectedFiles(new Set());
    } else {
      setSelectedFiles(new Set(selectableFiles.map(f => f._id)));
    }
  };

  const toggleDropdown = (itemKey, e) => {
    e.stopPropagation();
    setOpenDropdown(openDropdown === itemKey ? null : itemKey);
  };

  const formatSize = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
      let isoString = dateString;
      if (!dateString.endsWith('Z') && !dateString.includes('+')) isoString = dateString + 'Z';
      return new Date(isoString).toLocaleString('en-US', {
        year: 'numeric', month: 'short', day: 'numeric',
        hour: '2-digit', minute: '2-digit', hour12: true
      });
    } catch { return dateString; }
  };

  const getRelativeTime = (dateString) => {
    if (!dateString) return '';
    try {
      let isoString = dateString;
      if (!dateString.endsWith('Z') && !dateString.includes('+')) isoString = dateString + 'Z';
      const diffInSeconds = Math.floor((new Date() - new Date(isoString)) / 1000);
      if (diffInSeconds < 60) return 'just now';
      if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
      if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
      if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;
      return `${Math.floor(diffInSeconds / 2592000)}mo ago`;
    } catch { return ''; }
  };

  const getFileIcon = (file) => {
    const type = getFileType(file);
    if (type === 'folder') return { icon: 'bx bxs-folder', color: COLORS.primary, bg: COLORS.primaryLight };
    if (type === 'pdf') return { icon: 'bx bxs-file-pdf', color: COLORS.danger, bg: COLORS.dangerLight };
    if (type === 'image') return { icon: 'bx bxs-image', color: COLORS.success, bg: COLORS.successLight };
    return { icon: 'bx bxs-file', color: COLORS.muted, bg: COLORS.mutedLight };
  };

  const closeModal = () => setWarningModal({ status: false });

  const callBack = async (action, data) => {
    if (action === 'delete_files_bulk') await executeBulkDelete();
    else if (action === 'delete_folder') await executeFolderDelete(data.fileIdsArray, data.folderName);
  };

  const confirmBulkDelete = () => {
    if (selectedFiles.size === 0) return;
    setWarningModal({
      status: true, action: 'delete_files_bulk', message: 'DELETE_CONFIRMATION', data: {},
      customMessage: `Are you sure you want to delete ${selectedFiles.size} file(s)?`
    });
  };

  const confirmFolderDelete = (folderName) => {
    setOpenDropdown(null);
    const fullFolderPath = [...currentPath, folderName].join('/');
    const filesInFolder = files.filter(file => {
      const detectedRoot = files[0]?.storage_path.split('/')[0] || "";
      const relativePath = file.storage_path.substring(detectedRoot.length + 1);
      return relativePath.startsWith(fullFolderPath + '/');
    });

    if (filesInFolder.length === 0) {
      CustomNotification.warning('This folder is empty.');
      return;
    }

    setWarningModal({
      status: true, action: 'delete_folder', message: 'DELETE_FOLDER_CONFIRMATION',
      data: { folderName, fileIdsArray: filesInFolder.map(f => f._id) },
      customMessage: `Delete folder "${folderName}" and all ${filesInFolder.length} file(s) inside it?`
    });
  };

  const executeBulkDelete = async () => {
    closeModal();
    setPreLoading(true);
    try {
      const response = await bulkDeleteStorageFiles({ file_ids: Array.from(selectedFiles) });
      if (response.success) {
        CustomNotification.success(response.data?.message || "Files deleted successfully");
        setSelectedFiles(new Set());
        await fetchFiles(false);
      } else {
        CustomNotification.error(response.data || 'Failed to delete files');
      }
    } catch (err) {
      CustomNotification.error('Failed to delete files. Please try again.');
    } finally {
      setPreLoading(false);
    }
  };

  const executeFolderDelete = async (fileIdsArray, folderName) => {
    closeModal();
    setPreLoading(true);
    try {
      const response = await bulkDeleteStorageFiles({ file_ids: fileIdsArray });
      if (response.success) {
        CustomNotification.success(`Deleted folder: ${folderName}`);
        await fetchFiles(false);
      } else {
        CustomNotification.error(response.data || 'Failed to delete folder');
      }
    } catch (err) {
      CustomNotification.error('Failed to delete folder. Please try again.');
    } finally {
      setPreLoading(false);
    }
  };

  const handleSort = (field) => {
    if (sortBy === field) setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    else { setSortBy(field); setSortOrder('asc'); }
  };

  // // Filter options with icons - using consistent primary color
  // const filterOptions = [
  //   { value: 'all', label: 'All Files', icon: 'bx bx-category' },
  //   { value: 'folder', label: 'Folders', icon: 'bx bxs-folder' },
  //   { value: 'pdf', label: 'PDF Files', icon: 'bx bxs-file-pdf' },
  //   { value: 'image', label: 'Images', icon: 'bx bxs-image' },
  //   { value: 'other', label: 'Other', icon: 'bx bxs-file' }
  // ];

  // Sort options with icons - using consistent primary color
  const sortOptions = [
    { value: 'name', label: 'Name', icon: 'bx bx-text' },
    { value: 'date', label: 'Date Modified', icon: 'bx bx-calendar' },
    { value: 'size', label: 'File Size', icon: 'bx bx-hdd' }
  ];

  // File action dropdown renderer
  const renderFileActionDropdown = (item, itemKey, isFolder) => {
    return (
      <Dropdown isOpen={openDropdown === itemKey} toggle={(e) => toggleDropdown(itemKey, e)}>
        <DropdownToggle
          tag="button"
          className="btn btn-sm border-0 p-1"
          style={{ backgroundColor: 'transparent', borderRadius: '6px' }}
        >
          <i className="bx bx-dots-vertical-rounded" style={{ fontSize: '18px', color: COLORS.muted }}></i>
        </DropdownToggle>
        <DropdownMenu
          end
          style={{
            borderRadius: '10px',
            boxShadow: '0 8px 24px rgba(64, 81, 137, 0.15)',
            border: `1px solid ${COLORS.border}`,
            padding: '6px',
            minWidth: '200px'
          }}
        >
          {isFolder ? (
            <DropdownItem
              onClick={(e) => { e.stopPropagation(); confirmFolderDelete(item.name); }}
              style={{
                fontSize: '13px', padding: '10px 14px', borderRadius: '6px',
                display: 'flex', alignItems: 'center', gap: '10px', color: COLORS.danger
              }}
            >
              <i className="bx bx-trash" style={{ fontSize: '16px' }}></i>
              <span>Delete Folder</span>
            </DropdownItem>
          ) : (
            <>
              <DropdownItem
                onClick={(e) => { e.stopPropagation(); window.open(item.public_url, '_blank'); }}
                style={{
                  fontSize: '13px', padding: '10px 14px', borderRadius: '6px',
                  display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '2px', color: COLORS.text
                }}
              >
                <i className="bx bx-link-external" style={{ fontSize: '16px', color: COLORS.primary }}></i>
                <span>Open in New Tab</span>
              </DropdownItem>
              <DropdownItem
                onClick={(e) => {
                  e.stopPropagation();
                  navigator.clipboard.writeText(item.public_url);
                  CustomNotification.success('URL copied!');
                }}
                style={{
                  fontSize: '13px', padding: '10px 14px', borderRadius: '6px',
                  display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '2px', color: COLORS.text
                }}
              >
                <i className="bx bx-copy" style={{ fontSize: '16px', color: COLORS.primary }}></i>
                <span>Copy URL</span>
              </DropdownItem>
              <DropdownItem
                tag="a" href={item.public_url} download
                onClick={(e) => e.stopPropagation()}
                style={{
                  fontSize: '13px', padding: '10px 14px', borderRadius: '6px',
                  display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '2px', color: COLORS.text
                }}
              >
                <i className="bx bx-download" style={{ fontSize: '16px', color: COLORS.primary }}></i>
                <span>Download</span>
              </DropdownItem>
              <div style={{ height: '1px', backgroundColor: COLORS.border, margin: '6px 0' }}></div>
              <DropdownItem
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedFiles(new Set([item._id]));
                  setTimeout(() => confirmBulkDelete(), 0);
                }}
                style={{
                  fontSize: '13px', padding: '10px 14px', borderRadius: '6px',
                  display: 'flex', alignItems: 'center', gap: '10px', color: COLORS.danger
                }}
              >
                <i className="bx bx-trash" style={{ fontSize: '16px' }}></i>
                <span>Delete File</span>
              </DropdownItem>
            </>
          )}
        </DropdownMenu>
      </Dropdown>
    );
  };

  return (
    <React.Fragment>
      <div className='page-content' style={{ fontSize: '13px', fontFamily: '"Open Sans", sans-serif' }}>
          <MetaTag pageTitle='Storage Explorer | DIG' />
          <Container fluid>
            {/* HEADER with title and actions */}
            <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
              <div>
                <h4 className="mb-1" style={{ fontSize: '18px', fontWeight: '600', fontFamily: '"Open Sans", sans-serif' }}>Storage Explorer</h4>
              </div>
              <div className="d-flex align-items-center gap-2">
                <button
                  onClick={() => setSettingsOpen(true)}
                  style={{
                    borderRadius: '6px',
                    padding: '8px 16px',
                    fontSize: '13px',
                    fontFamily: '"Open Sans", sans-serif',
                    backgroundColor: COLORS.grey,
                    border: `1px solid ${COLORS.border}`,
                    color: COLORS.text,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    cursor: 'pointer'
                  }}
                >
                  <i className="bx bx-cog" style={{ fontSize: '16px', color: COLORS.back }}></i>
                  <span>Settings</span>
                </button>
                <button
                  onClick={() => fetchFiles(true)}
                  style={{
                    borderRadius: '6px',
                    padding: '8px 16px',
                    fontSize: '13px',
                    fontFamily: '"Open Sans", sans-serif',
                    // backgroundColor: COLORS.text,
                    backgroundColor: COLORS.btnColor,
                    border: 'none',
                    color: COLORS.white,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    cursor: 'pointer'
                  }}
                >
                  <i className="bx bx-refresh" style={{ fontSize: '16px' }}></i>
                  <span>Refresh</span>
                </button>
              </div>
            </div>

            {/* ERROR MESSAGE */}
            {error && (
              <Alert color="danger" className="d-flex justify-content-between align-items-center mb-4" style={{ borderRadius: '10px' }}>
                <span><i className="bx bx-error-circle me-2"></i>{error}</span>
                <Button color="danger" outline size="sm" onClick={() => fetchFiles(true)}>
                  <i className="bx bx-refresh me-1"></i>Retry
                </Button>
              </Alert>
            )}

            {/* STATS BAR */}
            {!loading && (
              <Card className="border-0 shadow-sm mb-4" style={{ borderRadius: '12px' }}>
                <CardBody className="py-3">
                  <div className="d-flex flex-wrap align-items-center justify-content-between gap-4">
                    <div className="d-flex align-items-center gap-4">
                      {/* Folders */}
                      <div className="d-flex align-items-center gap-3">
                        <div style={{ width: '44px', height: '44px', borderRadius: '10px', backgroundColor: COLORS.primaryLight, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <i className="bx bx-folder" style={{ fontSize: '22px', color: COLORS.primary }}></i>
                        </div>
                        <div>
                          <div className="text-muted" style={{ fontSize: '12px' }}>Folders</div>
                          <div className="fw-semibold" style={{ fontSize: '18px', color: COLORS.text }}>{overallStats.uniqueFolders}</div>
                        </div>
                      </div>

                      <div style={{ width: '1px', height: '40px', backgroundColor: COLORS.border }}></div>

                      {/* Files */}
                      <div className="d-flex align-items-center gap-3">
                        <div style={{ width: '44px', height: '44px', borderRadius: '10px', backgroundColor: COLORS.primaryLight, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <i className="bx bx-file" style={{ fontSize: '22px', color: COLORS.primary }}></i>
                        </div>
                        <div>
                          <div className="text-muted" style={{ fontSize: '12px' }}>Files</div>
                          <div className="fw-semibold" style={{ fontSize: '18px', color: COLORS.text }}>{overallStats.totalFiles}</div>
                        </div>
                      </div>

                      <div style={{ width: '1px', height: '40px', backgroundColor: COLORS.border }}></div>

                      {/* Size */}
                      <div className="d-flex align-items-center gap-3">
                        <div style={{ width: '44px', height: '44px', borderRadius: '10px', backgroundColor: COLORS.primaryLight, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <i className="bx bx-hdd" style={{ fontSize: '22px', color: COLORS.primary }}></i>
                        </div>
                        <div>
                          <div className="text-muted" style={{ fontSize: '12px' }}>Total Size</div>
                          <div className="fw-semibold" style={{ fontSize: '18px', color: COLORS.text }}>{formatSize(overallStats.totalSize)}</div>
                        </div>
                      </div>
                    </div>

                    {/* Current path indicator */}
                    <div className="d-flex align-items-center gap-2 text-muted" style={{ fontSize: '13px' }}>
                      <i className="bx bx-folder-open" style={{ color: COLORS.primary }}></i>
                      <span>Current: {currentPath.length === 0 ? 'Root' : currentPath.join(' / ')}</span>
                    </div>
                  </div>
                </CardBody>
              </Card>
            )}

            {/* MAIN FILE EXPLORER */}
            <Card className="border-0 shadow-sm" style={{ borderRadius: '12px' }}>
              {/* TOOLBAR */}
              <CardBody className="border-bottom py-3">
                <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
                  {/* Left side: Breadcrumb + Search */}
                  <div className="d-flex align-items-center gap-3 flex-grow-1">
                    {/* Breadcrumb */}
                    <div className="d-flex align-items-center" style={{ fontSize: '13px', fontFamily: '"Open Sans", sans-serif', gap: '1px' }}>
                      <button
                        onClick={() => handleNavigateUp(-1)}
                        style={{
                          borderRadius: '6px',
                          padding: '8px 12px',
                          backgroundColor: COLORS.white,
                          border: `1px solid ${COLORS.border}`,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                        title="Go to root"
                      >
                        <i className="bx bxs-home" style={{ fontSize: '16px', color: COLORS.primary }}></i>
                      </button>
                      {currentPath.map((folder, index) => (
                        <React.Fragment key={folder}>
                          <i className="bx bx-chevron-right" style={{ color: COLORS.muted, fontSize: '16px' }}></i>
                          <button
                            onClick={() => handleNavigateUp(index)}
                            style={{
                              borderRadius: '6px',
                              padding: '6px 14px',
                              backgroundColor: COLORS.white,
                              border: `1px solid ${COLORS.border}`,
                              color: COLORS.text,
                              cursor: 'pointer',
                              fontSize: '13px',
                              fontFamily: '"Open Sans", sans-serif'
                            }}
                          >
                            {folder}
                          </button>
                        </React.Fragment>
                      ))}
                    </div>

                    {/* Search */}
                    <div className="position-relative" style={{ minWidth: '250px', maxWidth: '350px', flex: 1 }}>
                      <i className="bx bx-search position-absolute" style={{ left: '12px', top: '50%', transform: 'translateY(-50%)', color: COLORS.muted, fontSize: '16px' }}></i>
                      <Input
                        type="text"
                        placeholder="Search files..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{
                          paddingLeft: '40px',
                          paddingRight: searchQuery ? '36px' : '12px',
                          borderRadius: '8px',
                          border: `1px solid ${COLORS.border}`,
                          fontSize: '13px',
                          height: '40px',
                          fontFamily: '"Open Sans", sans-serif'
                        }}
                      />
                      {searchQuery && (
                        <button
                          className="position-absolute border-0"
                          onClick={() => setSearchQuery('')}
                          style={{ right: '4px', top: '50%', transform: 'translateY(-50%)', padding: '4px 8px', backgroundColor: 'transparent', cursor: 'pointer' }}
                        >
                          <i className="bx bx-x" style={{ fontSize: '16px', color: COLORS.muted }}></i>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Right side: Filters + View */}
                  <div className="d-flex align-items-center gap-2">
                    {/* <StyledSelect
                      value={filterType}
                      onChange={setFilterType}
                      options={filterOptions}
                      icon="bx bx-filter"
                      placeholder="Filter"
                    /> */}

                    <StyledSelect
                      value={sortBy}
                      onChange={setSortBy}
                      options={sortOptions}
                      icon="bx bx-sort-alt-2"
                      placeholder="Sort"
                    />

                    <button
                      className="btn"
                      onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                      style={{
                        borderRadius: '8px',
                        padding: '8px 12px',
                        border: `1px solid ${COLORS.border}`,
                        backgroundColor: COLORS.bg,
                        // backgroundColor: 'rgb(248, 249, 250)',
                        color: COLORS.primary
                      }}
                      title={sortOrder === 'asc' ? 'Ascending' : 'Descending'}
                    >
                      <i className={`bx ${sortOrder === 'asc' ? 'bx-sort-up' : 'bx-sort-down'}`} style={{ fontSize: '18px' }}></i>
                    </button>

                    <div style={{ width: '1px', height: '32px', backgroundColor: COLORS.border, margin: '0 4px' }}></div>

                    <div className="btn-group">
                      <button
                        className="btn"
                        onClick={() => setViewMode('grid')}
                        style={{
                          borderRadius: '8px 0 0 8px',
                          padding: '8px 12px',
                          border: `1px solid ${viewMode === 'grid' ? COLORS.primary : COLORS.border}`,
                          backgroundColor: viewMode === 'grid' ? COLORS.primary : COLORS.white,
                          color: viewMode === 'grid' ? COLORS.white : COLORS.primary
                        }}
                      >
                        <i className="bx bx-grid-alt" style={{ fontSize: '18px' }}></i>
                      </button>
                      <button
                        className="btn"
                        onClick={() => setViewMode('list')}
                        style={{
                          borderRadius: '0 8px 8px 0',
                          padding: '8px 12px',
                          border: `1px solid ${viewMode === 'list' ? COLORS.primary : COLORS.border}`,
                          backgroundColor: viewMode === 'list' ? COLORS.primary : COLORS.white,
                          color: viewMode === 'list' ? COLORS.white : COLORS.primary
                        }}
                      >
                        <i className="bx bx-list-ul" style={{ fontSize: '18px' }}></i>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Selection bar */}
                {selectedFiles.size > 0 && (
                  <div className="d-flex align-items-center gap-3 mt-3 pt-3 border-top">
                    <span className="badge bg-primary" style={{ fontSize: '12px', padding: '8px 12px', borderRadius: '6px' }}>
                      {selectedFiles.size} selected
                    </span>
                    <Button color="soft-primary" size="sm" onClick={handleSelectAll} style={{ borderRadius: '6px' }}>
                      {selectedFiles.size === selectableFiles.length ? 'Deselect All' : 'Select All'}
                    </Button>
                    <Button color="danger" size="sm" onClick={confirmBulkDelete} style={{ borderRadius: '6px' }}>
                      <i className="bx bx-trash me-1"></i> Delete Selected
                    </Button>
                  </div>
                )}
              </CardBody>

              {/* FILE CONTENT */}
              <CardBody style={{ minHeight: '450px', backgroundColor: COLORS.background }}>
                {loading && (
                  <div className="d-flex flex-column align-items-center justify-content-center py-5">
                    <Spinner color="primary" style={{ width: '2.5rem', height: '2.5rem' }} />
                    <p className="mt-3 text-muted mb-0">Loading files...</p>
                  </div>
                )}

                {!loading && viewItems.length === 0 && (
                  <div className="text-center py-5">
                    <div style={{ width: '100px', height: '100px', borderRadius: '50%', backgroundColor: COLORS.primaryLight, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                      <i className="bx bx-folder-open" style={{ fontSize: '48px', color: COLORS.primary }}></i>
                    </div>
                    <h5 className="mb-2" style={{ color: COLORS.text }}>
                      {searchQuery ? 'No files match your search' : 'This folder is empty'}
                    </h5>
                    <p className="text-muted" style={{ fontSize: '13px' }}>
                      {searchQuery ? 'Try adjusting your search terms' : 'Upload files or create folders to get started'}
                    </p>
                    {searchQuery && (
                      <Button color="primary" size="sm" onClick={() => setSearchQuery('')} style={{ borderRadius: '8px' }}>
                        Clear Search
                      </Button>
                    )}
                  </div>
                )}

                {/* GRID VIEW */}
                {!loading && viewMode === 'grid' && viewItems.length > 0 && (
                  <div className="row g-3">
                    {viewItems.map((item, index) => {
                      const itemKey = item.type === 'folder' ? `folder-${item.name}` : `file-${item._id}`;
                      const iconInfo = getFileIcon(item);
                      const isFolder = item.type === 'folder';

                      return (
                        <div key={index} className="col-xl-2 col-lg-3 col-md-4 col-sm-6">
                          <div
                            className="position-relative rounded-3 p-3 text-center h-100"
                            onClick={() => isFolder ? handleEnterFolder(item.name) : handleOpenFile(item)}
                            style={{
                              cursor: 'pointer',
                              transition: 'all 0.2s ease',
                              backgroundColor: selectedFiles.has(item._id) ? COLORS.primaryLighter : COLORS.white,
                              border: selectedFiles.has(item._id) ? `2px solid ${COLORS.primary}` : `1px solid ${COLORS.border}`
                            }}
                            onMouseEnter={(e) => { if (!selectedFiles.has(item._id)) e.currentTarget.style.boxShadow = '0 4px 16px rgba(64, 81, 137, 0.12)'; }}
                            onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}
                          >
                            {/* Checkbox for files */}
                            {!isFolder && (
                              <div className="position-absolute top-0 start-0 m-2" onClick={(e) => toggleFileSelection(item._id, e)}>
                                <Input type="checkbox" checked={selectedFiles.has(item._id)} onChange={() => {}} style={{ cursor: 'pointer', width: '18px', height: '18px' }} />
                              </div>
                            )}

                            {/* Actions dropdown */}
                            <div className="position-absolute top-0 end-0 m-1">
                              {renderFileActionDropdown(item, itemKey, isFolder)}
                            </div>

                            {/* Icon */}
                            <div className="d-flex align-items-center justify-content-center mx-auto mb-3 rounded-3" style={{ width: '64px', height: '64px', backgroundColor: iconInfo.bg }}>
                              <i className={iconInfo.icon} style={{ fontSize: '36px', color: iconInfo.color }}></i>
                            </div>

                            {/* Name */}
                            <h6 className="text-truncate mb-1 fw-medium" title={isFolder ? item.name : item.file_name} style={{ fontSize: '13px', color: COLORS.text }}>
                              {isFolder ? item.name : item.file_name}
                            </h6>

                            {/* Meta info */}
                            {!isFolder && (
                              <div className="d-flex align-items-center justify-content-center gap-2">
                                <span className="text-muted" style={{ fontSize: '11px' }}>{formatSize(item.size_bytes)}</span>
                                <span className="text-muted" style={{ fontSize: '11px' }}>•</span>
                                <span className="text-muted" style={{ fontSize: '11px' }}>{getRelativeTime(item.created_at)}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* LIST VIEW */}
                {!loading && viewMode === 'list' && viewItems.length > 0 && (
                  <div className="rounded-3" style={{ border: `1px solid ${COLORS.border}`, backgroundColor: COLORS.white }}>
                    <Table className="table-hover align-middle mb-0" style={{ fontSize: '13px' }}>
                      <thead>
                        <tr style={{ backgroundColor: COLORS.background }}>
                          <th style={{ width: '40px', padding: '12px 16px', borderBottom: `1px solid ${COLORS.border}` }}>
                            {selectableFiles.length > 0 && (
                              <Input type="checkbox" checked={selectedFiles.size === selectableFiles.length && selectableFiles.length > 0} onChange={handleSelectAll} style={{ cursor: 'pointer' }} />
                            )}
                          </th>
                          <th style={{ padding: '12px 16px', cursor: 'pointer', borderBottom: `1px solid ${COLORS.border}`, color: COLORS.text }} onClick={() => handleSort('name')}>
                            Name {sortBy === 'name' && <i className={`bx ${sortOrder === 'asc' ? 'bx-chevron-up' : 'bx-chevron-down'}`} style={{ color: COLORS.primary }}></i>}
                          </th>
                          <th style={{ padding: '12px 16px', borderBottom: `1px solid ${COLORS.border}`, width: '120px', color: COLORS.text }}>Type</th>
                          <th style={{ padding: '12px 16px', cursor: 'pointer', borderBottom: `1px solid ${COLORS.border}`, width: '100px', color: COLORS.text }} onClick={() => handleSort('size')}>
                            Size {sortBy === 'size' && <i className={`bx ${sortOrder === 'asc' ? 'bx-chevron-up' : 'bx-chevron-down'}`} style={{ color: COLORS.primary }}></i>}
                          </th>
                          <th style={{ padding: '12px 16px', cursor: 'pointer', borderBottom: `1px solid ${COLORS.border}`, width: '180px', color: COLORS.text }} onClick={() => handleSort('date')}>
                            Modified {sortBy === 'date' && <i className={`bx ${sortOrder === 'asc' ? 'bx-chevron-up' : 'bx-chevron-down'}`} style={{ color: COLORS.primary }}></i>}
                          </th>
                          <th style={{ width: '60px', padding: '12px 16px', borderBottom: `1px solid ${COLORS.border}` }}></th>
                        </tr>
                      </thead>
                      <tbody>
                        {viewItems.map((item, index) => {
                          const itemKey = item.type === 'folder' ? `folder-${item.name}` : `file-${item._id}`;
                          const iconInfo = getFileIcon(item);
                          const isFolder = item.type === 'folder';

                          return (
                            <tr
                              key={index}
                              style={{ cursor: 'pointer', backgroundColor: COLORS.white }}
                              onClick={() => isFolder ? handleEnterFolder(item.name) : handleOpenFile(item)}
                            >
                              <td style={{ padding: '12px 16px' }} onClick={(e) => e.stopPropagation()}>
                                {!isFolder && (
                                  <Input type="checkbox" checked={selectedFiles.has(item._id)} onChange={(e) => toggleFileSelection(item._id, e)} style={{ cursor: 'pointer' }} />
                                )}
                              </td>
                              <td style={{ padding: '12px 16px' }}>
                                <div className="d-flex align-items-center gap-3">
                                  <div className="rounded-2 d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px', backgroundColor: iconInfo.bg }}>
                                    <i className={iconInfo.icon} style={{ color: iconInfo.color, fontSize: '20px' }}></i>
                                  </div>
                                  <span className="fw-medium" style={{ color: COLORS.text }}>{isFolder ? item.name : item.file_name}</span>
                                </div>
                              </td>
                              <td style={{ padding: '12px 16px' }}>
                                <span className="badge" style={{ backgroundColor: iconInfo.bg, color: iconInfo.color, fontSize: '11px', padding: '6px 10px', borderRadius: '6px' }}>
                                  {isFolder ? 'Folder' : getFileType(item).toUpperCase()}
                                </span>
                              </td>
                              <td style={{ padding: '12px 16px' }}>
                                <span className="text-muted">{isFolder ? '-' : formatSize(item.size_bytes)}</span>
                              </td>
                              <td style={{ padding: '12px 16px' }}>
                                {item.created_at ? (
                                  <div>
                                    <div style={{ fontSize: '13px', color: COLORS.text }}>{formatDate(item.created_at)}</div>
                                    <div className="text-muted" style={{ fontSize: '11px' }}>{getRelativeTime(item.created_at)}</div>
                                  </div>
                                ) : <span className="text-muted">-</span>}
                              </td>
                              <td style={{ padding: '12px 16px' }} onClick={(e) => e.stopPropagation()}>
                                {renderFileActionDropdown(item, itemKey, isFolder)}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </Table>
                  </div>
                )}
              </CardBody>
            </Card>
          </Container>

          {/* SETTINGS MODAL */}
          <Modal isOpen={settingsOpen} toggle={() => setSettingsOpen(false)} centered size="lg">
            <ModalHeader toggle={() => setSettingsOpen(false)} style={{ borderBottom: `1px solid ${COLORS.border}` }}>
              <div className="d-flex align-items-center gap-2">
                <i className="bx bx-cog" style={{ fontSize: '20px', color: COLORS.primary }}></i>
                <span style={{ color: COLORS.text }}>Storage Settings</span>
              </div>
            </ModalHeader>
            <ModalBody>
              {settingsLoading ? (
                <div className="d-flex flex-column align-items-center justify-content-center py-5">
                  <Spinner color="primary" />
                  <span className="text-muted mt-2">Loading settings...</span>
                </div>
              ) : (
                <div>
                  <Alert color="info" className="mb-4" style={{ borderRadius: '8px' }}>
                    <i className="bx bx-info-circle me-2"></i>
                    Configure where your generated PDFs will be stored.
                  </Alert>

                  {/* Toggle */}
                  <div className="d-flex align-items-center justify-content-between p-3 rounded-3 mb-4" style={{ backgroundColor: COLORS.background }}>
                    <div>
                      <h6 className="mb-1" style={{ fontSize: '14px', color: COLORS.text }}>Enable Storage</h6>
                      <span className="text-muted" style={{ fontSize: '12px' }}>Save PDFs to cloud storage</span>
                    </div>
                    <div className="form-check form-switch form-switch-lg mb-0">
                      <Input type="switch" checked={isServiceEnabled} onChange={(e) => setIsServiceEnabled(e.target.checked)} />
                    </div>
                  </div>

                  {isServiceEnabled && (
                    <>
                      <Label className="text-muted text-uppercase fw-bold mb-2" style={{ fontSize: '11px' }}>Storage Provider</Label>
                      <div className="d-flex gap-2 mb-4">
                        <div
                          className="flex-grow-1 p-3 rounded-3"
                          onClick={() => setStorageType('system')}
                          style={{ cursor: 'pointer', border: storageType === 'system' ? `2px solid ${COLORS.primary}` : `1px solid ${COLORS.border}`, backgroundColor: storageType === 'system' ? COLORS.primaryLighter : COLORS.white }}
                        >
                          <div className="d-flex align-items-center gap-2">
                            <i className="bx bx-cloud" style={{ fontSize: '20px', color: storageType === 'system' ? COLORS.primary : COLORS.muted }}></i>
                            <div>
                              <div className="fw-medium" style={{ fontSize: '13px', color: COLORS.text }}>System Cloud</div>
                              <div className="text-muted" style={{ fontSize: '11px' }}>Managed</div>
                            </div>
                          </div>
                        </div>
                        <div
                          className="flex-grow-1 p-3 rounded-3"
                          onClick={() => setStorageType('s3')}
                          style={{ cursor: 'pointer', border: storageType === 's3' ? `2px solid ${COLORS.primary}` : `1px solid ${COLORS.border}`, backgroundColor: storageType === 's3' ? COLORS.primaryLighter : COLORS.white }}
                        >
                          <div className="d-flex align-items-center gap-2">
                            <i className="bx bx-data" style={{ fontSize: '20px', color: storageType === 's3' ? COLORS.primary : COLORS.muted }}></i>
                            <div>
                              <div className="fw-medium" style={{ fontSize: '13px', color: COLORS.text }}>S3 Compatible</div>
                              <div className="text-muted" style={{ fontSize: '11px' }}>BYOS</div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {storageType === 's3' && (
                        <div className="p-3 rounded-3" style={{ backgroundColor: COLORS.background }}>
                          <FormGroup className="mb-3">
                            <Label style={{ fontSize: '13px' }}>Endpoint URL <span className="text-muted">(Optional)</span></Label>
                            <Input type="text" name="endpoint_url" value={s3Config.endpoint_url} onChange={handleS3ConfigChange} placeholder="Leave empty for AWS S3" style={{ borderRadius: '8px' }} />
                          </FormGroup>
                          <FormGroup className="mb-3">
                            <Label style={{ fontSize: '13px' }}>Bucket Name <span className="text-danger">*</span></Label>
                            <Input type="text" name="bucket_name" value={s3Config.bucket_name} onChange={handleS3ConfigChange} placeholder="my-bucket" style={{ borderRadius: '8px' }} />
                          </FormGroup>
                          <FormGroup className="mb-3">
                            <Label style={{ fontSize: '13px' }}>Region <span className="text-danger">*</span></Label>
                            <Input type="select" name="region" value={s3Config.region} onChange={handleS3ConfigChange} style={{ borderRadius: '8px' }}>
                              <option value="us-east-1">US East (N. Virginia)</option>
                              <option value="us-east-2">US East (Ohio)</option>
                              <option value="us-west-1">US West (N. California)</option>
                              <option value="us-west-2">US West (Oregon)</option>
                              <option value="eu-west-1">EU (Ireland)</option>
                              <option value="eu-central-1">EU (Frankfurt)</option>
                              <option value="ap-south-1">Asia Pacific (Mumbai)</option>
                              <option value="ap-southeast-1">Asia Pacific (Singapore)</option>
                            </Input>
                          </FormGroup>
                          <Row>
                            <Col md={6}>
                              <FormGroup className="mb-3">
                                <Label style={{ fontSize: '13px' }}>Access Key <span className="text-danger">*</span></Label>
                                <Input type="text" name="access_key" value={s3Config.access_key} onChange={handleS3ConfigChange} placeholder="AKIA..." style={{ borderRadius: '8px' }} />
                              </FormGroup>
                            </Col>
                            <Col md={6}>
                              <FormGroup className="mb-3">
                                <Label style={{ fontSize: '13px' }}>Secret Key <span className="text-danger">*</span></Label>
                                <Input type="password" name="secret_key" value={s3Config.secret_key} onChange={handleS3ConfigChange} style={{ borderRadius: '8px' }} />
                              </FormGroup>
                            </Col>
                          </Row>
                        </div>
                      )}
                    </>
                  )}

                  <div className="d-flex gap-2 mt-4">
                    <Button color="light" onClick={() => setSettingsOpen(false)} style={{ flex: 1, borderRadius: '8px' }}>
                      Cancel
                    </Button>
                    <Button color="primary" onClick={handleSaveStorageSettings} disabled={settingsLoading} style={{ flex: 1, borderRadius: '8px' }}>
                      {settingsLoading ? <Spinner size="sm" /> : 'Save Changes'}
                    </Button>
                  </div>
                </div>
              )}
            </ModalBody>
          </Modal>

          {preLoading && <Preloader />}
        </div>
      </React.Fragment>
  );
};

export default StorageExplorer;

import { useState, useEffect, useCallback } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import {
  Container,
  Spinner,
  Alert,
} from 'reactstrap';
import BreadCrumb from '../../Components/Common/BreadCrumb';
import MetaTag from '../../Components/Common/Meta';
import { FiFileText, FiDownload } from 'react-icons/fi';
import { IoArrowBack } from 'react-icons/io5';
import { getWebhookLogs } from '../../helpers/backend_helper';
import * as XLSX from 'xlsx';

const LogsPage = () => {
  const { id } = useParams();
  const history = useHistory();

  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 20,
    totalPages: 0,
  });
  const [exporting, setExporting] = useState(false);

  const fetchLogs = useCallback(
    (pageNum = 1) => {
      if (!id) return;
      setLoading(true);
      setError('');
      getWebhookLogs({ page: pageNum, limit, connectionId: id })
        .then((res) => {
          setLogs(res.data || []);
          setPagination(
            res.pagination || { total: 0, page: pageNum, limit, totalPages: 0 },
          );
        })
        .catch((err) => {
          console.error('Failed to fetch logs:', err);
          setLogs([]);
          setError('Failed to load logs');
        })
        .finally(() => setLoading(false));
    },
    [id, limit],
  );

  useEffect(() => {
    fetchLogs(1);
  }, [fetchLogs]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
    fetchLogs(newPage);
  };

  // Collect all unique keys from lead fieldData across all logs
  const getFieldColumns = () => {
    const keysSet = new Set();
    logs.forEach((log) => {
      const fieldData = log?.lead?.fieldData || log?.payload || log?.data || {};
      if (typeof fieldData === 'object' && !Array.isArray(fieldData)) {
        Object.keys(fieldData).forEach((k) => keysSet.add(k));
      } else if (Array.isArray(fieldData)) {
        fieldData.forEach((item) => {
          if (item?.name) keysSet.add(item.name);
          else if (typeof item === 'object') Object.keys(item).forEach((k) => keysSet.add(k));
        });
      }
    });
    return Array.from(keysSet);
  };

  // Extract value from fieldData for a given key
  const getFieldValue = (log, key) => {
    const fieldData = log?.lead?.fieldData || log?.payload || log?.data || {};
    if (typeof fieldData === 'object' && !Array.isArray(fieldData)) {
      const val = fieldData[key];
      if (val === undefined || val === null) return '-';
      if (typeof val === 'object') return JSON.stringify(val);
      return String(val);
    }
    if (Array.isArray(fieldData)) {
      const item = fieldData.find((f) => f?.name === key);
      if (item) return item.values?.join(', ') || item.value || '-';
      // fallback: check object keys
      for (const f of fieldData) {
        if (typeof f === 'object' && f[key] !== undefined) {
          return typeof f[key] === 'object' ? JSON.stringify(f[key]) : String(f[key]);
        }
      }
    }
    return '-';
  };

  const fieldColumns = getFieldColumns();

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    return d.toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      success: { color: '#22c55e', label: 'Success' },
      forwarded: { color: '#3b82f6', label: 'Forwarded' },
      failed: { color: '#ef4444', label: 'Failed' },
      error: { color: '#ef4444', label: 'Error' },
      pending: { color: '#f59e0b', label: 'Pending' },
      delivered: { color: '#10b981', label: 'Delivered' },
      received: { color: '#8b5cf6', label: 'Received' },
    };
    const s = statusMap[status?.toLowerCase()] || { color: '#94a3b8', label: status || 'Unknown' };
    return (
      <span
        className='badge'
        style={{ backgroundColor: s.color, color: '#fff', fontSize: '0.7rem', padding: '0.2rem 0.5rem' }}
      >
        {s.label}
      </span>
    );
  };

  const handleExportExcel = async () => {
    setExporting(true);
    try {
      // Fetch all logs for export (up to 1000)
      const res = await getWebhookLogs({ page: 1, limit: 1000, connectionId: id });
      const allLogs = res.data || [];

      // Build all field columns from full dataset
      const allKeysSet = new Set();
      allLogs.forEach((log) => {
        const fieldData = log?.lead?.fieldData || log?.payload || log?.data || {};
        if (typeof fieldData === 'object' && !Array.isArray(fieldData)) {
          Object.keys(fieldData).forEach((k) => allKeysSet.add(k));
        } else if (Array.isArray(fieldData)) {
          fieldData.forEach((item) => {
            if (item?.name) allKeysSet.add(item.name);
            else if (typeof item === 'object') Object.keys(item).forEach((k) => allKeysSet.add(k));
          });
        }
      });
      const allFieldCols = Array.from(allKeysSet);

      const rows = allLogs.map((log, i) => {
        const row = {
          '#': i + 1,
          'Source': log.source || '-',
          'Status': log.status || '-',
          'Leadgen ID': log.leadgenId || '-',
        };
        allFieldCols.forEach((key) => {
          row[key] = getFieldValue(log, key);
        });
        row['Date'] = formatDate(log.createdAt);
        return row;
      });

      const ws = XLSX.utils.json_to_sheet(rows);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Logs');
      XLSX.writeFile(wb, `webhook-logs-${id}.xlsx`);
    } catch (err) {
      console.error('Export failed:', err);
      setError('Failed to export logs');
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className='page-content'>
      <MetaTag title='Webhook Logs' />
      <Container fluid>
        <BreadCrumb title='Webhook Logs' pageTitle='Lead Sources' />

        {/* Header */}
        <div className='d-flex align-items-center justify-content-between mb-4'>
          <div className='d-flex align-items-center gap-3'>
            <button
              className='btn btn-sm btn-soft-secondary d-flex align-items-center gap-1'
              onClick={() => {
                const tab = new URLSearchParams(history.location.search).get('tab') || 'all';
                history.push(`/settings?tab=${tab}`);
              }}
            >
              <IoArrowBack size={14} />
              <span>Back</span>
            </button>
            <h5 className='mb-0 d-flex align-items-center gap-2'>
              <FiFileText />
              Webhook Logs
            </h5>
            {pagination.total > 0 && (
              <span className='text-muted' style={{ fontSize: '0.85rem' }}>
                ({pagination.total} total)
              </span>
            )}
          </div>
          <button
            className='btn btn-sm btn-success d-flex align-items-center gap-1'
            onClick={handleExportExcel}
            disabled={exporting || logs.length === 0}
          >
            {exporting ? <Spinner size='sm' /> : <FiDownload size={14} />}
            <span>{exporting ? 'Exporting...' : 'Export Excel'}</span>
          </button>
        </div>

        {error && (
          <Alert color='danger' className='mb-3' style={{ fontSize: '0.85rem' }} toggle={() => setError('')}>
            {error}
          </Alert>
        )}

        {loading ? (
          <div className='text-center py-5'>
            <Spinner color='primary' />
            <p className='text-muted mt-2' style={{ fontSize: '0.85rem' }}>Loading logs...</p>
          </div>
        ) : logs.length === 0 ? (
          <div className='text-center py-5'>
            <FiFileText style={{ fontSize: '3rem', color: '#cbd5e1' }} />
            <p className='text-muted mt-3'>No logs found for this connection</p>
          </div>
        ) : (
          <div className='card'>
            <div className='card-body p-0'>
              <div className='table-responsive'>
                <table className='table table-sm table-hover table-striped align-middle mb-0'>
                  <thead style={{ backgroundColor: '#f8fafc' }}>
                    <tr style={{ fontSize: '0.8rem', color: '#475569' }}>
                      <th style={{ fontWeight: 600, padding: '10px 12px' }}>#</th>
                      <th style={{ fontWeight: 600, padding: '10px 12px' }}>Source</th>
                      <th style={{ fontWeight: 600, padding: '10px 12px' }}>Status</th>
                      <th style={{ fontWeight: 600, padding: '10px 12px' }}>Leadgen ID</th>
                      {fieldColumns.map((col) => (
                        <th key={col} style={{ fontWeight: 600, padding: '10px 12px', textTransform: 'capitalize' }}>
                          {col.replace(/_/g, ' ')}
                        </th>
                      ))}
                      <th style={{ fontWeight: 600, padding: '10px 12px' }}>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {logs.map((log, index) => (
                      <tr key={log._id || index} style={{ fontSize: '0.83rem' }}>
                        <td style={{ padding: '8px 12px' }} className='text-muted'>
                          {(page - 1) * pagination.limit + index + 1}
                        </td>
                        <td style={{ padding: '8px 12px' }}>
                          <span
                            className='badge'
                            style={{ backgroundColor: '#64748b', color: '#fff', fontSize: '0.68rem', padding: '0.15rem 0.45rem' }}
                          >
                            {log.source || '-'}
                          </span>
                        </td>
                        <td style={{ padding: '8px 12px' }}>
                          {getStatusBadge(log.status)}
                        </td>
                        <td
                          style={{ padding: '8px 12px', maxWidth: '150px', fontSize: '0.78rem' }}
                          className='text-truncate text-muted'
                          title={log.leadgenId}
                        >
                          {log.leadgenId || '-'}
                        </td>
                        {fieldColumns.map((col) => (
                          <td
                            key={col}
                            style={{ padding: '8px 12px', maxWidth: '200px', fontSize: '0.78rem' }}
                            className='text-truncate'
                            title={getFieldValue(log, col)}
                          >
                            {getFieldValue(log, col)}
                          </td>
                        ))}
                        <td style={{ padding: '8px 12px', whiteSpace: 'nowrap', fontSize: '0.78rem' }} className='text-muted'>
                          {formatDate(log.createdAt)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className='card-footer d-flex justify-content-between align-items-center'>
                <span className='text-muted' style={{ fontSize: '0.8rem' }}>
                  Showing {(page - 1) * pagination.limit + 1} -{' '}
                  {Math.min(page * pagination.limit, pagination.total)} of {pagination.total}
                </span>
                <ul className='pagination pagination-sm mb-0'>
                  <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
                    <button className='page-link' onClick={() => handlePageChange(1)}>
                      <i className='ri-skip-back-mini-line'></i>
                    </button>
                  </li>
                  <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
                    <button className='page-link' onClick={() => handlePageChange(page - 1)}>
                      <i className='ri-arrow-left-s-line'></i>
                    </button>
                  </li>
                  {(() => {
                    const items = [];
                    const maxVisible = 5;
                    let start = Math.max(1, page - Math.floor(maxVisible / 2));
                    let end = Math.min(pagination.totalPages, start + maxVisible - 1);
                    if (end - start + 1 < maxVisible) {
                      start = Math.max(1, end - maxVisible + 1);
                    }
                    if (start > 1) {
                      items.push(
                        <li key='s-dots' className='page-item disabled'>
                          <span className='page-link'>...</span>
                        </li>,
                      );
                    }
                    for (let i = start; i <= end; i++) {
                      items.push(
                        <li key={i} className={`page-item ${page === i ? 'active' : ''}`}>
                          <button className='page-link' onClick={() => handlePageChange(i)}>
                            {i}
                          </button>
                        </li>,
                      );
                    }
                    if (end < pagination.totalPages) {
                      items.push(
                        <li key='e-dots' className='page-item disabled'>
                          <span className='page-link'>...</span>
                        </li>,
                      );
                    }
                    return items;
                  })()}
                  <li className={`page-item ${page === pagination.totalPages ? 'disabled' : ''}`}>
                    <button className='page-link' onClick={() => handlePageChange(page + 1)}>
                      <i className='ri-arrow-right-s-line'></i>
                    </button>
                  </li>
                  <li className={`page-item ${page === pagination.totalPages ? 'disabled' : ''}`}>
                    <button className='page-link' onClick={() => handlePageChange(pagination.totalPages)}>
                      <i className='ri-skip-forward-mini-line'></i>
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        )}
      </Container>
    </div>
  );
};

export default LogsPage;

import React, { useEffect, useState, useCallback } from 'react';
import { listMeetupReports, updateReportStatus, Report } from '../api/admin';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Pagination from '../components/ui/Pagination';
import Spinner from '../components/ui/Spinner';
import Table from '../components/ui/Table';

export default function MeetupReports() {
  const [reports, setReports] = useState<Report[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const perPage = 15;

  const fetchReports = useCallback(async () => {
    setLoading(true);
    try {
      const params: any = { page, per_page: perPage };
      if (statusFilter) params.status = statusFilter;
      const res = await listMeetupReports(params);
      setReports(res.reports);
      setTotal(res.total);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const handleStatusUpdate = async (reportId: string, status: string) => {
    try {
      await updateReportStatus(reportId, status);
      fetchReports();
    } catch (err) {
      console.error(err);
    }
  };

  const totalPages = Math.ceil(total / perPage);

  const badgeVariant = (status: string) => {
    const map: Record<string, 'warning' | 'info' | 'success' | 'default'> = {
      pending: 'warning',
      reviewed: 'info',
      resolved: 'success',
      dismissed: 'default',
    };
    return map[status] || 'default';
  };

  return (
    <div className="table-container">
      <div className="table-header">
        <h3>Unsafe Meetup Reports ({total})</h3>
        <div className="table-toolbar">
          <select
            className="filter-select"
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="reviewed">Reviewed</option>
            <option value="resolved">Resolved</option>
            <option value="dismissed">Dismissed</option>
          </select>
        </div>
      </div>
      {loading ? (
        <div className="loading"><Spinner /></div>
      ) : reports.length === 0 ? (
        <div className="empty-state">No unsafe meetup reports</div>
      ) : (
        <>
          <Table>
            <Table.Head>
              <tr>
                <th>Reporter</th>
                <th>Reported User</th>
                <th>Description</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </Table.Head>
            <Table.Body>
              {reports.map((r) => (
                <Table.Row key={r.id}>
                  <Table.Cell>{r.reporter_name || 'N/A'}</Table.Cell>
                  <Table.Cell>{r.reported_user_name || 'N/A'}</Table.Cell>
                  <Table.Cell style={{ maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {r.description || '-'}
                  </Table.Cell>
                  <Table.Cell>
                    <Badge variant={badgeVariant(r.status)}>{r.status}</Badge>
                  </Table.Cell>
                  <Table.Cell>{r.created_at ? new Date(r.created_at).toLocaleDateString() : '-'}</Table.Cell>
                  <Table.Cell>
                    <div className="action-cell">
                      {r.status === 'pending' && (
                        <>
                          <Button variant="primary" size="sm" onClick={() => handleStatusUpdate(r.id, 'reviewed')}>Review</Button>
                          <Button variant="danger" size="sm" onClick={() => handleStatusUpdate(r.id, 'dismissed')}>Dismiss</Button>
                        </>
                      )}
                      {r.status === 'reviewed' && (
                        <>
                          <Button variant="success" size="sm" onClick={() => handleStatusUpdate(r.id, 'resolved')}>Resolve</Button>
                          <Button variant="danger" size="sm" onClick={() => handleStatusUpdate(r.id, 'dismissed')}>Dismiss</Button>
                        </>
                      )}
                    </div>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
          <Pagination page={page} totalPages={totalPages} onChange={setPage} />
        </>
      )}
    </div>
  );
}

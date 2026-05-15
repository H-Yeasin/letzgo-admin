import React, { useEffect, useState, useCallback } from 'react';
import { listReports, updateReportStatus, Report } from '../api/admin';

export default function Reports() {
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
            const res = await listReports(params);
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

    const statusBadge = (status: string) => {
        const map: Record<string, string> = {
            pending: 'badge-warning',
            reviewed: 'badge-info',
            resolved: 'badge-success',
            dismissed: 'badge-gray',
        };
        return map[status] || 'badge-gray';
    };

    return (
        <div className="table-container">
            <div className="table-header">
                <h3>User Reports ({total})</h3>
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
                <div className="loading"><div className="spinner" /></div>
            ) : reports.length === 0 ? (
                <div className="empty-state">No reports found</div>
            ) : (
                <>
                    <table>
                        <thead>
                            <tr>
                                <th>Reporter</th>
                                <th>Reported User</th>
                                <th>Reason</th>
                                <th>Description</th>
                                <th>Status</th>
                                <th>Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reports.map((r) => (
                                <tr key={r.id}>
                                    <td>{r.reporter_name || 'N/A'}</td>
                                    <td>{r.reported_user_name || 'N/A'}</td>
                                    <td><span className="badge badge-info">{r.reason}</span></td>
                                    <td style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                        {r.description || '-'}
                                    </td>
                                    <td>
                                        <span className={`badge ${statusBadge(r.status)}`}>
                                            {r.status}
                                        </span>
                                    </td>
                                    <td>{r.created_at ? new Date(r.created_at).toLocaleDateString() : '-'}</td>
                                    <td>
                                        <div className="action-cell">
                                            {r.status === 'pending' && (
                                                <>
                                                    <button className="btn btn-sm btn-primary" onClick={() => handleStatusUpdate(r.id, 'reviewed')}>
                                                        Review
                                                    </button>
                                                    <button className="btn btn-sm btn-danger" onClick={() => handleStatusUpdate(r.id, 'dismissed')}>
                                                        Dismiss
                                                    </button>
                                                </>
                                            )}
                                            {r.status === 'reviewed' && (
                                                <>
                                                    <button className="btn btn-sm btn-success" onClick={() => handleStatusUpdate(r.id, 'resolved')}>
                                                        Resolve
                                                    </button>
                                                    <button className="btn btn-sm btn-danger" onClick={() => handleStatusUpdate(r.id, 'dismissed')}>
                                                        Dismiss
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="pagination">
                        <button className="page-btn" disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</button>
                        <span className="page-info">Page {page} of {totalPages}</span>
                        <button className="page-btn" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>Next</button>
                    </div>
                </>
            )}
        </div>
    );
}
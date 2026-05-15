import React, { useEffect, useState, useCallback } from 'react';
import { listDisputes, resolveDispute, Dispute } from '../api/admin';

export default function Disputes() {
    const [disputes, setDisputes] = useState<Dispute[]>([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const perPage = 15;

    const fetchDisputes = useCallback(async () => {
        setLoading(true);
        try {
            const res = await listDisputes({ page, per_page: perPage });
            setDisputes(res.disputes);
            setTotal(res.total);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [page]);

    useEffect(() => {
        fetchDisputes();
    }, [fetchDisputes]);

    const handleResolve = async (disputeId: string, status: string) => {
        try {
            await resolveDispute(disputeId, status);
            fetchDisputes();
        } catch (err) {
            console.error(err);
        }
    };

    const totalPages = Math.ceil(total / perPage);

    return (
        <div className="table-container">
            <div className="table-header">
                <h3>Open Disputes ({total})</h3>
            </div>
            {loading ? (
                <div className="loading"><div className="spinner" /></div>
            ) : disputes.length === 0 ? (
                <div className="empty-state">No disputes to review</div>
            ) : (
                <>
                    <table>
                        <thead>
                            <tr>
                                <th>Host</th>
                                <th>Guest</th>
                                <th>Status</th>
                                <th>Started</th>
                                <th>Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {disputes.map((d) => (
                                <tr key={d.id}>
                                    <td>{d.host_name || 'N/A'}</td>
                                    <td>{d.guest_name || 'N/A'}</td>
                                    <td>
                                        <span className="badge badge-danger">{d.status}</span>
                                    </td>
                                    <td>{d.started_at ? new Date(d.started_at).toLocaleString() : '-'}</td>
                                    <td>{d.created_at ? new Date(d.created_at).toLocaleDateString() : '-'}</td>
                                    <td>
                                        <div className="action-cell">
                                            <button
                                                className="btn btn-sm btn-success"
                                                onClick={() => handleResolve(d.id, 'completed')}
                                            >
                                                Resolve
                                            </button>
                                            <button
                                                className="btn btn-sm btn-danger"
                                                onClick={() => handleResolve(d.id, 'cancelled')}
                                            >
                                                Dismiss
                                            </button>
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
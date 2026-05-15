import React, { useEffect, useState } from 'react';
import { listActiveRides, Ride } from '../api/admin';

export default function ActiveRides() {
    const [rides, setRides] = useState<Ride[]>([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const perPage = 15;

    useEffect(() => {
        setLoading(true);
        listActiveRides({ page, per_page: perPage })
            .then((res) => {
                setRides(res.rides);
                setTotal(res.total);
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [page]);

    const totalPages = Math.ceil(total / perPage);

    return (
        <div className="table-container">
            <div className="table-header">
                <h3>Active Rides ({total})</h3>
            </div>
            {loading ? (
                <div className="loading"><div className="spinner" /></div>
            ) : rides.length === 0 ? (
                <div className="empty-state">No active rides</div>
            ) : (
                <>
                    <table>
                        <thead>
                            <tr>
                                <th>Host</th>
                                <th>Destination</th>
                                <th>Pickup Area</th>
                                <th>Fare</th>
                                <th>Status</th>
                                <th>Guests</th>
                                <th>Cancelled</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rides.map((r) => (
                                <tr key={r.id}>
                                    <td>{r.host_name || 'N/A'}</td>
                                    <td>{r.destination_text}</td>
                                    <td>{r.pickup_area || 'N/A'}</td>
                                    <td>৳{r.estimated_fare}</td>
                                    <td>
                                        <span className={`badge ${r.status === 'matched' ? 'badge-info' : 'badge-warning'}`}>
                                            {r.status}
                                        </span>
                                    </td>
                                    <td>{r.guest_count}</td>
                                    <td>{r.cancelled_count}</td>
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
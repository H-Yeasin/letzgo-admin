import React, { useEffect, useState } from 'react';
import { listCompletedRides, Ride } from '../api/admin';

export default function CompletedRides() {
    const [rides, setRides] = useState<Ride[]>([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const perPage = 15;

    useEffect(() => {
        setLoading(true);
        listCompletedRides({ page, per_page: perPage })
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
                <h3>Completed Rides ({total})</h3>
            </div>
            {loading ? (
                <div className="loading"><div className="spinner" /></div>
            ) : rides.length === 0 ? (
                <div className="empty-state">No completed rides</div>
            ) : (
                <>
                    <table>
                        <thead>
                            <tr>
                                <th>Host</th>
                                <th>Destination</th>
                                <th>Pickup</th>
                                <th>Fare</th>
                                <th>Guests</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rides.map((r) => (
                                <tr key={r.id}>
                                    <td>{r.host_name || 'N/A'}</td>
                                    <td>{r.destination_text}</td>
                                    <td>{r.pickup_area || 'N/A'}</td>
                                    <td>৳{r.final_fare || r.estimated_fare}</td>
                                    <td>{r.guest_count}</td>
                                    <td><span className="badge badge-success">completed</span></td>
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
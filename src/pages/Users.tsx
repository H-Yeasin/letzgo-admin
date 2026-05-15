import React, { useEffect, useState, useCallback } from 'react';
import { listUsers, blockUser, unblockUser, User } from '../api/admin';

export default function Users() {
    const [users, setUsers] = useState<User[]>([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [filterBlocked, setFilterBlocked] = useState<string>('all');
    const [loading, setLoading] = useState(true);
    const perPage = 15;

    const fetchUsers = useCallback(async () => {
        setLoading(true);
        try {
            const params: any = { page, per_page: perPage };
            if (search) params.search = search;
            if (filterBlocked !== 'all') params.is_blocked = filterBlocked === 'blocked';
            const res = await listUsers(params);
            setUsers(res.users);
            setTotal(res.total);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [page, search, filterBlocked]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const handleBlock = async (userId: string) => {
        try {
            await blockUser(userId);
            fetchUsers();
        } catch (err) {
            console.error(err);
        }
    };

    const handleUnblock = async (userId: string) => {
        try {
            await unblockUser(userId);
            fetchUsers();
        } catch (err) {
            console.error(err);
        }
    };

    const totalPages = Math.ceil(total / perPage);

    return (
        <div className="table-container">
            <div className="table-header">
                <h3>All Users ({total})</h3>
                <div className="table-toolbar">
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Search by name or phone..."
                        value={search}
                        onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                    />
                    <select
                        className="filter-select"
                        value={filterBlocked}
                        onChange={(e) => { setFilterBlocked(e.target.value); setPage(1); }}
                    >
                        <option value="all">All Users</option>
                        <option value="blocked">Blocked Only</option>
                        <option value="unblocked">Unblocked Only</option>
                    </select>
                </div>
            </div>
            {loading ? (
                <div className="loading"><div className="spinner" /></div>
            ) : users.length === 0 ? (
                <div className="empty-state">No users found</div>
            ) : (
                <>
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Phone</th>
                                <th>Rating</th>
                                <th>Rides</th>
                                <th>Verified</th>
                                <th>Blocked</th>
                                <th>Admin</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((u) => (
                                <tr key={u.id}>
                                    <td><strong>{u.name}</strong></td>
                                    <td>{u.phone}</td>
                                    <td>{u.rating_avg.toFixed(1)}</td>
                                    <td>{u.completed_rides_count}</td>
                                    <td>
                                        <span className={`badge ${u.is_verified ? 'badge-success' : 'badge-gray'}`}>
                                            {u.is_verified ? 'Yes' : 'No'}
                                        </span>
                                    </td>
                                    <td>
                                        <span className={`badge ${u.is_blocked ? 'badge-danger' : 'badge-success'}`}>
                                            {u.is_blocked ? 'Blocked' : 'Active'}
                                        </span>
                                    </td>
                                    <td>
                                        <span className={`badge ${u.is_admin ? 'badge-info' : 'badge-gray'}`}>
                                            {u.is_admin ? 'Admin' : 'No'}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="action-cell">
                                            {u.is_blocked ? (
                                                <button
                                                    className="btn btn-sm btn-success"
                                                    onClick={() => handleUnblock(u.id)}
                                                >
                                                    Unblock
                                                </button>
                                            ) : (
                                                <button
                                                    className="btn btn-sm btn-danger"
                                                    onClick={() => handleBlock(u.id)}
                                                    disabled={u.is_admin}
                                                    title={u.is_admin ? 'Cannot block admin' : ''}
                                                >
                                                    Block
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="pagination">
                        <button
                            className="page-btn"
                            disabled={page <= 1}
                            onClick={() => setPage(page - 1)}
                        >
                            Previous
                        </button>
                        {Array.from({ length: Math.min(totalPages, 10) }, (_, i) => {
                            const startPage = Math.max(1, page - 4);
                            const p = startPage + i;
                            if (p > totalPages) return null;
                            return (
                                <button
                                    key={p}
                                    className={`page-btn ${p === page ? 'active' : ''}`}
                                    onClick={() => setPage(p)}
                                >
                                    {p}
                                </button>
                            );
                        })}
                        <button
                            className="page-btn"
                            disabled={page >= totalPages}
                            onClick={() => setPage(page + 1)}
                        >
                            Next
                        </button>
                        <span className="page-info">Page {page} of {totalPages}</span>
                    </div>
                </>
            )}
        </div>
    );
}
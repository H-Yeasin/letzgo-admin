import React, { useEffect, useState, useCallback } from 'react';
import { listUsers, blockUser, unblockUser, User } from '../api/admin';
import { Search } from 'lucide-react';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Pagination from '../components/ui/Pagination';
import Spinner from '../components/ui/Spinner';
import Table from '../components/ui/Table';

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
          <Input
            icon={<Search size={16} />}
            type="text"
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
        <div className="loading"><Spinner /></div>
      ) : users.length === 0 ? (
        <div className="empty-state">No users found</div>
      ) : (
        <>
          <Table>
            <Table.Head>
              <tr>
                <th>Name</th>
                <th>Phone</th>
                <th>Rating</th>
                <th>Rides</th>
                <th>Verified</th>
                <th>Status</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </Table.Head>
            <Table.Body>
              {users.map((u) => (
                <Table.Row key={u.id}>
                  <Table.Cell><strong>{u.name}</strong></Table.Cell>
                  <Table.Cell>{u.phone}</Table.Cell>
                  <Table.Cell>{u.rating_avg.toFixed(1)}</Table.Cell>
                  <Table.Cell>{u.completed_rides_count}</Table.Cell>
                  <Table.Cell>
                    <Badge variant={u.is_verified ? 'success' : 'default'}>
                      {u.is_verified ? 'Yes' : 'No'}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell>
                    <Badge variant={u.is_blocked ? 'danger' : 'success'}>
                      {u.is_blocked ? 'Blocked' : 'Active'}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell>
                    <Badge variant={u.is_admin ? 'info' : 'default'}>
                      {u.is_admin ? 'Admin' : 'User'}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell>
                    <div className="action-cell">
                      {u.is_blocked ? (
                        <Button variant="success" size="sm" onClick={() => handleUnblock(u.id)}>
                          Unblock
                        </Button>
                      ) : (
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleBlock(u.id)}
                          disabled={u.is_admin}
                          title={u.is_admin ? 'Cannot block admin' : ''}
                        >
                          Block
                        </Button>
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

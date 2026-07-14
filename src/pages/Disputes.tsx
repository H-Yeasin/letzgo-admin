import React, { useEffect, useState, useCallback } from 'react';
import { listDisputes, resolveDispute, Dispute } from '../api/admin';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Pagination from '../components/ui/Pagination';
import Spinner from '../components/ui/Spinner';
import Table from '../components/ui/Table';

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
        <div className="loading"><Spinner /></div>
      ) : disputes.length === 0 ? (
        <div className="empty-state">No disputes to review</div>
      ) : (
        <>
          <Table>
            <Table.Head>
              <tr>
                <th>Host</th>
                <th>Guest</th>
                <th>Status</th>
                <th>Started</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </Table.Head>
            <Table.Body>
              {disputes.map((d) => (
                <Table.Row key={d.id}>
                  <Table.Cell>{d.host_name || 'N/A'}</Table.Cell>
                  <Table.Cell>{d.guest_name || 'N/A'}</Table.Cell>
                  <Table.Cell>
                    <Badge variant="danger">{d.status}</Badge>
                  </Table.Cell>
                  <Table.Cell>{d.started_at ? new Date(d.started_at).toLocaleString() : '-'}</Table.Cell>
                  <Table.Cell>{d.created_at ? new Date(d.created_at).toLocaleDateString() : '-'}</Table.Cell>
                  <Table.Cell>
                    <div className="action-cell">
                      <Button
                        variant="success"
                        size="sm"
                        onClick={() => handleResolve(d.id, 'completed')}
                      >
                        Resolve
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleResolve(d.id, 'cancelled')}
                      >
                        Dismiss
                      </Button>
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

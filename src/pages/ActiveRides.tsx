import React, { useEffect, useState } from 'react';
import { listActiveRides, Ride } from '../api/admin';
import Badge from '../components/ui/Badge';
import Pagination from '../components/ui/Pagination';
import Spinner from '../components/ui/Spinner';
import Table from '../components/ui/Table';

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

  const statusVariant = (status: string) => {
    switch (status) {
      case 'matched': return 'info' as const;
      default: return 'warning' as const;
    }
  };

  return (
    <div className="table-container">
      <div className="table-header">
        <h3>Active Rides ({total})</h3>
      </div>
      {loading ? (
        <div className="loading"><Spinner /></div>
      ) : rides.length === 0 ? (
        <div className="empty-state">No active rides</div>
      ) : (
        <>
          <Table>
            <Table.Head>
              <tr>
                <th>Host</th>
                <th>Destination</th>
                <th>Pickup Area</th>
                <th>Fare</th>
                <th>Status</th>
                <th>Guests</th>
                <th>Cancelled</th>
              </tr>
            </Table.Head>
            <Table.Body>
              {rides.map((r) => (
                <Table.Row key={r.id}>
                  <Table.Cell><strong>{r.host_name || 'N/A'}</strong></Table.Cell>
                  <Table.Cell>{r.destination_text}</Table.Cell>
                  <Table.Cell>{r.pickup_area || 'N/A'}</Table.Cell>
                  <Table.Cell>৳{r.estimated_fare}</Table.Cell>
                  <Table.Cell>
                    <Badge variant={statusVariant(r.status)}>
                      {r.status}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell>{r.guest_count}</Table.Cell>
                  <Table.Cell>{r.cancelled_count}</Table.Cell>
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

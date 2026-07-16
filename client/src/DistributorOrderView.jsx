import { useState, useEffect } from 'react'
import { useQuery, useMutation, useSubscription } from '@apollo/client/react'
import { GET_ORDERS, UPDATE_ORDER_STATUS, ORDER_CREATED, ORDER_UPDATED } from './graphql'

const NEXT_STATUS = {
  PENDING: 'PROCESSING',
  PROCESSING: 'SHIPPING',
  SHIPPING: 'ARRIVED'
}

export default function DistributorOrdersView() {
  const { data, loading, refetch } = useQuery(GET_ORDERS, {
    variables: { contractorId: null }
  })

  const [updateStatus] = useMutation(UPDATE_ORDER_STATUS)

  useSubscription(ORDER_CREATED, { onData: () => refetch() })
  useSubscription(ORDER_UPDATED, { onData: () => refetch() })

  const [sortKey, setSortKey] = useState('createdAt')

  if (loading) return <p>Loading...</p>

  const sorted = [...data.orders].sort((a, b) => {
    switch (sortKey) {
      case 'status':
        return a.status.localeCompare(b.status)
      case 'contractor':
        return a.contractor.name.localeCompare(b.contractor.name)
      case 'item':
        return a.part.name.localeCompare(b.part.name)
      default:
        return new Date(b.createdAt) - new Date(a.createdAt)
    }
  })

  return (
    <div>
      <h2>Distributor Orders</h2>

      <select value={sortKey} onChange={(e) => setSortKey(e.target.value)}>
        <option value="createdAt">Newest</option>
        <option value="status">Status</option>
        <option value="contractor">Contractor</option>
        <option value="item">Item</option>
      </select>

      <table>
        <thead>
          <tr>
            <th>Status</th>
            <th>Contractor</th>
            <th>Item</th>
            <th>Amount</th>
            <th>Created</th>
            <th>Advance</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map(o => (
            <tr key={o.id}>
              <td>{o.status}</td>
              <td>{o.contractor.name}</td>
              <td>{o.part.name}</td>
              <td>{o.orderedAmount}</td>
              <td>{new Date(o.createdAt).toLocaleString()}</td>
              <td>
                {NEXT_STATUS[o.status] && (
                  <button
                    onClick={() =>
                      updateStatus({
                        variables: { id: o.id, status: NEXT_STATUS[o.status] }
                      })
                    }
                  >
                    Mark {NEXT_STATUS[o.status]}
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

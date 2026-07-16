import { useQuery, useMutation, useSubscription } from '@apollo/client/react'
import { GET_ORDERS, UPDATE_ORDER_STATUS, ORDER_CREATED, ORDER_UPDATED } from './graphql'

const NEXT_STATUS = { PENDING: 'PROCESSING', PROCESSING: 'SHIPPING', SHIPPING: 'ARRIVED' }

export default function DistributorView() {
  const { data, loading, refetch } = useQuery(GET_ORDERS, { variables: { contractorId: null } })
  const [updateStatus] = useMutation(UPDATE_ORDER_STATUS)

  useSubscription(ORDER_CREATED, { onData: () => refetch() })
  useSubscription(ORDER_UPDATED, { onData: () => refetch() })

  if (loading) return <p>Loading...</p>

  return (
    <div>
      <h2>Distributor View</h2>
      <ul>
        {data.orders.map((o) => (
          <li key={o.id}>
            {o.contractor.name}: {o.part.name} x{o.orderedAmount} — {o.status}
            {NEXT_STATUS[o.status] && (
              <button onClick={() => updateStatus({ variables: { id: o.id, status: NEXT_STATUS[o.status] } })}>
                Mark {NEXT_STATUS[o.status]}
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
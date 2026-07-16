import { useState } from 'react'
import { useQuery, useMutation, useSubscription } from '@apollo/client/react'
import { GET_ORDERS, GET_CONTRACTORS, GET_PARTS, CREATE_ORDER, ORDER_CREATED, ORDER_UPDATED } from './graphql'

export default function ContractorView() {
  const { data: contractorsData } = useQuery(GET_CONTRACTORS)
  const { data: partsData } = useQuery(GET_PARTS)
  const [contractorId, setContractorId] = useState(null)

  const { data, loading, refetch } = useQuery(GET_ORDERS, {
    variables: { contractorId },
    skip: !contractorId,
  })
  const [createOrder, { error }] = useMutation(CREATE_ORDER)
  const [partId, setPartId] = useState('')
  const [orderedAmount, setOrderedAmount] = useState(1)

  useSubscription(ORDER_CREATED, { onData: () => contractorId && refetch() })
  useSubscription(ORDER_UPDATED, { onData: () => contractorId && refetch() })

  const submit = async (e) => {
    e.preventDefault()
    try {
      await createOrder({
        variables: { partId: Number(partId), orderedAmount: Number(orderedAmount), contractorId },
      })
      setPartId('')
      setOrderedAmount(1)
    } catch (err) {
      // Intentionally empty — useMutation's `error` state below already
      // captures this and renders it. We just need to stop the throw
      // from propagating as an unhandled rejection.
    }
  }

  return (
    <div>
      <h2>Contractor View</h2>
      <label>
        I am:{' '}
        <select value={contractorId ?? ''} onChange={(e) => setContractorId(Number(e.target.value))}>
          <option value="">-- select contractor --</option>
          {contractorsData?.contractors.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </label>

      {contractorId && (
        <>
          <form onSubmit={submit}>
            <select value={partId} onChange={(e) => setPartId(e.target.value)} required>
              <option value="">-- select part --</option>
              {partsData?.parts.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
            <input type="number" min="1" value={orderedAmount} onChange={(e) => setOrderedAmount(e.target.value)} />
            <button type="submit">Request Order</button>
          </form>
          {error && <p style={{ color: 'red' }}>{error.message}</p>}

          {loading ? (
            <p>Loading...</p>
          ) : (
            <ul>
              {data?.orders.map((o) => (
                <li key={o.id}>{o.part.name} x{o.orderedAmount} — {o.status}</li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  )
}
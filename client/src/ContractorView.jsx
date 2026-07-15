import { useState } from 'react'
import { useQuery, useMutation, useSubscription } from '@apollo/client/react'
import { GET_ORDERS, CREATE_ORDER, ORDER_CREATED, ORDER_UPDATED } from './graphql'

export default function ContractorView() {
  const { data, loading, refetch } = useQuery(GET_ORDERS)
  const [createOrder] = useMutation(CREATE_ORDER)
  const [partName, setPartName] = useState('')
  const [quantity, setQuantity] = useState(1)

  useSubscription(ORDER_CREATED, { onData: () => refetch() })
  useSubscription(ORDER_UPDATED, { onData: () => refetch() })

  const submit = async (e) => {
    e.preventDefault()
    await createOrder({ variables: { partName, quantity: Number(quantity) } })
    setPartName('')
    setQuantity(1)
  }

  if (loading) return <p>Loading...</p>

  return (
    <div>
      <h2>Contractor View</h2>
      <form onSubmit={submit}>
        <input value={partName} onChange={(e) => setPartName(e.target.value)} placeholder="Part name" required />
        <input type="number" min="1" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
        <button type="submit">Request Order</button>
      </form>
      <ul>
        {data.orders.map((o) => (
          <li key={o.id}>{o.partName} x{o.quantity} — {o.status}</li>
        ))}
      </ul>
    </div>
  )
}